// Feed A, kill B. Reaction equation is: 2B + A -> 3B.
// A is blue, B is red.
// Extra notes at the bottom of the script.

// 		  Mitosis: feed=0.0367, kill=0.0649
//   Coral growth: feed=0.0545, kill=0.062
// U skate region: feed=0.0620, kill=0.0609


// Diffusion and feed/kill constants
var Da = 1.0;
var Db = 0.5;
var feed  = 0.0545;
var kill  = 0.062;

// Starting concentrations across grid
var start_a = 1;
var start_b = 0;

// Grid size and seed size (area seeded with b, replaced by drawing now)
var LX = 220;
var LY = 220;
var seed_width = 0;
var seed_height = 0;

// Timestep and number of timesteps to take before drawing
var timestep = 1;
var n_draw = 10;

// Amount B concentration is increased by paintbrush
var add_amount = 0.8;

// Start screen displayed, simulation paused
var start = true;
var play = false;
var touched = false;
var draw_rate = 1;

// Background colour
var myred = 0;
var mygreen = 100;
var myblue = 160;
var myalpha = 100;

// Parameters describing how the concentration of b affects colour
var red_mult = 6000;
var red_level = 0.32;
var alpha_mult = 360;

// nice colour scheme
// var myred = 0;
// var mygreen = 60; 100
// var myblue = 60; 160
// var myalpha = 100;

// var red_mult = 6000;
// var red_level = 0.34; 0.31
// var alpha_mult = 360;

function setup(){
	// Force pixel density
	pixelDensity(1);

	// Initialise grids
	curr_grid = new Grid(LX, LY, start_a, start_b, seed_width, seed_height);
	next_grid = new Grid(LX, LY, start_a, start_b, seed_width, seed_height);
}

function draw(){
	// Find number of tiles needed to tile window, and draw the canvas
	var x_tilenum = windowWidth / LX;
	var y_tilenum = windowHeight / LY;
	createCanvas(x_tilenum*LX, y_tilenum*LY);

	var curr_vals = curr_grid.grid;
	var next_vals = next_grid.grid;

	// Update the grid values draw_rate times
	for (var n = 0; n < draw_rate; n++){

		// Allow for in-simulation drawing of b
		if (mouseIsPressed || touched){
			brush_stroke([curr_vals, next_vals]);
		}

		// Carry out the calculations across grid for one timestep
		for (var x = 0; x < LX; x++){
			for (var y = 0; y < LY; y++){
				var a = curr_vals[x][y].a;
				var b = curr_vals[x][y].b;

				var rate_of_change_a = 0;
				var rate_of_change_b = 0;

				// Carry out rate calcutions if simulations is running
				if (play){
				rate_of_change_a += Da*curr_grid.laplacian(x, y, 'a')
							        - a*b*b
							        + feed*(1 - a);
				rate_of_change_b += Db*curr_grid.laplacian(x, y, 'b')
							        + a*b*b
							        - (kill + feed)*b;
				}

				// Add extra b from drawing
				if (curr_vals[x][y].add){
					rate_of_change_b += add_amount;
				}

				// Update values
				next_vals[x][y].a = a + (rate_of_change_a * timestep);
				next_vals[x][y].b = b + (rate_of_change_b * timestep);

				// Limit b to be lower than 0.9 (required due to drawing)
				if (next_vals[x][y].b > 0.9){
					next_vals[x][y].b = 0.9;
				}

				// Reset drawing variable
				curr_vals[x][y].add = false;
				next_vals[x][y].add = false;
			}
		}

		// Update the grid with the new values
		curr_grid.grid = next_grid.grid;
	}

	// Draw the frame
	loadPixels();
	for (var x = 0; x < width; x++){
		for (var y = 0; y < height; y++){
			var pixel = (x + y*width)*4;
			grid_x = x % LX;
			grid_y = y % LY;

			var b = curr_vals[grid_x][grid_y].b;

			pixels[pixel + 0] = myred + floor(red_mult*(b-red_level)); // red
			pixels[pixel + 1] = mygreen; // green
			pixels[pixel + 2] = myblue; // blue
			pixels[pixel + 3] = myalpha + floor(alpha_mult*b); // alpha
		}
	}
	updatePixels();

	if (start){
		// Start screen
		textStyle(ITALIC);
		textAlign(CENTER);
		textSize(48);
		fill(255,255,255);
		text("draw something", width/2, height*6/20);
		textSize(24);
		text("space to play/pause", width/2, height*12/20);
		text("up to increase brush size", width/2, height*13/20);
		text("down to decrease brush size", width/2, height*14/20);
		text("m to enter mitosis mode", width/2, height*15/20);
		text("c to enter coral mode", width/2, height*16/20);
	} else if (!play){
		// Pause screen
		textStyle(ITALIC);
		textAlign(CENTER);
		textSize(48);
		fill(255,255,255);
		text("paused", width/2, height*7/20);
		textSize(24);
		text("up to increase brush size", width/2, height*12/20);
		text("down to decrease brush size", width/2, height*13/20);
		text("m to enter mitosis mode", width/2, height*14/20);
		text("c to enter coral mode", width/2, height*15/20);
	}
}

// Additional options can give more possible effects:
// Orientation: diffusion can occur faster in one direction than another to give an orientation to the results.
// Style Map: the feed and kill rates can vary across the grid to give different patterns in different areas.
// Flow: the chemicals can flow across the grid to give various dynamic effects.
// Size: the scale of the pattern changes when the reaction rate is sped up or slowed down relative to the diffusion rate.

// Acorn motif!
	// var Da = 1.0;
	// var Db = 0.5;
	// var feed  = 0.0545; // 0.055
	// var kill  = 0.062; // 0.062 

	// var LX = 150;
	// var LY = 150;
	// var seed_width = 95;
	// var seed_height = 95;

// Backbone creator
	// var Da = 1.0;
	// var Db = 0.5;
	// var feed  = 0.0545; // 0.055
	// var kill  = 0.062; // 0.062 

	// var LX = 150;
	// var LY = 150;
	// var seed_width = 150;
	// var seed_height = 5 or 40;

// Tail
	// var Da = 1.0;
	// var Db = 0.20;
	// var feed  = 0.0367; // 0.055
	// var kill  = 0.0649; // 0.062 

	// var LX = 400;
	// var LY = 40;
	// var seed_width = 10;
	// var seed_height = 40;

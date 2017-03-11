// Main script

// Diffusion and feed/kill constants
var Da = 1.0;
var Db = 0.5;
var feed  = 0.0545;
var kill  = 0.062;

// Starting concentrations across grid
var start_a = 1;
var start_b = 0;

// Grid size and seed size (area seeded with b, replaced by drawing now)
var LX = 70;
var LY = 70;
var seed_width = 0;
var seed_height = 0;

// Timestep and number of timesteps to take before drawing
var timestep = 1;
var n_draw = 4;
var pixel_stretch = 2;

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

function setup(){
	// Force pixel density and setup the canvas
	pixelDensity(1);
	createCanvas(windowWidth, windowHeight);

	// Initialise grids
	curr_grid = new Grid(LX, LY, start_a, start_b, seed_width, seed_height);
	next_grid = new Grid(LX, LY, start_a, start_b, seed_width, seed_height);
}

function draw(){
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

			var grid_x = floor((x / pixel_stretch)) % LX;
			var grid_y = floor((y / pixel_stretch)) % LY;
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

// Feed A, kill B. Reaction equation is: 2B + A -> 3B.
// A is blue, B is red.
// Extra notes at the bottom of the script.

// 		Mitosis: feed=0.0367, kill=0.0649
// Coral growth: feed=0.0545, kill=0.062
// F=0.0620, k=0.0609 U skate region... can't find


// Diffusion and feed/kill constants
var Da = 1.0;
var Db = 0.5;
var feed  = 0.0545; // 0.055
var kill  = 0.062; // 0.062 

// Starting concentrations across grid
var start_a = 1;
var start_b = 0;

// Grid size and seed size (area seeded with b, replaced by drawing now)
var LX = 250;
var LY = 100;
var seed_width = 0;
var seed_height = 0;

// Timestep and number of timesteps to take before drawing
var timestep = 1;
var n_draw = 10;

// Weights for Laplacian (3x3 convolution)
var cent_weight = -1.0;
var side_weight = 0.2;
var diag_weight = 0.05;

// Paintbrush properties for drawing seed
var add_width  = 2;
var add_height = 2;
var add_amount = 0.8;

// Number of times grid is repeated in x and y directions
var x_tilenum;
var y_tilenum;

// Simulation grids
var curr_grid;
var next_grid;

// If simulation should be running or paused
var play;

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
	// Calculate number of tiles needed to tile whole screen
	x_tilenum = windowWidth / LX;
	y_tilenum = windowHeight / LY;

	// Create the initial canvas
	createCanvas(x_tilenum*LX, y_tilenum*LY);
	pixelDensity(1);
	play = false;
	draw_rate = 1;

	// Initialise simulation grids
	curr_grid = [];
	next_grid = [];
	for (var x = 0; x < LX; x++){
		curr_grid[x] = [];
		next_grid[x] = [];
		for (var y = 0; y < LY; y++){
				curr_grid[x][y] = {a: start_a, b: start_b, add: false}
				next_grid[x][y] = {a: start_a, b: start_b, add: false}
		}
	}

	// Seed the grid with a patch of b
	for (var i = floor((LX-seed_width)/2); i < floor((LX+seed_width)/2); i++){
		for (var j = floor((LY-seed_height)/2); j < floor((LY+seed_height)/2); j++){
			curr_grid[i][j] = {a: 0, b: 1, add: false};
 	   		next_grid[i][j] = {a: 0, b: 1, add: false};
		}
	}

	// Create background colour state
	loadPixels();
	for (var x = 0; x < width; x++){
		for (var y = 0; y < height; y++){
			var pixel = (x + y*width)*4;

			pixels[pixel + 1] = myred;
			pixels[pixel + 1] = mygreen;
			pixels[pixel + 2] = myblue;
			pixels[pixel + 3] = myalpha;
		}
	}
	updatePixels();
}

function draw(){
	// Update the grid values draw_rate times
	for (var n = 0; n < draw_rate; n++){

		// Allow for in-simulation drawing of b
		if (mouseIsPressed){
			for (var xadd = mouseX-add_width; xadd < mouseX+add_width; xadd++){
				for (var yadd = mouseY-add_height; yadd < mouseY+add_height; yadd++){
					if ((xadd >= 0) && (xadd < width) && 
						(yadd >= 0) && (yadd < height)){
						curr_grid[xadd % LX][yadd % LY].add = true;
						next_grid[xadd % LX][yadd % LY].add = true;
					}
				}
			}
		}

		// Carry out the calculations across grid for one timestep
		for (var x = 0; x < LX; x++){
			for (var y = 0; y < LY; y++){
				var a = curr_grid[x][y].a;
				var b = curr_grid[x][y].b;

				var rate_of_change_a = 0;
				var rate_of_change_b = 0;

				// Carry out rate calcutions if simulations is running
				if (play){
				rate_of_change_a += Da*laplacian_a(x, y)
							        - a*b*b
							        + feed*(1 - a);
				rate_of_change_b += Db*laplacian_b(x, y)
							        + a*b*b
							        - (kill + feed)*b;
				}

				// Add extra b from drawing
				if (curr_grid[x][y].add){
					rate_of_change_b += add_amount;
				}

				// Update values
				next_grid[x][y].a = a + (rate_of_change_a * timestep);
				next_grid[x][y].b = b + (rate_of_change_b * timestep);

				// Limit b to be lower than 1 (required due to drawing)
				if (next_grid[x][y].b > 1){
					next_grid[x][y].b = 1;
				}

				// Reset drawing variable
				curr_grid[x][y].add = false;
				next_grid[x][y].add = false;
			}
		}

		// Update the grid with the new values
		curr_grid = next_grid;
	}

	// Draw the frame
	for (var x = 0; x < width; x++){
		for (var y = 0; y < height; y++){
			var pixel = (x + y*width)*4;
			grid_x = x % LX;
			grid_y = y % LY;

			var b = curr_grid[grid_x][grid_y].b;

			pixels[pixel + 0] = myred + floor(red_mult*(b-red_level)); // red
			// pixels[pixel + 1] = 0; // floor(180*curr_grid[x][y].a);; // green
			// pixels[pixel + 2] = floor(200*curr_grid[grid_x][grid_y].a); // blue
			pixels[pixel + 3] = myalpha + floor(alpha_mult*b); // alpha
		}
	}
	updatePixels();
}

function keyPressed(){
	if (keyCode === 0x20){
		draw_rate=n_draw;
		play = !play;
	} else {
		return false;
	}
}

function laplacian_a(x, y){
	var delta_a = 0;

	var left = find_left(x);
	var right = find_right(x);
	var up = find_up(y);
	var down = find_down(y);

	delta_a += cent_weight * curr_grid[x][y].a;

	delta_a += side_weight * curr_grid[x][up].a;
	delta_a += side_weight * curr_grid[x][down].a;
	delta_a += side_weight * curr_grid[left][y].a;
	delta_a += side_weight * curr_grid[right][y].a;

	delta_a += diag_weight * curr_grid[left][up].a;
	delta_a += diag_weight * curr_grid[left][down].a;
	delta_a += diag_weight * curr_grid[right][up].a;
	delta_a += diag_weight * curr_grid[right][down].a;

	return delta_a
}

function laplacian_b(x, y){
	var delta_b = 0;

	var left = find_left(x);
	var right = find_right(x);
	var up = find_up(y);
	var down = find_down(y);

	delta_b += cent_weight * curr_grid[x][y].b;

	delta_b += side_weight * curr_grid[x][up].b;
	delta_b += side_weight * curr_grid[x][down].b;
	delta_b += side_weight * curr_grid[left][y].b;
	delta_b += side_weight * curr_grid[right][y].b;

	delta_b += diag_weight * curr_grid[left][up].b;
	delta_b += diag_weight * curr_grid[left][down].b;
	delta_b += diag_weight * curr_grid[right][up].b;
	delta_b += diag_weight * curr_grid[right][down].b;

	return delta_b
}

function find_left(x){
	if (x == 0){
		return LX-1
	} else{
		return x-1
	}
}

function find_right(x){
	if (x == LX-1){
		return 0
	} else{
		return x+1
	}
}

function find_up(y){
	if (y == 0){
		return LY-1
	} else{
		return y-1
	}
}

function find_down(y){
	if (y == LY-1){
		return 0
	} else{
		return y+1
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

	// var timestep = 1;
	// var n_draw = 30;

	// var cent_weight = -1.0;
	// var side_weight = 0.2;
	// var diag_weight = 0.05;

// Backbone creator
	// var Da = 1.0;
	// var Db = 0.5;
	// var feed  = 0.0545; // 0.055
	// var kill  = 0.062; // 0.062 

	// var LX = 150;
	// var LY = 150;
	// var seed_width = 150;
	// var seed_height = 5 or 40;

	// var timestep = 1;
	// var n_draw = 30;

// Tail
	// var Da = 1.0;
	// var Db = 0.20;
	// var feed  = 0.0367; // 0.055
	// var kill  = 0.0649; // 0.062 

	// var LX = 400;
	// var LY = 40;
	// var seed_width = 10;
	// var seed_height = 40;

	// var timestep = 1;
	// var n_draw = 18;

	// var cent_weight = -1.0;
	// var side_weight = 0.2;
	// var diag_weight = 0.05;
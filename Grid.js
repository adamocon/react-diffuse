// Grid class

function Grid(LX, LY, start_a, start_b, seed_width, seed_height) {
	this.grid = [];

	// Weights for Laplacian (3x3 convolution)
	var cent_weight = -1.0;
	var side_weight = 0.2;
	var diag_weight = 0.05;

	// Initialise grid
	for (var x = 0; x < LX; x++){
		this.grid[x] = [];
		for (var y = 0; y < LY; y++){
				this.grid[x][y] = {a: start_a, b: start_b, add: false}
		}
	}

	// Seed the grid with a patch of b
	for (var i = floor((LX-seed_width)/2); i < floor((LX+seed_width)/2); i++){
		for (var j = floor((LY-seed_height)/2); j < floor((LY+seed_height)/2); j++){
			this.grid[i][j] = {a: 0, b: 1, add: false};
		}
	}

	// Laplacian operator (3x3 convolution)
	this.laplacian = function(x, y, param){
		var delta_param = 0;

		var left = this.find_left(x);
		var right = this.find_right(x);
		var up = this.find_up(y);
		var down = this.find_down(y);

		delta_param += cent_weight * this.grid[x][y][param];

		delta_param += side_weight * this.grid[x][up][param];
		delta_param += side_weight * this.grid[x][down][param];
		delta_param += side_weight * this.grid[left][y][param];
		delta_param += side_weight * this.grid[right][y][param];

		delta_param += diag_weight * this.grid[left][up][param];
		delta_param += diag_weight * this.grid[left][down][param];
		delta_param += diag_weight * this.grid[right][up][param];
		delta_param += diag_weight * this.grid[right][down][param];

		return delta_param		
	}

	// Helper functions to find neighbouring coordinates with periodic BCs
	this.find_left = function(x){
		if (x == 0){
			return LX-1
		} else{
			return x-1
		}
	}

	this.find_right = function(x){
		if (x == LX-1){
			return 0
		} else{
			return x+1
		}
	}

	this.find_up = function(y){
		if (y == 0){
			return LY-1
		} else{
			return y-1
		}
	}

	this.find_down = function(y){
		if (y == LY-1){
			return 0
		} else{
			return y+1
		}
	}
}
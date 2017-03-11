// Library of paintbrush functions

// Paintbrush properties
var add_width  = 6;
var add_height = 6;
var min_brush_size = 3;
var max_brush_size = 50;
var brush_change_ratio = 1.4;

function change_brush_size(mode){
	if (mode == 'decrease'){
		// Decrease brush size
		add_width /= brush_change_ratio;
		add_height /= brush_change_ratio;
	} else if (mode == 'increase'){
		// Increase brush size
		add_width *= brush_change_ratio;
		add_height *= brush_change_ratio;
	}

	// Limit brush size
	if (add_width < min_brush_size){
		add_width = min_brush_size;
		add_height = min_brush_size;
	} else if (add_width > max_brush_size){
		add_width = max_brush_size;
		add_height = max_brush_size;
	}
}

function brush_stroke(vals_grids){
	for (i = 0; i < vals_grids.length; i++){
		var vals = vals_grids[i];

		// Add paint to brush area
		for (var xadd = mouseX-add_width; xadd < mouseX+add_width; xadd++){
			for (var yadd = mouseY-add_height; yadd < mouseY+add_height; yadd++){
				if ((xadd >= 0) && (xadd < width) && 
					(yadd >= 0) && (yadd < height)){

					var grid_x = floor((xadd / pixel_stretch)) % LX;
					var grid_y = floor((yadd / pixel_stretch)) % LY;

					vals[grid_x][grid_y].add = true;
				}
			}
		}
	}
}

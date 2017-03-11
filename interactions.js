// Library of interaction functions

function touchStarted() {
	touched = true;
    // return false;
}

function touchEnded() {
	touched = false;
    // return false;
}

function keyPressed(){
	if (keyCode === 32){
		// Space = toggle pause/play
		start = false;
		draw_rate=n_draw;
		play = !play;
	} else if (keyCode === 67 || keyCode === 99){
		// C or c = coral mode
		feed  = 0.0545;
		kill  = 0.062;
	} else if (keyCode === 77 || keyCode === 109){
		// M or m = mitosis mode
		feed  = 0.0367;
		kill  = 0.0649;
	} else if (keyCode === DOWN_ARROW){
		// Decrease brush size
		change_brush_size('decrease');
	} else if (keyCode === UP_ARROW){
		// Increase brush size
		change_brush_size('increase')
	} else {
		return false;
	}
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

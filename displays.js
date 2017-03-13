// Library of text display screens

function show_any_displays(start, play){
	if (start){
		start_screen();
	} else if (!play){
		pause_screen();
	}
}

function start_screen(){
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
}

function pause_screen(){
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

# react-diffuse
Interactive reaction-diffusion simulation, using the simple 2D Gray-Scott algorithm.

This is a (hopefully!) visually pleasing - and interactive - reaction-diffusion simulation that runs in the browser. You can draw the initial  seed configuration, and then set it off and see what you have created! You can even keep drawing while the simulation is running!


### How to run
First, grab yourself a copy of the index.html and sketch.js files. Then, simply open the index.html file in the browser of your choice.


### How to use
- Use the mouse to draw a pattern on the screen. The screen is fully tiled with the simulation grid, so you will see the drawing appear all over the window.
- Press space to start the simulation running!
- While it is running, space is used to pause/play the simulation.
- Extra seed can be drawn while the simulation is running, or paused.

Some tips:
- Zooming in can produce pleasing results, I like to move around in the range 100 to 500% on Chrome.
- The tiling fills the browser window - refresh when you resize the window to update this.
- Fullscreen is extra pretty.

Enjoy! :) 

#### Extra notes regarding development
This code is still pretty experimental, and will probably crash an awful lot. Personally I mostly get issues after zooming in, and resetting the browser usually solves this. I don't find the crashes frequent enough to put me off using it so far, so I probably won't be looking into these too much for the moment.

I will be working on this project in spare time and trying to make it as visually pleasing and user friendly as possible, with a view to deploying it online at some point. In particular, I plan to implement:
- A start screen explaining how to use the simulation.
- A way of changing the parameters in the browswer (these are currently hard-coded), or at least choosing an area of the parameter spcae (i.e. 'Coral' or 'Mitosis')
- Colour options
- An information page.
- Pause/play display.
- Retiling window after resize I guess.
- And more as I think of it!

Any suggestions or improvements are very much welcome!

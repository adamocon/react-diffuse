# react-diffuse
Interactive reaction-diffusion simulation, using the simple 2D Gray-Scott algorithm.

A (hopefully!) visually pleasing - and interactive - reaction-diffusion simulation that runs in the browser. You can draw the initial  seed configuration, and then set it off and see what you have created! You can even keep drawing while the simulation is running!

#### *Give it a go at https://adamocon.github.io!*

### How to use
- Use the mouse to draw a pattern on the screen. The window is tiled with the simulation grid, so you will see the drawing appear multiple times.
- Press space to start the simulation running!
- While it is running, press space to pause/play the simulation.
- Extra seed can be drawn while the simulation is running, or paused.
- Press the up/down arrows to increase/decrease the brush size.
- Press 'm' or 'M' to enter mitosis mode (feed = 0.0367, kill = 0.0649).
- Press 'c' or 'C' to enter coral mode (feed = 0.0545, kill = 0.062).

Some tips:
- Zoom in to change the aesthetic, I like to go anywhere from 100 through to 500% on Chrome.
- Go fullscreen!

*Enjoy!* :)

#### Extra notes regarding development
This code is still pretty experimental, and will probably crash an awful lot. Personally I mostly get issues after zooming in, and resetting the browser usually solves this. I don't find the crashes frequent enough to put me off using it so far, so I probably won't be looking into these too much for the moment.

I will be working on this project in spare time and trying to make it as visually pleasing and user friendly as possible, with a view to deploying it online at some point. In particular, I plan to implement:
- Colour options
- An information page
- And more as I think of it!

Any suggestions or improvements are very much welcome!

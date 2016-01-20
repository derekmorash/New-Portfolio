/**
 * Created by derek-desktop on 2015-04-20.
 */
var canvas;
var context;
var x = 200; //start position
var y = 100; //start position
var mx = 2; //x coordinate translation
var my = 4; //y coordinate translation
var WIDTH = 500; //canvas boundaries
var HEIGHT = 300; //canvas boundaries

window.onload = init(); //start the ball

function init() {
    canvas = document.getElementById("myCanvas"); //assign the canvas to a variable
    context = canvas.getContext("2d"); //Create context method to enable draw methods
    return setInterval(draw, 20); //call the draw function every 20 milliseconds
}

function circle(x,y,r) {
    context.beginPath(); //starts the drawing path
    context.arc(x,y,r,0, Math.PI*2, true); //define the size and shape of circle
    context.fill(); //fill the circle to display it
}

function draw() {
    clear(); //call the clear function

    //call the circle method
    //parameters are the x and y coordinates and the radius(size)
    circle(x, y, 20);

    /*
     * Up to here should draw a circle in the bottom right corner
     * The circle gets redrawn every 20 milliseconds
     * But there is no change in position
     */

    //Check to see if the ball is a side of the canvas
    if (x + mx > WIDTH || x + mx < 0) {
        mx = -mx; //change the x direction
    }
    //check to see if the ball is at the top or bottom of the canvas
    if (y + my > HEIGHT || y + my < 0) {
        my = -my; //change the y direction
    }

    x += mx; //change the next x coordinate of the ball
    y += my; //change the next y coordinate of the ball

    /*
     * Now the ball moves and bounces around in the canvas
     * However it leaves behind a trail
     * We need to clear the canvas before each move
     */
}

function clear() {
    //remove any drawings from the canvas
    context.clearRect(0,0, WIDTH, HEIGHT);
}

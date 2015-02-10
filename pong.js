//adds a 600 by 600 canvas, appends it to the DOM
var canv = document.createElement('canvas');
canv.id = 'Board';
canv.width = 600;
canv.height = 600;
document.body.appendChild(canv);

//grabs the canavas element, prepares the paddles and ball
var c = document.getElementById("Board");
var context = c.getContext('2d');
var ball = new Ball(300,300,10);
var player_paddle = new Paddle(10,250);
var computer_paddle = new Paddle(590,250);

//set up animation frame
var animate =  window.requestAnimationFrame || window.mozRequestAnimationFrame ||
               window.webkitRequestAnimationFrame || window.oRequestAnimationFrame;
var move_down = false;
var move_up = false;
var computer_score=0;
var player_score=0;

/* This function draws the board on the canvas, overrides old board with a clear
* rectangle 
*/
function drawBoard(){
    context.clearRect(0,0,610,610);
    var grd = context.createLinearGradient(0,0,600,0);
    grd.addColorStop(0,"red");
    grd.addColorStop(1,"blue");
    context.fillStyle = grd;
    context.fillRect(10,10,600,600);
    context.font = "30px Arial";
    context.fillStyle = "black";
    context.fillText(player_score + " | " +computer_score,300,50); //updates the score
}
/* This function is called 60 times a second as a step/frame for the animation
* draws the board, draws the ball, updates the ball and computer position
* checks for player movement */

function step(){
    drawBoard();
    ball.draw();
    update();
    if(move_down)
    {
        player_paddle.moveDown(7);
    }
    if(move_up)
    {
        player_paddle.moveUp(7);
    }
    player_paddle.draw();
    computer_paddle.draw();
    animate(step);
}
/* This function updates the ball and computer paddle position, called by step*/
function update(){
    ball.move();
    computer_paddle.follow();

}
/* Ball object */
function Ball(x,y,size){
    this.x = x;
    this.y = y;
    this.size = size;
    this.x_direction = 5;
    this.y_direction = 0;
    //draws the ball at its current position
    this.draw = function(){
        var ball_grd = context.createRadialGradient(this.x+10,this.y+10,this.y+10,this.x+10,0,0);
        context.beginPath();
        context.arc(this.x,this.y,this.size,0,2*Math.PI);
        context.stroke();
        ball_grd.addColorStop(0,"orange");
        ball_grd.addColorStop(1,"yellow");
        context.fillStyle = ball_grd;
        context.fill();
    };
    //moves the ball
    this.move = function(){
        if(this.x>=585){  //if it goes all the way to the right
            if(this.y<= computer_paddle.y+100 && this.y>=computer_paddle.y) //hits the computer paddle
            {
                if(this.y<computer_paddle.center) //hits top of computer paddle
                {
                    if(this.y_direction<Math.abs(15))
                    {
                        this.y_direction -= (computer_paddle.center-this.y)/4;
                    }
                }
                else if(this.y > computer_paddle.center) //hits bottom
                {
                     if(this.y_direction<Math.abs(15))
                    {
                        this.y_direction += (computer_paddle.center-this.y)/4;
                    }
                }
                if(this.x_direction<15) //caps the max speed at 15
                    {
                        this.x_direction=(-this.x_direction)-1;
                    }
                else{  //if it is at cap, just keeps the same speed
                    this.x_direction *=-1;
                }
            }
            else{  //player scores a point, ball is reset
                this.x = 300;
                this.y_direction = 0;
                this.x_direction = 5;
                this.y = 300;
                player_score++;
                resetPaddles();
            }
        }
        else if(this.x<=30){  //goes all the way to the left
            if(this.y<= player_paddle.y+100&&this.y>=player_paddle.y) //if it hits the player paddle
            {
                if(this.y<player_paddle.center)  // hits the top part of the paddle
                {
                    if(this.y_direction<Math.abs(15)) //caps the speed at 15
                    {
                        this.y_direction -= (player_paddle.center-this.y)/4; //changes how fast the ball is moving up
                        
                    }
                    
                }
                else if(this.y>player_paddle.center)//hits the lower part of the paddle
                {
                    if(this.y_direction<Math.abs(15)) //caps the speed at 15
                    {
                        
                        this.y_direction+=(this.y-player_paddle.center)/4; //changes how fast the ball is moving down
                    }
                }
                if(this.x_direction>-15) //caps x movement at 15
                {
                    this.x_direction=(-this.x_direction)+1;
                }
                else{
                    this.x_direction *=-1;  //keep speed the same
                }
            }
            else{   //player misses ball, computer scores a point, ball is reset
                this.x = 300;
                this.y_direction = 0;
                this.x_direction = 5;
                this.y = 300;
                computer_score++;
                resetPaddles();
            }
        }
        if((this.y+this.y_direction) > 600)
        {
            this.y_direction = -(this.y_direction);
        }
        else if(this.y+this.y_direction< 22)
        {
            this.y_direction = -(this.y_direction);
        }
            this.x+=this.x_direction;
            this.y+=this.y_direction;
       
    };
}
/* Paddle object, makes a paddle at a given loction, handles movement and rendering*/
function Paddle(x,y){
    this.x = x;
    this.y = y;
    this.y_speed = 5;
    this.center = this.y+50;
    this.draw = function(){
        context.fillStyle ="black";
        context.fillRect(this.x,this.y,10,100);
        this.center = this.y+50;
    };
    this.moveDown = function(speed){
        if(this.y<500)
        {
            this.y +=speed;
            //this.y_speed = speed;
        }
    };
    this.moveUp = function(speed){
        if(this.y>15){
            this.y -=speed;
            //this.y_speed = speed;
        }
    };
}
//new method for the computer paddle, follows the ball
computer_paddle.follow = function(){
    if(ball.y-50>10 && ball.y-50<550){
        var new_y = ball.y - 50;
        if(Math.abs(this.y - new_y)<=7){ 
            this.y = ball.y-50;
        }
        else
        {
            if(new_y<this.y)
            {
                this.y-=7;
            }
            else
            {
                this.y+=7;
            }
        }
    }           
};
drawBoard();
//listens for a player moving their paddle
window.addEventListener("keydown",movePaddle,false);
function movePaddle(e){
    if(e.keyCode === 83)
    {
        move_down = true;       
    }
    else if(e.keyCode === 87)
    {
        move_up = true;
    }

}
//attempts to ramp down paddle speed for smooth transition
window.addEventListener("keyup",rampDown,false);
function rampDown(e){
     if(e.keyCode === 83)
    {
        move_down = false;    
    }
    else if(e.keyCode === 87)
    {
        move_up = false;
    }
}
//resets paddle position
function resetPaddles()
{
    player_paddle.y = 250;
    computer_paddle.y = 250;
}
animate(step);
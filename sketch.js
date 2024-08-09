/*

PERRY THE PIZZA CAT
_____________________________________________________________________
I tried to include almost all the topics we did this semester in my game, in this code you will find all three extensions aswell.
I included platforms, many sounds and dogs as an enemy to my loveable cat character. I found incorporating the emitter function as a confetti cannon to symbolize the end of a level incredibly complicated, however after battling with these functions for hours, I finally got the hang of it and found a use for this type of code in other positions within my code. I learned so many skills doing this project, I learned about the p5.js sound library, I learned about constructor functions, factory patterns, arrays, objects, and so much more. This project has made me a better coder and has reminded me why I love this field of study. I hope you love Perry the Pizza loving cat as much as I do!
____________________________________________________________________

*/

//Movement
var gameChar_x;
var gameChar_y;
var floorPos_y;
var scrollPos;
var gameChar_world_x;

var isLeft;
var isRight;
var isFalling;
var isPlummeting;

//Scenery
var trees_x;
var trees2_x;
var treePos_y;
var collectables;
var clouds;
var mountains;
var canyons;
var lifeToken;
var raindrop;

//Game mechanics
var game_score;
var flagpole;
var lives;
var level;
var emit;
var level1end;
var level2end;
var level3end;
var gameOver;

//Enemies
var enemies;
var enemyTouch;


//Platforms
var platforms;
var isContact;

function preload()
{
    soundFormats('mp3','wav');
    
    //Sounds are loaded here
    
    //Jump Sound
    jumpSound = loadSound('assets/jumpFX.wav');
    jumpSound.setVolume(0.1);
    
    //Normal Backtrack Sound
    backTrackSound = loadSound('assets/game-backing-track.wav');
    backTrackSound.setVolume(0.1); 
    
    //Rain Sound
    backTrackRain = loadSound('assets/backing-track-rain.wav');
    backTrackRain.setVolume(0.1);  
    
    //Night Sound
    backTrackNight = loadSound('assets/backing-track-summer-night.wav');
    backTrackNight.setVolume(0.1); 
    
    
    //Eating Pizza Sound
    eatPizzaSound = loadSound('assets/eating-pizza.wav');
    eatPizzaSound.setVolume(0.1); 
    
    //Game Over Sound
    gameOverSound = loadSound('assets/game-over.wav');
    gameOverSound.setVolume(0.1); 
    
    //Walking Sound
    walkingSound = loadSound('assets/walking.wav');
    walkingSound.setVolume(0.1);
    
    //Level win Sound
    levelWinSound = loadSound('assets/level-win.wav');
    levelWinSound.setVolume(0.1);
    
    //Dog Bark Sound
    dogBarkSound = loadSound('assets/dog-bark.wav');
    dogBarkSound.setVolume(0.1);
    
    //Win Game Sound
    winGameSound = loadSound('assets/Winning-Game.wav');
    winGameSound.setVolume(0.1);
    
}  


function setup()
{
	createCanvas(1024, 576);
    floorPos_y = height * 3/4;
    lives = 3;
    level1end = false;
    level2end = false;
    level3end = false;
    gameOver = false;
    level = 1;
    game_score = 0;
    startGame();

}
function draw()
{
    if (level == 1)
    {
    // fill the sky blue
        background(135,206,235);
        noStroke();
	    fill(0,155,0);
    }
	
    if (level == 2)
    {
    // fill the sky grey blue

        background(102,153,204); 
        noStroke();
        fill(85,107,47);
	    
    }
    
    if (level == 3)
    {
        background(25,25,112);
        noStroke();
        fill(85,107,47);     
    }

    //Draw the ground
	rect(0, floorPos_y, width, height/4); 
    
    push();
    
    translate(scrollPos,0);
        
	// Draw clouds.
    if (level != 3)
    {
        drawClouds();    
    }
    
    //Draw the moon and stars for the evening scenery in level 3
    if (level == 3)
    {
        fill(255);
        ellipse(800,100,60);
        drawStars();
    }
    
	// Draw mountains.
    drawMountains();
    
	// Draw trees.
    drawTrees();
    
    //Draw platforms
    for(var i = 0; i < platforms.length; i++)
    {
       platforms[i].draw(); 
    };
    
	// Draw canyons.
    for(var i = 0; i < canyons.length; i++)
    {
        drawCanyon(canyons[i]);
    };
    
	// Draw collectable items.
    for (var i = 0; i < collectables.length; i++)
    {
        if(!collectables[i].isFound)
        {
            drawCollectable(collectables[i]); 
            checkCollectable(collectables[i]);
        }   
    };          
    
    //Draw particle system for confetti flagpole
    renderFlagpole();
    
    //Draw enemies
    for (var i = 0; i < enemies.length; i++)
    {
        enemies[i].draw();   
        
        var isContactEnemy = enemies[i].checkContact(gameChar_world_x,gameChar_y);
        
        if(isContactEnemy)
        {
            if(lives > 0)
            {
                enemyTouch = true;
                break;
            }
         break;       
        }
        else
        {
            enemyTouch = false;    
        }
    };
    
    pop();
    
	//Draw game character.
	drawGameChar();
    
    //Check if the player has fallen down a canyon
    checkPlayerDie();
    
    //Draw the life tokens
    drawLifeToken();
    
    
    //Draw raindrops if it is level 2
    if (level == 2)
    {
        for(var i = 0; i < 200; i++) 
        {
            raindrop[i].show();
            raindrop[i].update();
        }

    }
    
    //Text for the score and level
    fill(255);
    noStroke();
    textAlign(LEFT)
    textSize(20);
    textFont('Georgia');
    text("Score:" + game_score + "/35", 20, 20);
    text("Level:" + level + '/3',20,40);
    
    //Check if all the lives have been used up
    if (lives < 1)
    {
        textAlign(CENTER);
        fill(0);
        rect(0,0,1024, 576);
        fill(255);
        textSize(30);
        text("Game Over. Press space to continue", width/2,height/2);
        if (gameOver == false)
        {
            backTrackNight.stop();
            backTrackRain.stop();
            backTrackSound.stop();
            gameOverSound.play();
            gameOver = true;
        }
        return
    }
    
    //Check if the flagpole has been reached, if so print text
    if (flagpole.isReached)
    {
        textAlign(CENTER);
        fill(255);
        textSize(30);
 
        if (level == 3)
        {
            fill(0);
            rect(0,0,width,height); 
            fill(255);
            text("CONGRATULATIONS! YOU SCORED: " + game_score + " out of 35" , width/2,height/4);
            text("Thank You For Playing!" , width/2, height/2)
            text("Press Space to Play Again ", width/2, height/2 + 100); 
            emit.updateParticles( );
            return;
        };
        text("Level Complete. Press space to continue",width/2,height/2);
        return;
    }
    if(flagpole.isReached == false)
    {
        checkFlagpole();    
    }

    
	// Logic to make the game character move or the background scroll.
	if(isLeft)
    {
        if(gameChar_x > width * 0.2)
        {
            gameChar_x -= 5;
        }
        else
        {
            scrollPos += 5;
        }
    }

	if(isRight)
    {
        if(gameChar_x < width * 0.8)
        {
            gameChar_x  += 5;
        }
        else
        {
            scrollPos -= 5; // negative for moving against the background
        }
    }

	// Logic to make the game character rise and fall.
    if (gameChar_y <  floorPos_y)
    {
        
        isContact = false;
        for( var i = 0; i < platforms.length; i++)
        {
            if(platforms[i].checkContact(gameChar_world_x, gameChar_y))
            {
                isContact = true;
                isFalling = false;
                break;
            }
        }
        
        if(isContact == false)
        {
            gameChar_y += 2; 
            isFalling = true;   
        }

        
        
    }
    else
    {
        isFalling = false;    
    }
    
    
	// Update real position of gameChar for collision detection.
	gameChar_world_x = gameChar_x - scrollPos;

    //Check if the player is in the canyon
    for (var i = 0; i < canyons.length; i++)
    {
        checkCanyon(canyons[i]);                     
    }
    
    
    //Create a rectangle that is dark so that it appears like it is evening
    if (level == 3)
    {
        fill(0,0,0,90);
        rect(0,0,width,height);      
    }

}


// ---------------------
// Key control functions
// ---------------------

function keyPressed()
{
    if(keyCode == 37)
    {
        isLeft = true;  
        walkingSound.play();
    }
    else if(keyCode == 39)
    {
        isRight = true;  
        walkingSound.play();
    }
    
    //Check under what conditions the spacebar has been pressed, 
    //if the spacebar has been pressed on a platform the character still must jump
    //if the spacebar is pressed once a flagpole is reached the next level must be triggered
    //if the spacebar is pressed after Game Over the game must reset
    
    else if(keyCode == 32 && gameChar_y == floorPos_y || isContact == true || flagpole.isReached == true || lives <= 0)
    {
        
        //Check if the user pressed space at the end of a level
        if (flagpole.isReached == true)
        {
            levelWinSound.stop();
            if (level == 3)
            {
                level = 1;
                lives = 3;
                game_score = 0;   
                
            }
            else
            {
                level += 1;  
            }
            startGame();
            return;
        }
        
        //Check if it is Game Over and the user pressed space
        if (lives <= 0)
        {
            level = 1;
            lives = 3;
            game_score = 0;
            startGame();
            gameOverSound.stop();
            return;
        }
        gameChar_y -= 120;
        jumpSound.play();
    }

}
function keyReleased()
{
    if(keyCode == 37)
    {
        isLeft = false;  
        walkingSound.stop();
    }
    else if(keyCode == 39)
    {
        isRight = false; 
        walkingSound.stop();
    }

}

// ------------------------------
// Game character render function
// ------------------------------

// Function to draw the game character.
function drawGameChar()
{ 
	// draw game character
    strokeWeight(2);
    if(isLeft && isFalling)
    {
    // add your jumping-left code
    //head
        fill(255,178,102);
        rect(gameChar_x - 20, gameChar_y - 60,40,35);
    //ears
        triangle(gameChar_x, gameChar_y - 75,
        gameChar_x - 10 , gameChar_y - 60,
        gameChar_x + 10, gameChar_y - 60);  
    //inner ear
        fill(255,204,204);
        triangle(gameChar_x , gameChar_y -70,
                gameChar_x - 7, gameChar_y - 60,
                gameChar_x + 7, gameChar_y - 60); 
    //eyes
        fill(255);
        ellipse(gameChar_x - 10, gameChar_y - 50, 10, 15);
    //pupils
        fill(0);
        ellipse(gameChar_x - 12, gameChar_y - 52, 5, 10);
    //nose
        fill(0);
        triangle(gameChar_x-20,gameChar_y - 42, 
                 gameChar_x - 24,gameChar_y - 36,
                 gameChar_x - 20,gameChar_y - 36 );
    //body
        fill(255,178,102);
        rect(gameChar_x - 13, gameChar_y - 35, 25, 30);
        fill(0);
    //mouth
        noFill();
        stroke(0);
        arc(gameChar_x-15,gameChar_y - 34, 10,10,0 ,PI);
        noStroke();    
    //feet
        fill(204,102,0);
        rect(gameChar_x - 13, gameChar_y - 5,10,5);
        rect(gameChar_x + 2, gameChar_y - 5,10,5);
        arc(gameChar_x-8, gameChar_y, 10,7,0,PI);
        arc(gameChar_x+7, gameChar_y, 10,7,0,PI);   
    //left paw
        fill(204,102,0);
        beginShape();
            vertex(gameChar_x-12,gameChar_y - 20);
            vertex(gameChar_x-20,gameChar_y - 30);
            vertex(gameChar_x-23,gameChar_y - 25);
            vertex(gameChar_x-12,gameChar_y - 10);
            vertex(gameChar_x-12,gameChar_y - 20);
        endShape();

        beginShape();
            vertex(gameChar_x-4,gameChar_y - 20);
            vertex(gameChar_x-12,gameChar_y - 30);
            vertex(gameChar_x-15,gameChar_y - 25);
            vertex(gameChar_x-4,gameChar_y - 10);
            vertex(gameChar_x-4,gameChar_y - 20);
        endShape();

	   }
	   else if(isRight && isFalling)
	   {
        // add your jumping-right code
        //head
            fill(255,178,102);
            rect(gameChar_x - 20, gameChar_y - 60,40,35);
        //ears
            triangle(gameChar_x, gameChar_y - 75,
                     gameChar_x - 10 , gameChar_y - 60,
                     gameChar_x + 10, gameChar_y - 60);  
        //inner ear
            fill(255,204,204);
            triangle(gameChar_x , gameChar_y -70,
                     gameChar_x - 7, gameChar_y - 60,
                     gameChar_x + 7, gameChar_y - 60);
        //eyes
            fill(255);
            ellipse(gameChar_x + 10, gameChar_y - 50, 10, 15);
        //pupils
            fill(0);
            ellipse(gameChar_x + 12, gameChar_y - 52, 5, 10);
        //nose
            fill(0);
            triangle(gameChar_x+20,gameChar_y - 42, 
                     gameChar_x + 24,gameChar_y - 36,
                     gameChar_x + 20,gameChar_y - 36 );
        //body
            fill(255,178,102);
            rect(gameChar_x - 13, gameChar_y - 35, 25, 30);
            fill(0);
        //mouth
            noFill();
            stroke(0);
            arc(gameChar_x+15,gameChar_y - 34, 10,10,0 ,PI);
            noStroke();
        //feet
            fill(204,102,0);
            rect(gameChar_x - 13, gameChar_y - 5,10,5);
            rect(gameChar_x + 2, gameChar_y - 5,10,5);
            arc(gameChar_x-8, gameChar_y, 10,7,0,PI);
            arc(gameChar_x+7, gameChar_y, 10,7,0,PI);
        //paws
        //right paw
            fill(204,102,0);
            beginShape();
                vertex(gameChar_x+12,gameChar_y - 20);
                vertex(gameChar_x+20,gameChar_y - 30);
                vertex(gameChar_x+23,gameChar_y - 25);
                vertex(gameChar_x+12,gameChar_y - 10);
                vertex(gameChar_x+12,gameChar_y - 20);
            endShape();

            beginShape();
                vertex(gameChar_x+4,gameChar_y - 20);
                vertex(gameChar_x+12,gameChar_y - 30);
                vertex(gameChar_x+15,gameChar_y - 25);
                vertex(gameChar_x+4,gameChar_y - 10);
                vertex(gameChar_x+4,gameChar_y - 20);
            endShape();

	   }
	   else if(isLeft)
	   {
        // add your walking left code
        //head
            fill(255,178,102);
            rect(gameChar_x - 20, gameChar_y - 60,40,35);
        //ears
            triangle(gameChar_x, gameChar_y - 75,
                     gameChar_x - 10 , gameChar_y - 60,
                     gameChar_x + 10, gameChar_y - 60);
        //inner ear
            fill(255,204,204);
            triangle(gameChar_x , gameChar_y -70,
                     gameChar_x - 7, gameChar_y - 60,
                     gameChar_x + 7, gameChar_y - 60);
        //eyes
            fill(255);
            ellipse(gameChar_x - 10, gameChar_y - 50, 10, 15);
        //pupils
            fill(0);
            ellipse(gameChar_x - 12, gameChar_y - 50, 5, 10);
        //nose
            fill(0);
            triangle(gameChar_x-20,gameChar_y - 42, 
                     gameChar_x - 24,gameChar_y - 36,
                     gameChar_x - 20,gameChar_y - 36 );
        //body
            fill(255,178,102);
            rect(gameChar_x - 13, gameChar_y - 35, 25, 30);
            fill(0);
        //mouth
            noFill();
            stroke(0);
            arc(gameChar_x-15,gameChar_y - 34, 10,10,0 ,PI);
            noStroke();
        //feet
            fill(204,102,0);
            rect(gameChar_x - 13, gameChar_y - 5,10,5);
            rect(gameChar_x + 2, gameChar_y - 5,10,5);
            arc(gameChar_x-8, gameChar_y, 10,7,0,PI);
            arc(gameChar_x+7, gameChar_y, 10,7,0,PI);
        //paws
            fill(204,102,0);
            arc(gameChar_x-13, gameChar_y - 20, 7,7, PI / 2, 3 * PI / 2, OPEN);
            arc(gameChar_x-5, gameChar_y - 20, 7,7,0,PI);
	   }
	   else if(isRight)
	   {
        // add your walking right code
        //head
            fill(255,178,102);
            rect(gameChar_x - 20, gameChar_y - 60,40,35);
        //ears
            triangle(gameChar_x, gameChar_y - 75,
                     gameChar_x - 10 , gameChar_y - 60,
                     gameChar_x + 10, gameChar_y - 60);
        //inner ear
            fill(255,204,204);
            triangle(gameChar_x , gameChar_y -70,
                     gameChar_x - 7, gameChar_y - 60,
                     gameChar_x + 7, gameChar_y - 60); 
        //eyes
            fill(255);
            ellipse(gameChar_x + 10, gameChar_y - 50, 10, 15);
        //pupils
            fill(0);
            ellipse(gameChar_x + 12, gameChar_y - 50, 5, 10);    
        //nose
            fill(0);
            triangle(gameChar_x+20,gameChar_y - 42, 
                     gameChar_x + 24,gameChar_y - 36,
                     gameChar_x + 20,gameChar_y - 36 );
        //body
            fill(255,178,102);
            rect(gameChar_x - 13, gameChar_y - 35, 25, 30);
            fill(0);
        //mouth
            noFill();
            stroke(0);
            arc(gameChar_x+15,gameChar_y - 34, 10,10,0 ,PI);
            noStroke();
        //feet
            fill(204,102,0);
            rect(gameChar_x - 13, gameChar_y - 5,10,5);
            rect(gameChar_x + 2, gameChar_y - 5,10,5);
            arc(gameChar_x-8, gameChar_y, 10,7,0,PI);
            arc(gameChar_x+7, gameChar_y, 10,7,0,PI);
        //paws
            fill(204,102,0);
            arc(gameChar_x+12, gameChar_y - 20, 7,7, -PI / 2,-3 * PI / 2, OPEN);
            arc(gameChar_x+5, gameChar_y - 20, 7,7,0,PI);
	   }
	   else if(isFalling || isPlummeting)
	   {
        // add your jumping facing forwards code
            fill(255,178,102);
            rect(gameChar_x - 20, gameChar_y - 60,40,35);
        //ears
            triangle(gameChar_x- 10, gameChar_y -75,
                     gameChar_x - 20 , gameChar_y - 60,
                     gameChar_x - 2, gameChar_y - 60);

            triangle(gameChar_x + 10, gameChar_y -75,
                     gameChar_x + 20 , gameChar_y - 60,
                     gameChar_x + 2, gameChar_y - 60);
        //inner ear
            fill(255,204,204);
            triangle(gameChar_x - 10 , gameChar_y -70,
                     gameChar_x - 17, gameChar_y - 60,
                     gameChar_x - 5, gameChar_y - 60);

            triangle(gameChar_x + 10 , gameChar_y -70,
                     gameChar_x + 17, gameChar_y - 60,
                     gameChar_x + 5, gameChar_y - 60);
        //eyes
            fill(255);
            ellipse(gameChar_x - 10, gameChar_y - 50, 10, 15);
            ellipse(gameChar_x + 10, gameChar_y - 50, 10, 15);
        //pupils
            fill(0);
            ellipse(gameChar_x - 10, gameChar_y - 53, 5, 10);
            ellipse(gameChar_x + 10, gameChar_y - 53,5, 10);
        //nose
            fill(0);
            triangle(gameChar_x,gameChar_y - 42, 
                     gameChar_x - 4,gameChar_y - 36,
                     gameChar_x + 4,gameChar_y - 36 );
        //body
            fill(255,178,102);
            rect(gameChar_x - 13, gameChar_y - 35, 25, 30);
            fill(0);
        //mouth
            noFill();
            stroke(0);
            arc(gameChar_x-5,gameChar_y - 36, 10,10,0 ,PI);
            arc(gameChar_x+5,gameChar_y - 36, 10,10,0 ,PI);
            noStroke();  
        //feet
            fill(204,102,0);
            rect(gameChar_x - 13, gameChar_y - 5,10,5);
            rect(gameChar_x + 2, gameChar_y - 5,10,5);
            arc(gameChar_x-8, gameChar_y, 10,7,0,PI);
            arc(gameChar_x+7, gameChar_y, 10,7,0,PI);
        //paws
        //rightpaw 
            fill(204,102,0);
            beginShape();
                vertex(gameChar_x+12,gameChar_y - 20);
                vertex(gameChar_x+20,gameChar_y - 30);
                vertex(gameChar_x+23,gameChar_y - 25);
                vertex(gameChar_x+12,gameChar_y - 10);
                vertex(gameChar_x+12,gameChar_y - 20);
            endShape();
        //left paw
            beginShape();
                vertex(gameChar_x-12,gameChar_y - 20);
                vertex(gameChar_x-20,gameChar_y - 30);
                vertex(gameChar_x-23,gameChar_y - 25);
                vertex(gameChar_x-12,gameChar_y - 10);
                vertex(gameChar_x-12,gameChar_y - 20);
            endShape(); 
	   }
	   else
	   {
        // add your standing front facing code
        //head
            fill(255,178,102);
            rect(gameChar_x - 20, gameChar_y - 60,40,35);
        //ears
            triangle(gameChar_x- 10, gameChar_y -75,
                     gameChar_x - 20 , gameChar_y - 60,
                     gameChar_x - 2, gameChar_y - 60);

            triangle(gameChar_x + 10, gameChar_y -75,
                     gameChar_x + 20 , gameChar_y - 60,
                     gameChar_x + 2, gameChar_y - 60);
        //inner ear
            fill(255,204,204);
            triangle(gameChar_x - 10 , gameChar_y -70,
                     gameChar_x - 17, gameChar_y - 60,
                     gameChar_x - 5, gameChar_y - 60);

            triangle(gameChar_x + 10 , gameChar_y -70,
                     gameChar_x + 17, gameChar_y - 60,
                     gameChar_x + 5, gameChar_y - 60);
        //eyes
            fill(255);
            ellipse(gameChar_x - 10, gameChar_y - 50, 10, 15);
            ellipse(gameChar_x + 10, gameChar_y - 50, 10, 15);
        //pupils
            fill(0);
            ellipse(gameChar_x - 10, gameChar_y - 50, 5, 10);
            ellipse(gameChar_x + 10, gameChar_y - 50, 5, 10);
        //body
            fill(255,178,102);
            rect(gameChar_x - 13, gameChar_y - 35, 25, 30);
            fill(0);
        //feet
            fill(204,102,0);
            rect(gameChar_x - 13, gameChar_y - 5,10,5);
            rect(gameChar_x + 2, gameChar_y - 5,10,5);
            arc(gameChar_x-8, gameChar_y, 10,7,0,PI);
            arc(gameChar_x+7, gameChar_y, 10,7,0,PI);
        //nose
            fill(0);
            triangle(gameChar_x,gameChar_y - 42, 
                     gameChar_x - 4,gameChar_y - 36,
                     gameChar_x + 4,gameChar_y - 36 );
        //mouth
            noFill();
            stroke(0);
            arc(gameChar_x-5,gameChar_y - 36, 10,10,0 ,PI);
            arc(gameChar_x+5,gameChar_y - 36, 10,10,0 ,PI);
            noStroke();
    
        //paws
            fill(204,102,0);
            arc(gameChar_x-5, gameChar_y - 20, 7,7,0,PI);
            arc(gameChar_x+5, gameChar_y - 20, 7,7,0,PI);

       }
}

// ---------------------------
// Background render functions
// ---------------------------

// Function to draw cloud objects.
function drawClouds()
{
    for(var i = 0; i < clouds.length; i++)
    {
        //cloud colour must be white for level 1
        if (level == 1)
        {
           fill(255,255,255);  
        }
        
        //cloud colour must be changed for level 2 to a dark grey
        if (level == 2)
        {
            fill(211,211,211);    
        }
        
        ellipse(clouds[i].x_pos, clouds[i].y_pos, clouds[i].size + 40, clouds[i].size + 20);
        ellipse(clouds[i].x_pos - 40, clouds[i].y_pos,clouds[i].size + 40,clouds[i].size);
        ellipse(clouds[i].x_pos + 40,clouds[i].y_pos,clouds[i].size + 40,clouds[i].size);
        ellipse(clouds[i].x_pos + 40,clouds[i].y_pos,clouds[i].size + 40,clouds[i].size - 10);
    }   
}
// Function to draw mountains objects.
function drawMountains()
{
    for(var i = 0; i < mountains.length; i++)
    {
        //grey fill
        fill(160,160,160);
        //base of mountain
        triangle(mountains[i].x_pos + mountains[i].size/2, mountains[i].y_pos,
                 mountains[i].x_pos, floorPos_y,
                 mountains[i].x_pos + mountains[i].size,floorPos_y);   
        //snow on mountain    
        fill(255);
    
        beginShape( );
            vertex(mountains[i].x_pos + mountains[i].size/2,
                   mountains[i].y_pos);

            vertex(mountains[i].x_pos + mountains[i].size/2 - mountains[i].size/6,
                   mountains[i].y_pos + mountains[i].size/3.88);

            vertex(mountains[i].x_pos + mountains[i].size/2 - mountains[i].size/12.12,
                   mountains[i].y_pos + mountains[i].size/5);

            vertex(mountains[i].x_pos + mountains[i].size/2 + mountains[i].size/200,
                   mountains[i].y_pos + mountains[i].size/3.96);

            vertex(mountains[i].x_pos + mountains[i].size/2 + mountains[i].size/13.3,
                   mountains[i].y_pos + mountains[i].size/5.19);

            vertex(mountains[i].x_pos + mountains[i].size/2 + mountains[i].size/6.5,
                   mountains[i].y_pos + mountains[i].size/4.25);

            vertex(mountains[i].x_pos + mountains[i].size/2, mountains[i].y_pos);
        endShape(CLOSE);
    }
}
// Function to draw trees objects.
function drawTrees()
{
    for(var i = 0; i < trees_x.length; i++)
    {
    //trunk 
        fill(139,69,19);
        rect(trees_x[i], treePos_y, 30, 144);

    //branches
        fill(85,107,47);
        triangle(trees_x[i]+10,treePos_y-97,trees_x[i]-61,treePos_y+54,trees_x[i] +95,treePos_y+54);
        fill(107,142,35);
        triangle(trees_x[i]+10, treePos_y - 113, trees_x[i]-41,treePos_y,trees_x[i]+69,treePos_y);
        fill(154,205,50);
        triangle(trees_x[i]+10,treePos_y - 130,trees_x[i]-23,treePos_y-47,trees_x[i]+49,treePos_y-47);
    } 
    //Draw Trees TYPE 2
    for(var i = 0; i < trees2_x.length; i++)
    {
    //trunk   
        fill(139,69,19);
        rect(trees2_x[i], treePos_y, 30, 144); 

    //branches
        fill(85,107,47);
        triangle(trees2_x[i]+10,treePos_y-67,trees2_x[i]-61,treePos_y+84,trees2_x[i] +95,treePos_y+84);
        fill(107,142,35);
        triangle(trees2_x[i]+10, treePos_y - 83, trees2_x[i]-41,treePos_y + 30,trees2_x[i]+69,treePos_y + 30);
        fill(154,205,50);
        triangle(trees2_x[i]+10,treePos_y - 100,trees2_x[i]-23,treePos_y-17,trees2_x[i]+49,treePos_y-17);    
        
    }
}
//Function to create a star for level 3
function star(x, y, radius1, radius2, npoints) 
{
  var angle = TWO_PI / npoints;
  var halfAngle = angle / 2.0;
  //create a star based on angles and radius
  beginShape();
  for (var i = 0; i < TWO_PI; i += angle) {
    var sx = x + cos(i) * radius2;
    var sy = y + sin(i) * radius2;
    vertex(sx, sy);
    sx = x + cos(i + halfAngle) * radius1;
    sy = y + sin(i + halfAngle) * radius1;
    vertex(sx, sy);
  }
  endShape(CLOSE);
}
//Function to draw stars for level 3
function drawStars()
{
  fill(255);
  //add stars to sky based on the array that is built in the startGame() function
  for(i = 0; i < 50; i++)
  {
    push()
    translate(stars[i].x, stars[i].y );
    rotate(frameCount / -100.0);
    star(0, 0, 5, 10, 5);  
    pop()  
  }

}
//Functions to create rain for level 2 scenery   
function Drop() 
{   
    this.x = random(0, width); 
    this.y = random(0, -height);
  
    this.show = function() 
    {
        noStroke();
        fill(0,128,255);
        ellipse(this.x, this.y, random(1, 5), random(1, 5));   
    }
    this.update = function() 
    {
        this.speed = random(5, 10);
        this.gravity = 1.2;
        this.y = this.y + this.speed*this.gravity;  
    
        if (this.y > height) 
        {
            this.y = random(0, -height);
            this.gravity = 0;
        }
    }
}

// ---------------------------------
// Canyon render and check functions
// ---------------------------------

// Function to draw canyon objects.
function drawCanyon(t_canyon)
{
    noStroke()
    
    if (level == 1)
    {
    // fill the canyon blue
        fill(135,206,235);   
    }
	
    if (level == 2)
    {
    // fill the canyon grey blue
       fill(102,153,204);   
    }
    
    if (level == 3)
    {
    // fill the canyon grey blue
       fill(25,25,112);   
    }
    
    beginShape();
        vertex(t_canyon.x_pos + 42,576);
        vertex(t_canyon.x_pos + 83,532);
        vertex(t_canyon.x_pos + 43,502);
        vertex(t_canyon.x_pos + 89,473);
        vertex(t_canyon.x_pos + 65,432);
        vertex(t_canyon.x_pos + 42 - t_canyon.width + 20  ,432);
        vertex(t_canyon.x_pos + 83 - t_canyon.width + 12,473);
        vertex(t_canyon.x_pos + 43 - t_canyon.width + 20,502);
        vertex(t_canyon.x_pos + 89 - t_canyon.width + 8,532);
        vertex(t_canyon.x_pos + 65 - t_canyon.width - 24,576);
    endShape(CLOSE);
    
    fill(205,133,63);
    beginShape();
        vertex(t_canyon.x_pos + 65,433);
        vertex(t_canyon.x_pos + 70,485);
        vertex(t_canyon.x_pos + 90,473);
        vertex(t_canyon.x_pos + 65,433);
    endShape( );

    noStroke();
    
    triangle(t_canyon.x_pos + 43,502,
             t_canyon.x_pos + 55,562,
             t_canyon.x_pos + 83,532);
    
    triangle(t_canyon.x_pos + 89 - t_canyon.width + 8,532,
             t_canyon.x_pos + 65 - t_canyon.width - 24,576,
             t_canyon.x_pos + 95 - t_canyon.width - 24,576);
    
    triangle(t_canyon.x_pos + 83 - t_canyon.width + 12,473,
             t_canyon.x_pos + 43 - t_canyon.width + 20,502,
             t_canyon.x_pos + 83 - t_canyon.width , 520)
}
// Function to check character is over a canyon.
function checkCanyon(t_canyon)
{
    if (gameChar_world_x < t_canyon.x_pos + 63 && gameChar_world_x > t_canyon.x_pos + 42 - t_canyon.width + 20   && gameChar_y >= floorPos_y)
    {
        isPlummeting = true;
    }
    if (isPlummeting == true)
    {
        gameChar_y += 2;
    }
}

// ---------------------------------
// Confetti flagpole render and check functions
// ---------------------------------

//Function to update the particle system when the player reaches the flagpole
function renderFlagpole()
{
   push();
    
    if(flagpole.isReached)
    {
        
        if (level == 1 && level1end != true)
        {
            levelWinSound.play();
            level1end = true;    
        }
        if (level == 2 &&level2end != true)
        {
            levelWinSound.play();
            level2end = true;     
        }
        if (level == 3 && level3end != true)
        {
            levelWinSound.play();
            
            backTrackNight.stop();
            winGameSound.loop();
            emit = new Emitter(width/2, floorPos_y, 0, 0, 0, color(100,100,100, 50));
            emit.startEmitter(5000, floorPos_y);
            level3end = true;
        }
        emit.updateParticles();
    }
    else
    {
        emit.updateParticles();     
    }
   pop();
}
//Function to check if player has touched the confetti flagpole
function checkFlagpole()
{
    var d = abs(gameChar_world_x - flagpole.x_pos);
    
    if(d < 15)
    {
        flagpole.isReached = true;        
    }
}
//Functions to create the particles of the emitter
function Particle(x, y, xSpeed, ySpeed, size, colour)
{
    this.x = x;
    this.y = y;
    this.xSpeed = xSpeed;
    this.ySpeed = ySpeed;
    this.size = size;
    this.colour = colour;
    this.age = 0;
    
    this.drawParticle = function()
    {
        fill(this.colour);
        ellipse(this.x, this.y, this.size);
    }
    
    this.updateParticle = function()
    {
        this.x += this.xSpeed;
        this.y += this.ySpeed;
        this.age++;
    }
}
//Function to create the particle emitter for the confetti flagpole
function Emitter(x, y, xSpeed, ySpeed, size, colour)
{
    this.x = x;
    this.y = y;
    this.xSpeed = xSpeed;
    this.ySpeed = ySpeed;
    this.size = size;
    this.colour = colour;
    
    this.startParticles = 0;
    this.lifetime = 0;
    
    this.particles = [];
    
    
    this.addParticle = function(mode)
    {
        if (mode == 'NR' || mode == null )
        {    
            var p = new Particle(random(this.x-10,this.x+10), 
                             random(this.y-10, this.y+10), 
                             random(this.xSpeed-1, this.xSpeed+1), 
                             random(this.ySpeed-1, this.ySpeed+1), 
                             random(this.size-4, this.size +4), 
                             this.colour);

            return p;
        }
        if (mode == 'R' && level == 3)
        {
            var p = new Particle(random(this.x-1000,this.x+1000), 
                             random(this.y-1000, this.y+1000), 
                             random(this.xSpeed-2, this.xSpeed+2), 
                             random(this.ySpeed-2, this.ySpeed+2), 
                             random(this.size-4, this.size +4), 
                             color(random(0,255),random(0,255),random(0,255),100));

            return p;    
        }
        if (mode == 'R')
        {
            var p = new Particle(random(this.x-30,this.x+10), 
                             random(this.y-100, this.y+10), 
                             random(this.xSpeed-2, this.xSpeed+2), 
                             random(this.ySpeed-2, this.ySpeed+2), 
                             random(this.size-4, this.size +4), 
                             color(random(0,255),random(0,255),random(0,255),100));

            return p;    
        }

        
        
    }
    
    
    this.startEmitter = function(startParticles, lifetime)
    {
        this.startParticles = startParticles;
        this.lifetime = lifetime;
        
        //start emitter with initial particles
        for(var i = 0; i < startParticles; i++)
        {   
            this.particles.push(this.addParticle());
        }
    }
    
    this.updateParticles = function()
    {
        //iterate through particles and draw to the screen
        

        var deadParticles = 0;
        for(var i = this.particles.length - 1; i >= 0; i--)
        {
            this.particles[i].drawParticle();
            this.particles[i].updateParticle();
            if(this.particles[i].age > random(0, this.lifetime))
            {
                this.particles.splice(i, 1);
                deadParticles++;
            }
        }
        
        
        
        if (deadParticles > 0)
        {
            for(var i = 0; i < deadParticles; i++)
            {
                if (flagpole.isReached == false)
                {
                    this.particles.push(this.addParticle()); 
                }
                
                if (flagpole.isReached == true)
                {
                    this.particles.push(this.addParticle('R'));
                }
                  
            }
               
        }
        
    } 
}
    
// ----------------------------------
// Collectable items render and check functions
// ----------------------------------

// Function to draw collectable objects.
function drawCollectable(t_collectable)
{
    fill(0,255,255);
    ellipse(t_collectable.x_pos, t_collectable.y_pos,t_collectable.size + 10, t_collectable.size + 10);
    fill(255)
    ellipse(t_collectable.x_pos, t_collectable.y_pos,t_collectable.size + 7, t_collectable.size + 7);
    fill(255,228,181);
    ellipse(t_collectable.x_pos, t_collectable.y_pos,t_collectable.size + 2, t_collectable.size + 2);
    
    //Pepperoni
    fill(255,99,71);

    
    ellipse(t_collectable.x_pos - t_collectable.size/6.25,
            t_collectable.y_pos - t_collectable.size/3.57,
            t_collectable.size/5, 
            t_collectable.size/5);
    
    
    ellipse(t_collectable.x_pos - t_collectable.size/2.94,
            t_collectable.y_pos + t_collectable.size/25,
            t_collectable.size/5, 
            t_collectable.size/5);
    
    ellipse(t_collectable.x_pos,
            t_collectable.y_pos + t_collectable.size/25,
            t_collectable.size/5, 
            t_collectable.size/5);
    
    ellipse(t_collectable.x_pos + t_collectable.size/5,
            t_collectable.y_pos + t_collectable.size/3.33,
            t_collectable.size/5, 
            t_collectable.size/5);
    
    ellipse(t_collectable.x_pos + t_collectable.size/4.17, 
            t_collectable.y_pos - t_collectable.size/3.33,
            t_collectable.size/5, 
            t_collectable.size/5);
    
    ellipse(t_collectable.x_pos + t_collectable.size/2.94,
            t_collectable.y_pos - t_collectable.size/25,
            t_collectable.size/5, 
            t_collectable.size/5);
    
    ellipse(t_collectable.x_pos - t_collectable.size/8.3,
            t_collectable.y_pos + t_collectable.size/3.125,
            t_collectable.size/5, 
            t_collectable.size/5);

    
    //Olives 
    strokeWeight(t_collectable.size/10);
    stroke(4);
    
    point(t_collectable.x_pos,
          t_collectable.y_pos - t_collectable.size/2.5 );
    
    point(t_collectable.x_pos - t_collectable.size/2.63,
          t_collectable.y_pos - t_collectable.size/5.55);
    
    point(t_collectable.x_pos + t_collectable.size/16.67, 
          t_collectable.y_pos - t_collectable.size/5.55 );
    
    point(t_collectable.x_pos - t_collectable.size/3.33, 
          t_collectable.y_pos + t_collectable.size/4.17);
    
    point(t_collectable.x_pos + t_collectable.size/2.78, 
          t_collectable.y_pos + t_collectable.size/7.14);
    
    point(t_collectable.x_pos + t_collectable.size/16.67, 
          t_collectable.y_pos + t_collectable.size/2.63);
    

    
    //Pineapple
    noStroke();
    fill(255,255,0);
    
    triangle(t_collectable.x_pos - t_collectable.size/6.25,             
             t_collectable.y_pos - t_collectable.size/8.33,
             t_collectable.x_pos - t_collectable.size/4.54,
             t_collectable.y_pos,
             t_collectable.x_pos - t_collectable.size/10,
             t_collectable.y_pos);
    
    triangle(t_collectable.x_pos + t_collectable.size/6.25,             
             t_collectable.y_pos + t_collectable.size/16.67,
             t_collectable.x_pos + t_collectable.size/10,
             t_collectable.y_pos + t_collectable.size/5.56,
             t_collectable.x_pos + t_collectable.size/4.54,
             t_collectable.y_pos + t_collectable.size/5.56);
    
    triangle(t_collectable.x_pos + t_collectable.size/2.63,             
             t_collectable.y_pos - t_collectable.size/3.57,
             t_collectable.x_pos + t_collectable.size/3.13,
             t_collectable.y_pos - t_collectable.size/6.25,
             t_collectable.x_pos + t_collectable.size/2.27,
             t_collectable.y_pos - t_collectable.size/6.25);
}
//Function draw life token
function drawLifeToken ()
{
    for(var i =0; i < lives; i++)
    {
        //head
            fill(255,178,102);
            rect(lifeToken[i].x_pos - 20, lifeToken[i].y_pos - 60,40,35);
        //ears
            triangle(lifeToken[i].x_pos- 10, lifeToken[i].y_pos -75,
                     lifeToken[i].x_pos - 20 , lifeToken[i].y_pos - 60,
                     lifeToken[i].x_pos - 2, lifeToken[i].y_pos - 60);

            triangle(lifeToken[i].x_pos + 10, lifeToken[i].y_pos -75,
                     lifeToken[i].x_pos + 20 , lifeToken[i].y_pos - 60,
                     lifeToken[i].x_pos + 2, lifeToken[i].y_pos - 60);
        //inner ear
            fill(255,204,204);
            triangle(lifeToken[i].x_pos - 10 , lifeToken[i].y_pos -70,
                     lifeToken[i].x_pos - 17, lifeToken[i].y_pos - 60,
                     lifeToken[i].x_pos - 5, lifeToken[i].y_pos - 60);

            triangle(lifeToken[i].x_pos + 10 , lifeToken[i].y_pos -70,
                     lifeToken[i].x_pos + 17, lifeToken[i].y_pos - 60,
                     lifeToken[i].x_pos + 5, lifeToken[i].y_pos - 60);
        //eyes
            fill(255);
            ellipse(lifeToken[i].x_pos - 10, lifeToken[i].y_pos - 50, 10, 15);
            ellipse(lifeToken[i].x_pos + 10, lifeToken[i].y_pos - 50, 10, 15);
        //pupils
            fill(0);
            ellipse(lifeToken[i].x_pos - 10, lifeToken[i].y_pos - 50, 5, 10);
            ellipse(lifeToken[i].x_pos + 10, lifeToken[i].y_pos - 50, 5, 10);  
        //nose
            fill(0);
            triangle(lifeToken[i].x_pos,lifeToken[i].y_pos - 42, 
                     lifeToken[i].x_pos - 4,lifeToken[i].y_pos - 36,
                     lifeToken[i].x_pos + 4,lifeToken[i].y_pos - 36 );
        //mouth
            noFill();
            stroke(0);
            arc(lifeToken[i].x_pos-5,lifeToken[i].y_pos - 36, 10,10,0 ,PI);
            arc(lifeToken[i].x_pos+5,lifeToken[i].y_pos - 36, 10,10,0 ,PI);
            noStroke();
    }
    
      
}
// Function to check character has collected an item.
function checkCollectable(t_collectable)
{
    if(dist(gameChar_world_x,gameChar_y, t_collectable.x_pos, t_collectable.y_pos) < 50)
    {
        t_collectable.isFound = true;
        game_score += 1;
        eatPizzaSound.play();
    }
}
//Function to check if player has died
function checkPlayerDie()
{
    if (gameChar_y > height || enemyTouch == true)
    {
        lives -= 1;
        if (lives >= 1)
        {
           gameChar_x = width/2;
	       gameChar_y = floorPos_y;
           scrollPos = 0;
           gameChar_world_x = gameChar_x - scrollPos;
           isLeft = false;
	       isRight = false;
	       isFalling = false;
	       isPlummeting = false;
        }
    }
    


}

// ----------------------------------
// Start Game
// ----------------------------------

//Function to start game
function startGame()
{
    gameChar_x = width/2;
	gameChar_y = floorPos_y;
    level1end = false;
    level2end = false;
    level3end = false;

	// Variable to control the background scrolling.
	scrollPos = 0;

	// Variable to store the real position of the gameChar in the game
	// world. Needed for collision detection.
	gameChar_world_x = gameChar_x - scrollPos;
    
    gameOver = false;
    
    // stop the sound loops
    backTrackNight.stop();
    backTrackRain.stop();
    backTrackSound.stop();
    winGameSound.stop();
    
    // Set the game up for level 1
    if (level == 1)
    {
        backTrackSound.loop();
        flagpole = {isReached: false, x_pos: 1700};
        
        // Initialise arrays of scenery objects.
        collectables = [{x_pos: 400, y_pos: 400, size: 50, isFound: false},
                        {x_pos: -400, y_pos: 400, size: 50, isFound: false},
                        {x_pos: -800, y_pos: 400, size: 50, isFound: false},
                        {x_pos: 1400, y_pos: 400, size: 50, isFound: false},
                        {x_pos: 1600, y_pos: 400, size: 50, isFound: false},
                        {x_pos: 1200, y_pos: 400, size: 50, isFound: false},
                        {x_pos: -1900, y_pos: 400, size: 50, isFound: false},
                        {x_pos: 700, y_pos: 300, size: 50, isFound: false},
                        {x_pos: -50, y_pos: 300, size: 50, isFound: false},
                        {x_pos: -600, y_pos: 300, size: 50, isFound: false}];
    
       mountains =  [{x_pos: 400, y_pos: 161, size :350 },
                     {x_pos: -600, y_pos: 161, size :350 },
                     {x_pos: -800, y_pos: 161, size :350 },
                     {x_pos: -1400, y_pos: 161, size :350 },
                     {x_pos: -2000, y_pos: 161, size :350 },
                     {x_pos: 1000, y_pos: 161, size :350 },
                     {x_pos: 1400, y_pos: 161, size :350 },
                     {x_pos: 2000, y_pos: 161, size :350 }];
    
        canyons =  [{x_pos: 0, width: 200},
                    {x_pos: -1000, width: 100},
                    {x_pos: 900, width: 150},
                    {x_pos: 1900, width: 150},
                    {x_pos: -2100, width: 500}];
    
         clouds =  [{x_pos: 100, y_pos: 200, size: 60},
                    {x_pos: 400, y_pos: 150, size: 80},
                    {x_pos: 900, y_pos: 90, size: 40},
                    {x_pos: 1800, y_pos: 130, size: 80},
                    {x_pos: -100, y_pos: 80, size: 80},
                    {x_pos: -250, y_pos: 120, size: 40},
                    {x_pos: -900, y_pos: 100, size: 40},
                    {x_pos: -1500, y_pos: 160, size: 90}];
    
        lifeToken = [{x_pos: 900, y_pos: 80},
                     {x_pos: 950, y_pos: 80},
                     {x_pos: 1000, y_pos: 80}];
        
        trees_x = [100, 300, 500, 1000, 2200, -700, -1500, -2000];
        trees2_x = [200, 1300, 2000, -800, -1300, -1800];
        treePos_y = height/2;
        
        //create platforms
        platforms = [];
        platforms.push(createPlatforms(-100,floorPos_y -  60,100));
        platforms.push(createPlatforms(650,floorPos_y - 100, 100));
        
        //create enemies
        enemies = [];
        enemies.push(new Enemy(-400, floorPos_y - 30, 100));
        enemies.push(new Enemy(-1400, floorPos_y - 30, 200));
       
    }
    //Set the game up for level 2
    if (level == 2)
    {
        backTrackRain.loop();
        flagpole = {isReached: false, x_pos: -2000};
        raindrop = [];
        
        //Create the raindrop object for level 2
        for(var i = 0; i < 200; i++) 
        {
           raindrop[i] = new Drop();
        }
        
        // Initialise arrays of scenery objects.
        collectables = [{x_pos: -300, y_pos: 200, size: 50, isFound: false},
                        {x_pos: -480, y_pos: 100, size: 50, isFound: false},
                        {x_pos: 700, y_pos: 300, size: 50, isFound: false},
                        {x_pos: -50, y_pos: 300, size: 50, isFound: false},
                        {x_pos: 750, y_pos: 200, size: 50, isFound: false},
                        {x_pos: 650, y_pos: 100, size: 50, isFound: false},
                        {x_pos: 450, y_pos: 100, size: 50, isFound: false},
                        {x_pos: 200, y_pos: 150, size: 50, isFound: false},
                        {x_pos: 1500, y_pos: 400, size: 50, isFound: false},
                        {x_pos: 1700, y_pos: 400, size: 50, isFound: false},
                        {x_pos: 2000, y_pos: 400, size: 50, isFound: false},
                        {x_pos: -1600, y_pos: 300, size: 50, isFound: false},
                        {x_pos: -1800, y_pos: 300, size: 50, isFound: false}];
    
       mountains =  [{x_pos: 200, y_pos: 161, size :350 },
                     {x_pos: -1800, y_pos: 161, size :350 },
                     {x_pos: -2000, y_pos: 161, size :350 },
                     {x_pos: 1000, y_pos: 161, size :350 },
                     {x_pos: 1200, y_pos: 161, size :350 },];
    
        canyons =  [{x_pos: 0, width: 700},
                    {x_pos: -1000, width: 200},
                    {x_pos: 900, width: 150},
                    {x_pos: 1900, width: 150},
                    {x_pos: -2100, width: 500},
                    {x_pos: 2800, width: 700}];
    
         clouds =  [{x_pos: 100, y_pos: 200, size: 60},
                    {x_pos: 400, y_pos: 150, size: 80},
                    {x_pos: 900, y_pos: 90, size: 40},
                    {x_pos: 1800, y_pos: 130, size: 80},
                    {x_pos: -100, y_pos: 80, size: 80},
                    {x_pos: -150, y_pos: 190, size: 50},
                    {x_pos: -400, y_pos: 200, size: 80},
                    {x_pos: -650, y_pos: 120, size: 40},
                    {x_pos: -900, y_pos: 100, size: 40},
                    {x_pos: -1500, y_pos: 160, size: 90}];
    
        lifeToken = [{x_pos: 900, y_pos: 80},
                     {x_pos: 950, y_pos: 80},
                     {x_pos: 1000, y_pos: 80}];
        
        trees_x = [300, 600, 1000, -700, -1500, -2000];
        trees2_x = [200, 1300, 1500, 2000, -800, -1300, -1800];
        treePos_y = height/2;

    
        platforms = [];
        platforms.push(createPlatforms(-100,floorPos_y -  60,100));
        
        platforms.push(createPlatforms(650,floorPos_y - 100, 100));
        platforms.push(createPlatforms(700,floorPos_y - 200,100));

        platforms.push(createPlatforms(600,floorPos_y - 300, 100));
        platforms.push(createPlatforms(400,floorPos_y - 300,100));
        
        platforms.push(createPlatforms(100,floorPos_y - 200,200));
        
        platforms.push(createPlatforms(- 400,floorPos_y - 120,200));
        
        platforms.push(createPlatforms(- 520,floorPos_y - 200,80));
        
        enemies = [];
        enemies.push(new Enemy(100, floorPos_y - 30, 100));
        enemies.push(new Enemy(1100, floorPos_y - 30, 100));
        enemies.push(new Enemy(-1700, floorPos_y - 30, 200));
    }
    //Set the game up for level 3
    if (level == 3)
    {
        backTrackNight.loop();
        flagpole = {isReached: false, x_pos: 2000};
        
        // Initialise arrays of scenery objects.
        collectables = [{x_pos: -300, y_pos: 200, size: 50, isFound: false},
                        {x_pos: -480, y_pos: 100, size: 50, isFound: false},
                        {x_pos: 1000, y_pos: 100, size: 50, isFound: false},
                        {x_pos: -50, y_pos: 300, size: 50, isFound: false},
                        {x_pos: 750, y_pos: 200, size: 50, isFound: false},
                        {x_pos: 650, y_pos: 100, size: 50, isFound: false},
                        {x_pos: 450, y_pos: 100, size: 50, isFound: false},
                        {x_pos: 200, y_pos: 150, size: 50, isFound: false},
                        {x_pos: 1500, y_pos: 400, size: 50, isFound: false},
                        {x_pos: 1800, y_pos: 200, size: 50, isFound: false},
                        {x_pos: -2000, y_pos: 400, size: 50, isFound: false},
                        {x_pos: -1800, y_pos: 300, size: 50, isFound: false}];
    
       mountains =  [{x_pos: 400, y_pos: 161, size :350 },
                     {x_pos: -400, y_pos: 161, size :350 },
                     {x_pos: -600, y_pos: 161, size :350 },
                     {x_pos: -1800, y_pos: 161, size :350 },
                     {x_pos: -2000, y_pos: 161, size :350 },
                     {x_pos: 1000, y_pos: 161, size :350 },
                     {x_pos: 1400, y_pos: 161, size :350 },];
    
        canyons =  [{x_pos: -800, width: 200},
                    {x_pos: 900, width: 150},
                    {x_pos: 1900, width: 150},
                    {x_pos: -2100, width: 500},
                    {x_pos: 2800, width: 700}];
    
    
        lifeToken = [{x_pos: 900, y_pos: 80},
                     {x_pos: 950, y_pos: 80},
                     {x_pos: 1000, y_pos: 80}];
        
        trees_x = [-50, 600, 1000, -550, -1500, -2000];
        trees2_x = [200, 1300, 2000, -600, -1300, -1800];
        treePos_y = height/2;

    
        platforms = [];
        platforms.push(createPlatforms(-100,floorPos_y -  60,100));
        
        platforms.push(createPlatforms(650,floorPos_y - 100, 100));
        platforms.push(createPlatforms(700,floorPos_y - 200,100));

        platforms.push(createPlatforms(600,floorPos_y - 300, 100));
        platforms.push(createPlatforms(400,floorPos_y - 300,200));
        
        platforms.push(createPlatforms(900,floorPos_y - 200,200));
        
        platforms.push(createPlatforms(-520,floorPos_y - 200,80));
        platforms.push(createPlatforms(-420,floorPos_y - 100,80));
        
        platforms.push(createPlatforms(1700,floorPos_y - 100, 100));
    
        
        //Set enemies
        enemies = [];
        enemies.push(new Enemy(100, floorPos_y - 30, 100));
        enemies.push(new Enemy(900, floorPos_y - 235, 100));
        enemies.push(new Enemy(-1700, floorPos_y - 30, 200));
              
        stars = [];
        for( var i = 0; i < 200; i++)
        stars.push({x: random(-2000,2000),
                    y: random(-200, 400)});
        
    }

	// Boolean variables to control the movement of the game character.
	isLeft = false;
	isRight = false;
	isFalling = false;
	isPlummeting = false;  
    
    //Create the emitter for the flagpole
    emit = new Emitter(flagpole.x_pos, floorPos_y, 0, -1, 5, color(100,100,100, 50));
    emit.startEmitter(1000, floorPos_y);
       
}

// ----------------------------------
// Create Platforms and Enemies
// ----------------------------------

//function to create platforms
function createPlatforms(x, y, length)
{
    var p = {
        x: x,
        y: y,
        length: length,
        draw: function()
        {           
            fill(205,133,63);
            rect(this.x, this.y, this.length, 20);
            if (level == 1)
            {
              fill(0,155,0);  
            }
            if (level == 2 || level == 3 )
            {
              fill(85,107,47);    
            }
            rect(this.x,this.y,this.length,5);
            
        },
        
        //Check if game character is on the platform
        checkContact: function(gc_x, gc_y)
        {
            if (gc_x > this.x && gc_x < this.x + this.length)
            {
                var d = this.y - gc_y;
                if(d >= 0 && d < 5)
                {
                    return true;
                }
            }
            return false;
        }
        }
    
    return p;
}
//Create enemies
function Enemy(x, y, range)
{
    this.x = x;
    this.y = y;
    this.range = range;
    
    this.currentX = x;
    this.inc = 1;
    this.facing = 'right';
    
    this.update = function()
    {
        this.currentX += this.inc;
        
        //Keep enemy moving within a range
        if(this.currentX >= this.x + this.range)
        {
            this.inc = -1;
            this.facing = 'left';
        }
        else if(this.currentX < this.x)
        {
            this.inc = 1;
            this.facing = 'right';
        }
    }
    
    //Draw the enemy
    this.draw = function()
    {
        this.update();
        
        noStroke();
        fill(186,135,89);
        //body
        rect(this.currentX,this.y,40,25);
    
        //legs
        rect(this.currentX,this.y+25,10,10);
        rect(this.currentX +30,this.y+25,10,10);
    
    
    
        if (this.facing == 'left')
        {
            //head & nose
            rect(this.currentX - 15,this.y - 10,25,25);
            rect(this.currentX - 30,this.y + 5,40,15); 

            //ears
            triangle(this.currentX - 5,this.y - 10,
                     this.currentX + 10,this.y - 10,
                     this.currentX,this.y  -30);

            //nose
            fill(0);
            rect(this.currentX - 33,this.y + 5,5,5);

            //eyes
            fill(255);
            ellipse(this.currentX - 7,this.y ,10,12);
            strokeWeight(5);
            stroke(0);
            point(this.currentX - 9,this.y);

            //tail
            stroke(186,135,89);
            line(this.currentX + 40, this.y + 2, this.currentX + 50, this.y +10 );
        
        
        }
    
        if (this.facing == 'right')
        {
            //head & nose
            rect(this.currentX + 30,this.y - 10,25,25);
            rect(this.currentX + 30,this.y + 5,40,15);  

            //ears
            triangle(this.currentX + 30,this.y - 10,
                     this.currentX + 45,this.y - 10,
                     this.currentX + 35,this.y  -30);
            //nose
            fill(0);
            rect(this.currentX + 67,this.y + 5,5,5);

            //eyes
            fill(255);
            ellipse(this.currentX + 45,this.y ,10,12);
            strokeWeight(5);
            stroke(0);
            point(this.currentX + 48,this.y);

            //tail
            stroke(186,135,89);
            line(this.currentX, this.y + 2, this.currentX - 10, this.y +10 );
        }


    }
    
    //Check if the player has touched the enemy
    this.checkContact = function(gc_x, gc_y)
    {
        
        if (gc_x >= this.currentX && gc_x <= this.currentX + 40)
        {
            if (gc_y >= this.y && gc_y <= this.y + 40)
            {
                dogBarkSound.play();
                return true;
                
            }
        }
        
        return false;
    }
}


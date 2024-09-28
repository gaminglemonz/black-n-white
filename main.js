/**

BLACK 'N' WHITE
Project started Sept. 14th, 2024
Based off of a game from 2 years ago

@CREDITS
Feedback and testing - Duke @SethCochran11 and ASBackup @ASBackup

@SUBSCRIBE
Want more content like this? Subscribe to me!
https://www.khanacademy.org/computer-programming/lemon-hub-subpage/5979716894244864

@LEADERBOARD
SPIN-OFF PROOF IS NEEDED

1. nilan - 10000
2. BearKirb314 - 9600
3. Panda15 - 8350
4. WAHOO-Allwen - 4750
5. Ace Rogers - 4450
6. -A--I- - 3300
7. cwalsh1223 - 3450
8. Lemon Games - 1500
8. Pineapples - 1500
9. Unknown - ?
10. Unknown - ?

@CATALOG

9/14 -
Started project. Basic setup, variables, and player functions.
9/15 -
Created start page.
Finished player shadow
Added cursor
9/18 -
Added bullets
Added gun
Added enemies
Added player shooting
9/19 -
Added enemy shooting
Added player health bar
Added messages
Added transitions
9/21 -
Added dead screen
RELEASED!
9/22 -
Added loop protector (@dkareh)

**/



// SETUP \\
smooth();
size(600, 600, P2D);
noStroke();
var push = pushMatrix;
var pop = popMatrix;

// Credit to Daniel @dkareh
(function(){return this;})().LoopProtector.prototype.leave = function(){};

// Credit to Vexcess (@VXS)
var PJSCodeInjector, Reflect = sq.constructor("return Reflect")();PJSCodeInjector.applyInstance = function (o) {return function () {return Reflect.construct(o, arguments);};};

// FONTS \\
var font = createFont("Arial Black");
textFont(font);
textAlign(3, 3);

// VARIABLES \\
var scene = 'home';

var clicked = false;
var shaking = false;

var keys = {};
var mouse = {};
var customCursor = {
    outer: 40,
    inner: 15,
    run: function(){
        cursor("none");
        pushStyle();
        strokeWeight(customCursor.inner);
        stroke(0);
        point(mouseX, mouseY);
        
        strokeWeight(6);
        fill(0, 0, 0, 0);
        ellipse(mouseX, mouseY, customCursor.outer, customCursor.outer);
        
        if (mouseIsPressed){
            customCursor.inner = lerp(customCursor.inner, 10, 0.1);
            customCursor.outer = lerp(customCursor.outer, 30, 0.1);
        } else {
            customCursor.inner = lerp(customCursor.inner, 15, 0.1);
            customCursor.outer = lerp(customCursor.outer, 40, 0.1);
        }
        
        popStyle();
    },
};

var bullets = [];
var enemies = [];
var particles = [];
var positions = ['left', 'top', 'right'];
var messages = [
    {
        txt: "Use WASD or arrow keys to move",
        y: height/2,
    },
    {
        txt: "Aim with your mouse,\nand click to shoot!",
        y: height*1.5,
    },
    {
        txt: "Shoot the enemies",
        y: height*2,
    },
    {
        txt: "Good Luck!",
        y: height*2.5,
    }
];

var kills = 0;
var time = 0;
var maxEnemies = 3;
var msgY = 0;
var score = 0;

// INTRO VARIABLES \\
var fonts = [
    createFont("monospace"),
    createFont("Verdana Italic")
];
textAlign(3, 3);

var x1 = -400;
var y1 = 800;
var introX = 0;
var skipped = false;

// MATRIX \\
var matrix = [];
var Matrix = function(){
    this.x = random(0, width - 20);
    this.y = random(-600, height);
    this.alpha = random(0, 255);
    this.num = round(random(0, 1));
    
    this.run = function(){
        fill(255, 255, 255, this.alpha);
        textSize(35);
        text(this.num, this.x, this.y);
        
        this.alpha -= 3;
        
        if (this.alpha <= 0){
            this.alpha = 255;
            this.y += random(20, 40);
            this.x += random(-40, 40);
        }
        if (this.x > width){
            this.x = random(0, width - 20);
        }
        if (this.y > height){
            this.y = random(-100, 0);
        }
    };
};

// TRANSITIONING \\
var transition = {
    x: width/2,
    img: get(),
    capture: function(){
        this.img = get(0, 0, width, height);
    },
    run: function(){
        
        imageMode(CENTER);
        image(this.img, this.x, height/2, width, height);
        this.x = lerp(this.x, -width/2, 0.1);
        
    },
};

// USER EVENTS \\
mouseReleased = function() {
    clicked = true;
    mouse[mouseButton] = true;
};
keyPressed = function() {
    keys[String(key).toLowerCase()] = true;
    keys[String(keyCode).toLowerCase()] = true;
};
keyReleased = function() {
    delete keys[String(key).toLowerCase()];
    delete keys[String(keyCode).toLowerCase()];
};

// RANDOMIZER \\
function randomize(arr){
    return arr[Math.round(Math.random(0, arr.length)*arr.length)];
}

// COLLISIONS \\
function circCirc(c1, c2){
    return dist(c1.x, c1.y, c2.x, c2.y) <= c1.r/2 + c2.r/2;
}

// BACKGROUND \\
var Background = (function(){
    background(255);
    
    pushStyle();
    for (var i = 0; i < height; i ++){
        var clr1 = color(140, 140, 140);
        var clr2 = color(194, 194, 194);
        
        stroke(lerpColor(clr1, clr2, i/height));
        line(0, i, width, i);
    }
    popStyle();
    
    return get(0, 0, 600, 600);
})();

// THUMBNAIL \\
var Thumbnail = (function(){
    background(255);
    
    fill(0);
    
    rect(0, height/2, width, height/2);
    textSize(130);
    text("BLACK", width/2, height/4);
    text("'N'", width/2, height/2);
    
    push();
            
        // Body
        fill(0);
        ellipse(300, -20, 200, 200);
            
        // Eyes
        pushStyle();
        stroke(255);
        strokeWeight(25);
        line(270, 30, 270, -20);
        line(330, 30, 330, -20);
        
        popStyle();
    pop();
    
    var black = get(0, 0, 600, 300);
    
    fill(255);
    text("WHITE", width/2, height - height/4);
    text("'N'", width/2, height/2);
    
    push();
            
        // Body
        fill(255);
        ellipse(300, 620, 200, 200);
            
        // Eyes
        pushStyle();
        stroke(0);
        strokeWeight(25);
        line(270, 570, 270, 620);
        line(330, 570, 330, 620);
        
        popStyle();
    pop();
    
    var white = get(0, 300, 600, 300);
    
    background(255);
    image(black, 0, 0);
    image(white, 0, 300);
    
    
    return get();
})();

// PARTICLES \\
function Particle(x, y){
    this.x = x;
    this.y = y;
    this.v = {
        x: random(-3, 3),
        y: random(-3, 3),
    };
    this.alpha = 255;
    this.dead = false;
    
    this.run = function() {
        this.x += this.v.x;
        this.y += this.v.y;
        this.alpha -= 5;
        
        pushStyle();
        
            strokeWeight(5);
            stroke(0, 0, 0, this.alpha);
            point(this.x, this.y);
        
        popStyle();
        
        if (this.x < 0 || this.x > width ||
            this.y < 0 || this.y > height ||
            this.alpha < 0){
                this.dead = true;
            }
    };    
}

// BULLETS \\
function Bullet(x, y, angle){
    this.x = x;
    this.y = y;
    this.r = 20;
    this.angle = angle;
    this.dead = false;
    
    this.run = function() {
        push();
        translate(this.x, this.y);
        rotate(this.angle);
            pushStyle();
                stroke(0);
                strokeWeight(this.r);
                point(0, 0);
            popStyle();
        pop();
        
        this.x += cos(this.angle) * 5;
        this.y += sin(this.angle) * 5;
        
        if (this.dead){
            for (var i = 0; i < 8; i ++){
                particles.push(new Particle(this.x, this.y));
            }
        }
    };
}

// PLAYER \\
function Player(x, y){
    this.x = x;
    this.y = y;
    this.r = 90;
    this.angle = 0;
    this.shootAngle = 0;
    this.splats = [];
    
    this.health = 100;
    this.dead = false;
    
    this.v = {
        x: 0,
        y: 0,
    };
    this.grav = 0.3;
    this.jumping = false;
    
    this.draw = function() {
        // Aim
        this.shootAngle = atan2(mouseY - this.y, mouseX - this.x);

        // Shadow
        fill(150, 150, 150, 100);
        ellipse(this.x, 556, this.r+(this.y/10)-50, this.r/4);
        
        push();
        translate(this.x, this.y);
        rotate(this.angle);
            
            // Body
            fill(255);
            ellipse(0, 0, this.r, this.r);
            
            // Eyes
            pushStyle();
                stroke(0);
                strokeWeight(10);
                line(-15, 10, -15, -10);
                line(15, 10, 15, -10);
                
            popStyle();
            
            
        pop();
        push();
        translate(this.x, this.y);
        rotate(this.shootAngle);
            pushStyle();
                // Gun
                stroke(255);
                strokeWeight(20);
                
                line(60, 0,100, 0);
            popStyle();
        
        pop();
        
        pushStyle();
            // Health Bar
            fill(255, 0, 0);
            strokeWeight(20);
            rect(this.x-51, this.y-75, 100, 20, 50);
            
            fill(0, 255, 0);
            rect(this.x-51, this.y-75, this.health, 20, 50);
        popStyle();
    };
    this.move = function() {
        this.x = constrain(this.x, this.r/2, width - this.r/2);
        
        // X Movement {
        if (keys.d || keys[RIGHT]){
            this.angle += 5;
            this.v.x = 5;
        } else if (keys.a || keys[LEFT]){
            this.angle += -5;
            this.v.x = -5;
        } else {
            this.v.x = 0;
            this.angle = lerp(this.angle, round(this.angle/180)*180, 0.1);
        }
        this.x += this.v.x;
        // }
        // Y Movement {
        if ((keys.w || keys[UP]) & !this.jumping){
            this.v.y = -10;
            this.jumping = true;
        }
        if ((keys.s || keys[DOWN]) & this.jumping){
            this.grav = 1.3;
        } else {
            this.grav = 0.3;
        }
        this.y += this.v.y;
        this.v.y += this.grav;
        
        if (this.y >= 510){
            this.jumping = false;
            this.y = 510;
            this.vy = 0;
        }
        // }
        for (var i = bullets.length; i --;){
            if (circCirc(this, bullets[i])){
                this.health -= 10;
                bullets[i].dead = true;
            }
        }
        this.shoot();
        
        // Heal
        if (time % 100 === 50 && this.health < 100){
            this.health += 2;
        }
        this.health = constrain(this.health, 0, 100);
        
        // Die
        if (this.health <= 0){
            transition.x = width/2;
            transition.capture();
            this.dead = true;
            scene = 'dead';
        }
    };
    this.shoot = function(){
        if (mouse[LEFT]){
            bullets.push(new Bullet(this.x + cos(this.shootAngle)*100, this.y + sin(this.shootAngle)*100, this.shootAngle));
        }
    };
    this.run = function() {
        this.draw();
        this.move();
    };
}
var player = new Player(width/2, 510);

// ENEMIES \\
function Enemy(position){
    this.setX = 0;
    this.setY = 0;
    this.r = 90;
    this.angle = 0;
    this.reload = 70;
    
    this.pos = position;
    this.canSpawn = false;
    this.health = 100;
    this.dead = false;
    
    switch (this.pos) {
        case 'left':
            this.setX = 0;
            this.setY = random(45, 500);
        break;
        case 'right':
            this.setX = 690;
            this.setY = random(45, 500);
        break;
        case 'top':
            this.setX = random(45, 600);
            this.setY = 0;
        break;
    }

    this.x = this.setX - this.r/2;
    this.y = this.setY - this.r/2;
    
    this.draw = function() {
        fill(0);
        push();
        translate(this.x, this.y);
            
            // Body
            fill(0);
            ellipse(0, 0, this.r, this.r);
            
            // Eyes
            pushStyle();
                stroke(255);
                strokeWeight(10);
                line(-15, 10, -15, -10);
                line(15, 10, 15, -10);
            popStyle();
            
        rotate(this.angle);
            // Gun
            pushStyle();
                stroke(0);
                strokeWeight(20);
                
                line(60, 0,  100, 0);
            popStyle();
        pop();
        
        if (this.pos === 'top'){
            pushStyle();
                // Health Bar
                fill(255, 0, 0);
                strokeWeight(20);
                rect(this.x-51, this.y+35, 100, 20, 50);
                
                fill(0, 255, 0);
                rect(this.x-51, this.y+35, this.health, 20, 50);
            popStyle();
        } else {
            
            // Health Bar
            fill(255, 0, 0);
            strokeWeight(20);
            rect(this.x + (this.pos === 'right' ? -65 : 65), this.y - 45, 20, 100, 50);
            
            fill(0, 255, 0);
            rect(this.x + (this.pos === 'right' ? -65 : 65), this.y - 45 + (100 - this.health), 20, this.health, 50);
        }
        
    };
    this.move = function() {
        this.angle = atan2(player.y - this.y, player.x - this.x);
        
        if (this.pos === 'left'){
            this.x = lerp(this.x, 10, 0.1);
        } else if (this.pos === 'top'){
            this.y = lerp(this.y, 7, 0.1);
        } else if (this.pos === 'right'){
            this.x = lerp(this.x, 590, 0.1);
        }
        
        for (var i = bullets.length; i --;){
            if (circCirc(this, bullets[i])){
                this.health -= 20;
                bullets[i].dead = true;
            }
        }
        
        if (this.health <= 0){ // KILL THEM
            score += 50;
            this.dead = true;
        }
        if (this.x < 0){
            this.x = 45;
        }
        
        this.shoot();
        
    };
    this.shoot = function() {
        if (this.reload <= 0){
            bullets.push(new Bullet(this.x + cos(this.angle)*100, this.y + sin(this.angle)*100, this.angle));
            this.reload = 70;
        }
        this.reload --;
    };
    this.run = function() {
        this.draw();
        this.move();
    };
}

// INTRO \\
function intro(){
    push();
        pushStyle();
        translate(introX, 0);
        
        // BACKGROUND \\
        for (var i = 0; i < width; i ++){
            var color1 = color(255, 247, 0);
            var color2 = color(255, 183, 0);
            
            stroke(lerpColor(color1, color2, i/height));
            line(i, 0, i, height);
        }
        
        // MATRIX \\
        textFont(fonts[0]);
        for (var i = 0; i < 300; i ++){
            matrix.push(new Matrix());
            matrix[i].run();
        }
        
        // ANIMATIONS \\
        x1 = lerp(x1, width/2, 0.1);
        y1 = lerp(y1, height/2 + 100, 0.1);
        
        if (frameCount > 220 || skipped){
            introX = lerp(introX, -800, 0.05);
            if (introX < -590){
                matrix = [];
            }
        }
        
        if (frameCount < 250){
            // MAIN TEXT \\
            fill(255);
            textFont(fonts[1]);
            textSize(228);
            text("LG", x1, height/2 - 50);
            
            textSize(66);
            text("Presents...", width/2, y1);
            
            if (clicked){
                skipped = true;
            }
        }
        popStyle();
    pop();
}

// DRAW \\
var scenes = {
    home: function(){
        fill(0);
        textSize(100);
        text("BLACK", width/2, 100);
        
        fill(135, 132, 135);
        text("'N'", width/2, 200);
        
        fill(255);
        text("WHITE", width/2, height/2);
        
        fill(255, 255, 255, 150+sin(frameCount*5)*50);
        textSize(30);
        text("Click Anywhere To Start", width/2, 450);
        
        if (clicked & frameCount > 200){
            transition.capture();
            scene = 'game';
        }
    },
    game: function(){
        // GROUND \\
        fill(255);
        rect(0, 545, width, height);
        
        // Run enemy functions
        for (var e = enemies.length; e --;){
            enemies[e].run();
            
            if (enemies[e].dead){
                enemies.splice(e, 1);
            }
        }
        
        // Run particle functions
        for (var p = particles.length; p --;){
            particles[p].run();
            
            if (particles[p].dead){
                particles.splice(p, 1);
            }
        }
        
        // Run bullet functions
        for (var b = bullets.length; b --;){
            var bullet = bullets[b];
            bullet.run();
            
            if (bullet.dead){
                bullets.splice(b, 1);
            }
            // Delete bullets
            if (bullet.x < 0 || bullet.x > width + bullet.r ||
                bullet.y < 0 || bullet.y > 500 + bullet.r*2){
                    bullet.dead = true;
                }
        }
        
        // Play messages
        for (var i in messages){
            
            fill(255, 255, 255, 200);
            textSize(30);
            text(messages[i].txt, width/2, messages[i].y);
            
            if (time > 200){
                messages[0].y = lerp(messages[0].y, -370, 0.01);
                messages[1].y = lerp(messages[1].y, 300, 0.01);
            }
            if (time > 400){
                messages[1].y = lerp(messages[1].y, -370, 0.01);
                messages[2].y = lerp(messages[2].y, 300, 0.01);
            }
            if (time > 600){
                messages[2].y = lerp(messages[2].y, -370, 0.01);
                messages[3].y = lerp(messages[3].y, 300, 0.01);
            }
            if (time > 800){
                messages[3].y = lerp(messages[1].y, -370, 0.01);
            }
        }
        
        // Run player functions
        player.run();
        
        // Adjust number of eneimes based on time
        if (enemies.length < maxEnemies & time > 600){
            if (time % 180 === 90){
                enemies.push(new Enemy(randomize(positions)));
            }
        }
        
        // Increase score over time
        if (time > 600 & time % 1000 === 1000){
            score += 100;
        }
        
        // Display game info
        fill(0);
        textSize(25);
        text("SCORE: " + score, 90, 570);
        
        pushStyle();
            textSize(25);
            text("HP: " + player.health, 510, 570);
        popStyle();
        
        transition.run();
        
        time ++;
    },
    dead: function(){
        fill(255);
        textSize(80);
        text("lol u died", width/2, 100);
        textSize(20);
        text("but you got a score of " + score + "\n... that's good... i guess...", width/2, 203);
        
        pushMatrix();
        rectMode(CENTER);
        translate(width/2, height/2 + 100);
        rotate(13);
        
        fill(255);
        rect(0, 0, 250, 250, 10);
        
        image(transition.img, 0, 0, 200, 200);
        
        popMatrix();
        
        transition.run();
        
        fill(255, 255, 255, 150+sin(frameCount*5)*50);
        textSize(30);
        text("Click Here To Restart", width/2, 570);
        
        if (clicked && mouseY > 560){
            Program.restart(); // Inefficient, i know
        }
    },
};
draw = function() {
    background(199, 199, 199);
    imageMode(CENTER);
    image(Background, width/2, height/2, width, height);
    
    scenes[scene]();
    
    resetMatrix();
    
    customCursor.run();
        
    intro();
    
    if (keys['`']){
        image(Thumbnail, width/2, height/2, width, height);
    }
    
    mouse[mouseButton] = false;
    
};


  counter = 0; //variable used when iterating through map data

  push();
  outputVolume(0.5); //set output volume of music
  music.loop(); //loop music
  pop();

  for (let i = 0; i < 16; i++) {
    //iterate through every verticle line in map data
    for (let j = 0; j < 16; j++) {
      //iterate through every horizontal line in map data
      if (map_data[counter] == 128) {
        //if the loop detects value "128" (the map code for a banana), then it creates a collectible
        banana_array.push(
          new Collectible(j * cube_scale, i * cube_scale, cube_scale / 10, 1)
        ); //x, y, size, collectible type
      }
      if (map_data[counter] == 77) {
        //if the loop detects value "77" (the map code for an apple), then it creates a collectible
        apple_array.push(
          new Collectible(j * cube_scale, i * cube_scale, cube_scale / 10, 2)
        ); //x, y, size, collectible type
      }
      if (map_data[counter] == 26) {
        //if the loop detects value "26" (the map code for the player origin), then it creates the player
        player_array.push(
          new Player(
            j * cube_scale,
            i * cube_scale,
            0,
            0,
            255,
            10,
            cube_scale / 10,
            0,
            0,
            3,
            255
          )
        ); //x, y, colR, colG, colB, size, speed, player_direction, wall_collide, lives, alpha_val
      }
      if (map_data[counter] == 211) {
        //if the loop detects value "211" (the map code for the enemy origin), then it creates the enemy
        enemy_array.push(
          new Enemy(j * cube_scale, i * cube_scale, 10, cube_scale / 10, 4, 0)
        ); //x, y, size, speed, direction, wall_collision_state
      }
      if (map_data[counter] == 0) {
        //if the loop detects value "0" (the map code for wall), then it creates a wall
        walls_array.push(new Walls(j * cube_scale, i * cube_scale, cube_scale)); //x, y, size
      }
      counter++;
    }
  }
}

function preload() {
  map_data = loadStrings("map_data_7.txt"); //preload map data (an image that has been converted to text using Netpbm PGM format)
  cobblestone_tex = loadImage("cobblestone.png"); //preload cobble stone texture
  banana_mesh = loadModel("banana.obj"); //preload banana mesh
  banana_tex = loadImage("banana-tex.png"); //preload banana texture
  apple_mesh = loadModel("apple.obj"); //preload apple mesh
  apple_tex = loadImage("apple-tex.png"); //preload apple texture
  score_font = loadFont("Urbanist-Bold.otf"); //preload font
  music = loadSound("music.mp3"); //preload music
  collection_sound = loadSound("collection.mp3"); // preload collection sound effect
  bump = loadSound("bump.mp3"); //preload bump sound effect
  lost_life = loadSound("lost_life.mp3"); //preload lost life sound effect
}

function draw_score() {
  //function to draw score on the screen
  push();
  fill(0, 102, 153);
  textFont(score_font);
  textSize(width / 20);
  translate(cube_scale * 3, 0, 60);
  rotateX(-45);
  text("SCORE: " + score, 0, 0);
  pop();
}

function gameover_screen() {
  //function to show gameover text when called
  push();
  textFont(score_font);
  textSize(width / 20);
  translate(cube_scale * 1.8, 0, 96);
  rotateX(-45);
  text("GAME OVER", 0, 0);
  pop();
}

function lighting() {
  //function to create point lights at certain points in scene
  pointLight(255, 255, 255, 0, 0, 800);
  pointLight(255, 255, 255, 0, -500, 1200);
}

class Walls {
  //a class for wall objects
  constructor(x, y, size) {
    this.x = x; //x pos
    this.y = y; //y pos
    this.size = size; //size
  }

  wall_display() {
    //what wall will do when created
    noStroke();
    push();
    translate(this.x, this.y, 0); //set position to x, y variables
    texture(cobblestone_tex);
    box(cube_scale);
    pop();
  }
}

class Enemy {
  //a class for enemy objects

  constructor(x, y, size, speed, direction, wall_collision_state) {
    this.x = x; //x pos
    this.y = y; //y pos
    this.size = size; //player size
    this.speed = speed; //player speed
    this.direction = direction;
    this.wall_collision_state = wall_collision_state;
  }

  check_enemy_wall_collision() { //this function checks if the enemy is within the bounds of a wall object
    this.wall_collision_state = 0; //this variable changes when the enemy hits a wall

    for (let i = 0; i < walls_array.length; i++) {
      if (
        this.x >= walls_array[i].x - (cube_scale - this.size / 2) &&
        this.x <= walls_array[i].x + (cube_scale - this.size / 2) &&
        this.y >= walls_array[i].y - (cube_scale - this.size / 2) &&
        this.y <= walls_array[i].y + (cube_scale - this.size / 2)
      ) {
        this.wall_collision_state = 1;
        this.enemy_wall_collision_handler();
      }
    }
  }

  enemy_wall_collision_handler() {
    let enemy_directions = [1, 2, 3, 4]; //these numbers account for: 1 = left, 2 = right, 3 = up, 4 = down.

    if (this.direction == 1 && this.wall_collision_state == 1) {
      this.wall_collision_state = 0;
      this.x += this.size / 2; //jump back
      this.direction = random(enemy_directions);
    }
    if (this.direction == 2 && this.wall_collision_state == 1) {
      this.wall_collision_state = 0;
      this.x -= this.size / 2; //jump back
      this.direction = random(enemy_directions);
    }
    if (this.direction == 3 && this.wall_collision_state == 1) {
      this.wall_collision_state = 0;
      this.y += this.size / 2; //jump back
      this.direction = random(enemy_directions);
    }
    if (this.direction == 4 && this.wall_collision_state == 1) {
      this.wall_collision_state = 0;
      this.y -= this.size / 2; //jump back
      this.direction = random(enemy_directions);
    }
  }

  enemy_movement() {
    if (this.direction == 1 && this.wall_collision_state == 0) {
      this.x -= this.speed;
    }
    if (this.direction == 2 && this.wall_collision_state == 0) {
      this.x += this.speed;
    }
    if (this.direction == 3 && this.wall_collision_state == 0) {
      this.y -= this.speed;
    }
    if (this.direction == 4 && this.wall_collision_state == 0) {
      this.y += this.speed;
    }
  }

  enemy_display() {
    //what the enemy object will do when created
    noStroke();
    fill(255, 0, 0); //be created this colour
    push();
    translate(this.x, this.y, 0); //set position to these variables
    box(this.size);
    pop();
  }
}

class Player {
  //a class for player objects
  constructor(
    x,
    y,
    colR,
    colG,
    colB,
    size,
    speed,
    player_direction,
    wall_collide,
    lives,
    alpha_val
  ) {
    this.x = x; //x pos
    this.y = y; //y pos
    this.colR = colR; //player colour
    this.colG = colG;
    this.colB = colB;
    this.size = size; //player size
    this.speed = speed; //player speed
    this.player_direction = player_direction;
    this.wall_collide = wall_collide;
    this.lives = lives;
    this.alpha_val = alpha_val;
  }

  timer_func() {
    if (int(millis() / 100) % 10 != timer) {
      timer++;
    }
  }

  keyReleased() {
    //function to detect when a key is released and how to act accordingly
    if (this.player_direction == 1 && this.wall_collide == 1) {
      //checks the player direction and if the player is colliding with wall, travel in opposite direction of direction the player is facing. this is too avoid the player object become stuck after collision event.
      this.x += this.speed;
    }
    if (this.player_direction == 2 && this.wall_collide == 1) {
      this.x -= this.speed;
    }
    if (this.player_direction == 3 && this.wall_collide == 1) {
      this.y += this.speed;
    }
    if (this.player_direction == 4 && this.wall_collide == 1) {
      this.y -= this.speed;
    }
  }

  draw_lives() {
    //function to draw lives on the screen
    push();
    fill(0, 102, 153);
    textFont(score_font);
    textSize(width / 20);
    translate(cube_scale * 3.5, -20, 150);
    rotateX(-45);
    text("LIVES: " + this.lives, 0, 0);
    pop();
  }

  check_wall_collision() {
    //function to check whether or not player has collided with a wall object
    for (let i = 0; i < walls_array.length; i++) {
      if (
        this.x >= walls_array[i].x - (cube_scale - this.size / 2) &&
        this.x <= walls_array[i].x + (cube_scale - this.size / 2) &&
        this.y >= walls_array[i].y - (cube_scale - this.size / 2) &&
        this.y <= walls_array[i].y + (cube_scale - this.size / 2)
      ) {
        this.wall_collide = 1;
        bump.playMode("untilDone");
        bump.play();
      }
    }
  }

  check_banana_collision() {
    //function to check whether or not player character has collided with banana object
    for (let i = 0; i < banana_array.length; i++) {
      if (
        this.x >= banana_array[i].x - (cube_scale - this.size / 1.5) &&
        this.x <= banana_array[i].x + (cube_scale - this.size / 1.5) &&
        this.y >= banana_array[i].y - (cube_scale - this.size / 1.5) &&
        this.y <= banana_array[i].y + (cube_scale - this.size / 1.5)
      ) {
        banana_array.splice(i, 1);
        score += 1; //increment score by 1
        collection_sound.play();
      }
    }
  }

  check_apple_collision() {
    //function to check whether or not player character has collided with apple object
    for (let i = 0; i < apple_array.length; i++) {
      if (
        this.x >= apple_array[i].x - (cube_scale - this.size / 1.5) &&
        this.x <= apple_array[i].x + (cube_scale - this.size / 1.5) &&
        this.y >= apple_array[i].y - (cube_scale - this.size / 1.5) &&
        this.y <= apple_array[i].y + (cube_scale - this.size / 1.5)
      ) {
        apple_array.splice(i, 1);
        score += 3; //increment score by 3
        collection_sound.play();
      }
    }
  }

  check_enemy_collision() {
    for (let i = 0; i < enemy_array.length; i++) {
      if (
        this.x >= enemy_array[i].x - (cube_scale - this.size / 1.5) &&
        this.x <= enemy_array[i].x + (cube_scale - this.size / 1.5) &&
        this.y >= enemy_array[i].y - (cube_scale - this.size / 1.5) &&
        this.y <= enemy_array[i].y + (cube_scale - this.size / 1.5)
      ) {
        // do stuff
        print("collided with enemy");
        this.life_deductor();
        lost_life.playMode("untilDone");
        lost_life.play();
      }
    }
  }

  life_deductor() {
    if (timer > 100) {
      this.lives -= 1;
      timer = 0;
    }
  }

  alpha_affect() {
    push();
    if (timer < 100) {
      this.alpha_val = 100;
    }
    if (timer >= 100) {
      this.alpha_val = 255;
    }
    pop();
  }

  check_lives() {
    if (this.lives <= 0) {
      for (let i = 0; i < player_array.length; i++) {
        player_array.pop();
        player_state = 0;
      }
    }
  }

  player_display() {
    //what the player object will do when created
    noStroke();
    fill(this.colR, this.colG, this.colB, this.alpha_val); //be created this colour
    push();
    translate(this.x, this.y, 0); //set position to these variables
    box(this.size);
    pop();
  }

  player_controls() {
    //the events which determine what the player object does when keys are pressed
    function keyPressed() {}

    if (keyIsPressed) {
      if (keyCode == RIGHT_ARROW && this.wall_collide == 0) {
        //if right arrow pressed, then move right at "speed" variable
        this.x += this.speed;
        this.player_direction = 2;
      }
      if (keyCode == LEFT_ARROW && this.wall_collide == 0) {
        //if left arrow pressed, then move left at "speed" variable
        this.x -= this.speed;
        this.player_direction = 1;
      }
      if (keyCode == UP_ARROW && this.wall_collide == 0) {
        //if up arrow pressed, then move up at "speed" variable
        this.y -= this.speed;
        this.player_direction = 3;
      }
      if (keyCode == DOWN_ARROW && this.wall_collide == 0) {
        //if down arrow pressed, then move down at "speed" variable
        this.y += this.speed;
        this.player_direction = 4;
      }
    }
  }
}

class Collectible {
  //class to create collectible objects
  constructor(x, y, new_size, type) {
    this.x = x;
    this.y = y;
    this.size = new_size; //what type of collectible it is, there are two, banana or apple
    this.type = type;
  }

  collectible_display() {
    noStroke();
    fill(50);
    push();
    translate(this.x, this.y, 0);
    scale(this.size);
    rotateZ(frameCount * 2);
    rotateX(90);
    if (this.type == 1) {
      //if collectible created with object type 1, then it is a banana
      texture(banana_tex);
      model(banana_mesh);
    }
    if (this.type == 2) {
      //if collectible created with object type 2, then it is an apple
      texture(apple_tex);
      model(apple_mesh);
    }
    pop();
  }
}

function draw() {
  noStroke();
  background(200);

  lighting();

  rotateX(slider2.value()); //global x rotation, this affects all objects in the scene, saves me from having to create a camera (for now)
  rotateY(0); //global y rotation
  rotateZ(slider.value()); //global z rotation
  translate((-cube_scale * width) / (width / 7.5), -50, 150); //global translation

  for (let i = 0; i < banana_array.length; i++) {
    //for every banana object in the array, create a banana object at banana.x,y
    banana_array[i].collectible_display();
  }
  for (let i = 0; i < apple_array.length; i++) {
    //for every apple object in the array, create an apple object at apple.x,y
    apple_array[i].collectible_display();
  }
  for (let i = 0; i < walls_array.length; i++) {
    //for every wall object in the array, create a wall object at wall.x,y
    walls_array[i].wall_display();
  }

  for (let i = 0; i < player_array.length; i++) {
    //for every player object in the array, create a player object at wall.x,y
    player_array[i].wall_collide = 0; //reset collision detector
    player_array[i].timer_func(); //reset collision detector
    player_array[i].check_banana_collision(); //check if there are any banana collisions occurring
    player_array[i].check_apple_collision(); //check if there are any apple collisions occurring
    player_array[i].check_wall_collision(); //check if there are any wall collisions occurring
    player_array[i].check_enemy_collision();
    player_array[i].player_controls(); //initiate the player controls mechanism
    player_array[i].player_display(); //initiate the player display mechanism
    player_array[i].keyReleased();
    player_array[i].draw_lives();
    player_array[i].alpha_affect();
    player_array[i].check_lives();
  }

  for (let i = 0; i < enemy_array.length; i++) {
    //for every enemy object in the array, create an enemy object at enemy.x,y
    enemy_array[i].enemy_display();
    enemy_array[i].check_enemy_wall_collision();
    enemy_array[i].enemy_movement();
  }

  draw_score(); //initiate the display of the score

  if (
    (banana_array.length == 0 && apple_array.length == 0) ||
    player_state == 0
  ) {
    //if both the banana and apple arrays are empty, initiate the gameover text
    gameover_screen();
  }
}

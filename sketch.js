class Item {
  constructor(nextFoodDelta) {
    let maxFoodDistance = nextFoodDelta * playerSpeed;
    this.x = random(max(0, lastFoodPosition - 0.5), min(1, lastFoodPosition + 0.5, 1));
    lastFoodPosition = this.x;
    this.y = -0.3;
    this.type = int(random(3));
  }
}
let backgroundImage;
let playerImage;
let foodSprites;
let liveImage;
let sounds;
let music;
let font;


playerSpeed = 0.0005;
playerPosition = 0.5;
lastFoodPosition = 0.5;
direction = 1;
moving = 0;
let keys = [];
let lastUpdateTime = 0;
let nextFoodTime = 0;
let food;
score = 0;
lives = 3;
dead = false;

itemScale = 0.08;
playerScale = 0.15;

function preload() {
  backgroundImage = loadImage("data/background.png");
  playerImage = loadImage("data/sagaChibi.png");

  foodSprites = [];
  foodSprites[0] = loadImage("data/item1.png");
  foodSprites[1] = loadImage("data/item2.png");
  foodSprites[2] = loadImage("data/item3.png");

  lifeImage = loadImage("data/life.png");

  soundFormats("wav", "mp3");
  sounds = [];
  sounds[0] = loadSound("data/sound1.wav");
  sounds[1] = loadSound("data/sound2.wav");
  sounds[2] = loadSound("data/sound3.wav");
  music = loadSound("data/music.mp3");
  music.amp(0.5);

  food = [];

  font = loadFont("data/NightinTokyo.ttf");

}

function setup() {
  createCanvas(992, 558);
  frameRate(60);

  playerImage.resize(width * playerScale, 0);
  foodSprites[0].resize(width * itemScale, 0);
  foodSprites[1].resize(width * itemScale, 0);
  foodSprites[2].resize(width * itemScale, 0);
  lifeImage.resize(width * itemScale * 1.2, 0);

  music.loop();
}

function draw() {
  millisSinceUpdate = int(millis() - lastUpdateTime);
  lastUpdateTime = millis();
  moving = 1;
  if (keys[0] && !keys[1]) {
    direction = -1;
  } else if (!keys[0] && keys[1]) {
    direction = 1;
  } else if (!keys[0] && !keys[1]) {
    moving = 0;
  }
  if (!dead) {
    playerPosition += moving * direction * millisSinceUpdate * playerSpeed;
    playerPosition = max(min(playerPosition, 1), 0);

    if (lastUpdateTime > nextFoodTime) {

      //value from 0 to 1, 0 is easy, 1 is hard
      let difficulty = 1 - exp(-score / 10);
      let nextFoodDelta = random((2 - difficulty) * 200, 1000);
      nextFoodTime = lastUpdateTime + nextFoodDelta;
      //nextFoodTime = lastUpdateTime + random(1000) + max((20-score), 1) * 50;

      //print("adding food", food.length);
      food.push(new Item(nextFoodDelta));
    }
  }
  //background(255);
  image(backgroundImage, 0, 0);
  push();
  translate(playerPosition * width, height);
  scale(direction, 1);
  image(playerImage, -0.5 * playerImage.width, -playerImage.height);
  pop();

  var i = food.length;
  while (i--) {
    let f = food[i];
    f.y += millisSinceUpdate * 0.0005 * (dead ? 0 : 1);
    if (f.y > 0.80 && abs(f.x - playerPosition) < 0.1) {
      food.splice(i, 1);
      score++;
      //print("caught", score);
      sounds[f.type].play();
      continue;
    }
    if (f.y > 1) {
      food.splice(i, 1);
      lives--;
      if (lives <= 0) {
        dead = true;
      }
      //print("dropped");
      continue;
    }
    image(foodSprites[f.type], (f.x - itemScale / 2) * width, f.y * height);
  }

  if (dead) {
    fill(0, 0, 0, 128);
    rect(0, 0, width, height);
  }

  textSize(width / 20);
  textFont(font);
  fill(255, 0, 0);
  textAlign(CENTER, TOP);
  text("Score: " + score, width / 2, 20);

  if (dead) {
    textSize(width / 5);
    textAlign(CENTER, CENTER);
    text("YOU DIED", width / 2, height / 2);
  }
  i = lives;
  while (i--) {
    image(lifeImage, width * (1 - itemScale * 1.5 * (i + 1)), 0);
  }

}

function keyPressed() {
  if (keyCode == LEFT_ARROW) {
    keys[0] = true;
    direction = -1;
  } else if (keyCode == RIGHT_ARROW) {
    keys[1] = true;
    direction = 1;
  }
  if (key == ' ' && dead) {
    dead = false;
    score = 0;
    food = [];
    lives = 3;
  }
}
function keyReleased() {
  if (keyCode == LEFT_ARROW) {
    keys[0] = false;
  } else if (keyCode == RIGHT_ARROW) {
    keys[1] = false;
  }
}


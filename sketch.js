const { Engine, World, Bodies, Mouse, MouseConstraint, Constraint } = Matter;

let ground;
const boxes = [];
let bird;
let world, engine;
let mConstraint;
let slingshot;
let birdLaunched = false;
let resetTimeout = null;
let isDraggingBird = false;

let dotImg;
let boxImg;
let bkgImg;

function preload() {
  dotImg = loadImage('images/redBird.png');
  boxImg = loadImage('images/Box.png');
  bkgImg = loadImage('images/background0.png');
}

function setup() {
  const canvas = createCanvas(1000, 600);
  canvas.parent("game-container");

  engine = Engine.create();
  world = engine.world;

  ground = new Ground(width / 2, height - 10, width, 20);

  for (let i = 0; i < 3; i++) {
    boxes[i] = new Box(750, 500 - i * 75, 84, 100);
  }

  bird = new Bird(150, 300, 30);
  slingshot = new SlingShot(250, 400, bird.body);

  // MouseConstraint pro tah ptáka
  const mouse = Mouse.create(canvas.elt);
  const options = { 
    mouse: mouse,
    constraint: { stiffness: 0.02, angularStiffness: 0.02 }
  };
  mConstraint = MouseConstraint.create(engine, options);
  World.add(world, mConstraint);

  // blokovat všechny těla kromě ptáka
  Matter.Events.on(mConstraint, "startdrag", function(event) {
  // po vystřelení nejde chytit NIC
  if (birdLaunched) {
    mConstraint.constraint.bodyB = null;
    return;
  }

  // před vystřelením jde chytit jen pták
  if (event.body !== bird.body) {
    mConstraint.constraint.bodyB = null;
  }
});
}

function keyPressed() {
  if (key === ' ') {
    safeResetBird();
  }

  if (key === 'r' || key === 'R') {
    resetGame();
  }
}

function mousePressed() {
  if (birdLaunched) return; // po vystřelení nejde chytit

  const d = dist(mouseX, mouseY, bird.body.position.x, bird.body.position.y);
  if (d < 30) {
    isDraggingBird = true;
  }
}


function mouseReleased() {
  if (isDraggingBird && !birdLaunched) {
    mConstraint.constraint.bodyB = null;
    setTimeout(() => {
      slingshot.fly();
      birdLaunched = true;
    }, 50);
  }
  isDraggingBird = false;
}

function safeResetBird() {
  slingshot.fly();

  // nastaví ptáka přesně na pointA
  Matter.Body.setPosition(bird.body, { 
    x: slingshot.sling.pointA.x, 
    y: slingshot.sling.pointA.y 
  });
  Matter.Body.setVelocity(bird.body, { x: 0, y: 0 });
  Matter.Body.setAngularVelocity(bird.body, 0);
  Matter.Body.setAngle(bird.body, 0);

  slingshot.attach(bird.body);
  birdLaunched = false;
  isDraggingBird = false;
}

function draw() {
  imageMode(CORNER);
  image(bkgImg, 0, 0, width, height);

  Matter.Engine.update(engine);

  // odstranění boxů, které spadnou
  for (let i = boxes.length - 1; i >= 0; i--) {
    if (boxes[i].body.position.y > height + 50) {
      World.remove(world, boxes[i].body);
      boxes.splice(i, 1);
    }
  }

  // pokud žádné boxy nezbyly, reset hry
  if (boxes.length === 0) {
    resetGame();
  }

  // automatický reset ptáka po pádu
  if (
    bird.body.position.x < 0 ||
    bird.body.position.x > width ||
    bird.body.position.y > height
  ) {
    if (!resetTimeout) {
      resetTimeout = setTimeout(() => {
        safeResetBird();
        resetTimeout = null;
      }, 1000);
    }
  }

  if (birdLaunched && bird.isStopped()) {
    safeResetBird();
  }

  ground.show();

  for (let box of boxes) {
    box.show();
  }

  slingshot.show();
  bird.show();
}

function resetGame() {
  safeResetBird();

  // odstranění starých boxů
  for (let box of boxes) {
    World.remove(world, box.body);
  }
  boxes.length = 0;

  // dynamické generování boxů
  const numColumns = Math.floor(random(1, 3)); // 1-2 sloupce
  const numRows = Math.floor(random(2, 4));    // 2-3 patra

  for (let col = 0; col < numColumns; col++) {
    for (let row = 0; row < numRows; row++) {
      const w = random(50, 100);   // šířka
      const h = random(50, 120);   // výška
      const x = random(width / 2 + 50, width - 50) + col * 10; 
      const y = height - 20 - h / 2 - row * h;
      boxes.push(new Box(x, y, w, h));
    }
  }
}

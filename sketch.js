// Import potřebných částí z knihovny Matter.js
const { Engine, World, Bodies, Mouse, MouseConstraint, Constraint } = Matter;

// ====== GLOBÁLNÍ PROMĚNNÉ ======
let ground;                 // zem (podlaha)
const boxes = [];           // pole boxů (překážky)
let bird;                   // pták
let world, engine;          // fyzikální engine a svět
let mConstraint;            // constraint pro myš
let slingshot;              // prak

let birdLaunched = false;   // zda už byl pták vystřelen
let resetTimeout = null;    // timeout pro automatický reset ptáka
let isDraggingBird = false; // zda hráč právě táhne ptáka

// obrázky
let dotImg;
let boxImg;
let bkgImg;

// ====== NAČTENÍ OBRÁZKŮ ======
function preload() {
  dotImg = loadImage('images/greenBird.png');
  boxImg = loadImage('images/Box.png');
  bkgImg = loadImage('images/background0.png');
}

// ====== ZÁKLADNÍ NASTAVENÍ HRY ======
function setup() {
  const canvas = createCanvas(1000, 600);
  canvas.parent("game-container");

  // vytvoření fyzikálního enginu
  engine = Engine.create();
  world = engine.world;

  // vytvoření země
  ground = new Ground(width / 2, height - 10, width, 20);

  // vytvoření základních boxů
  for (let i = 0; i < 3; i++) {
    boxes[i] = new Box(750, 500 - i * 75, 84, 100);
  }

  // vytvoření ptáka a praku
  bird = new Bird(150, 300, 30);
  slingshot = new SlingShot(250, 400, bird.body);

  // ====== OVLÁDÁNÍ MYŠÍ ======
  // MouseConstraint slouží k tomu, aby šel pták chytit a natáhnout
  const mouse = Mouse.create(canvas.elt);
  const options = { 
    mouse: mouse,
    constraint: {
      stiffness: 0.02,
      angularStiffness: 0.02
    }
  };
  mConstraint = MouseConstraint.create(engine, options);
  World.add(world, mConstraint);

  // Povolení chytání pouze ptáka a jen před vystřelením
  Matter.Events.on(mConstraint, "startdrag", function(event) {

    // Po vystřelení nelze chytit nic
    if (birdLaunched) {
      mConstraint.constraint.bodyB = null;
      return;
    }

    // Před vystřelením lze chytit jen ptáka
    if (event.body !== bird.body) {
      mConstraint.constraint.bodyB = null;
    }
  });
}

// ====== OVLÁDÁNÍ KLÁVESNICÍ ======
function keyPressed() {

  // mezerník = reset ptáka
  if (key === ' ') {
    safeResetBird();
  }

  // R = kompletní reset hry
  if (key === 'r' || key === 'R') {
    resetGame();
  }
}

// ====== STISK MYŠI ======
function mousePressed() {

  // po vystřelení ptáka už nejde chytit
  if (birdLaunched) return;

  // kontrola, zda kliknutí bylo přímo na ptáka
  const d = dist(mouseX, mouseY, bird.body.position.x, bird.body.position.y);
  if (d < 30) {
    isDraggingBird = true;
  }
}

// ====== UVOLNĚNÍ MYŠI ======
function mouseReleased() {

  // pokud byl pták tažen, vystřelí se
  if (isDraggingBird && !birdLaunched) {
    mConstraint.constraint.bodyB = null;

    setTimeout(() => {
      slingshot.fly();
      birdLaunched = true;
    }, 50);
  }

  isDraggingBird = false;
}

// ====== BEZPEČNÝ RESET PTÁKA ======
function safeResetBird() {

  // odpojení ptáka od praku
  slingshot.fly();

  // nastavení ptáka zpět na prak
  Matter.Body.setPosition(bird.body, { 
    x: slingshot.sling.pointA.x, 
    y: slingshot.sling.pointA.y 
  });

  // vynulování fyziky ptáka
  Matter.Body.setVelocity(bird.body, { x: 0, y: 0 });
  Matter.Body.setAngularVelocity(bird.body, 0);
  Matter.Body.setAngle(bird.body, 0);

  // znovu připojení ptáka k praku
  slingshot.attach(bird.body);

  birdLaunched = false;
  isDraggingBird = false;
}

// ====== HLAVNÍ SMYČKA HRY ======
function draw() {
  imageMode(CORNER);
  image(bkgImg, 0, 0, width, height);

  // aktualizace fyziky
  Matter.Engine.update(engine);

  // odstranění boxů, které spadly mimo obrazovku
  for (let i = boxes.length - 1; i >= 0; i--) {
    if (boxes[i].body.position.y > height + 50) {
      World.remove(world, boxes[i].body);
      boxes.splice(i, 1);
    }
  }

  // pokud jsou všechny boxy pryč, hra se resetuje
  if (boxes.length === 0) {
    resetGame();
  }

  // automatický reset ptáka po pádu mimo canvas
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

  // reset ptáka, pokud se úplně zastaví
  if (birdLaunched && bird.isStopped()) {
    safeResetBird();
  }

  // vykreslení objektů
  ground.show();

  for (let box of boxes) {
    box.show();
  }

  slingshot.show();
  bird.show();
}

// ====== RESET CELÉ HRY ======
function resetGame() {

  safeResetBird();

  // odstranění starých boxů
  for (let box of boxes) {
    World.remove(world, box.body);
  }
  boxes.length = 0;

  // náhodné generování nové stavby z boxů
  const numColumns = Math.floor(random(1, 3));
  const numRows = Math.floor(random(2, 4));

  for (let col = 0; col < numColumns; col++) {
    for (let row = 0; row < numRows; row++) {
      const w = random(50, 100);
      const h = random(50, 120);
      const x = random(width / 2 + 50, width - 50) + col * 10;
      const y = height - 20 - h / 2 - row * h;

      boxes.push(new Box(x, y, w, h));
    }
  }
}

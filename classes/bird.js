// ====== TŘÍDA BIRD (PTÁK) ======
class Bird {

  // konstruktor – vytvoří fyzikální tělo ptáka
  constructor(x, y, r) {

    // fyzikální vlastnosti ptáka
    const options = {
      restitution: 0.5 // odrazivost (jak moc se odráží)
    };

    // vytvoření kruhového těla pomocí Matter.js
    this.body = Matter.Bodies.circle(x, y, r, options);

    // zvýšení hmotnosti ptáka (aby měl větší sílu při nárazu)
    Matter.Body.setMass(this.body, this.body.mass * 4);

    // přidání ptáka do fyzikálního světa
    Matter.World.add(world, this.body);

    // uložení poloměru (pro vykreslení)
    this.r = r;
  }

  // ====== KONTROLA, ZDA SE PTÁK ZASTAVIL ======
  // používá se pro automatický reset po vystřelení
  isStopped() {
    return this.body.speed < 0.3;
  }

  // ====== RESET PTÁKA ======
  // vrátí ptáka na danou pozici a vynuluje fyziku
  reset(x, y, attachedPoint = null) {

    // nastavení pozice ptáka
    Matter.Body.setPosition(this.body, { x: x, y: y });

    // vynulování rychlosti (aby se nehýbal)
    Matter.Body.setVelocity(this.body, { x: 0, y: 0 });

    // vynulování rotace
    Matter.Body.setAngularVelocity(this.body, 0);
    Matter.Body.setAngle(this.body, 0);

    // pokud je zadán bod praku, pták se objeví přímo tam
    if (attachedPoint) {
      Matter.Body.setPosition(this.body, {
        x: attachedPoint.x,
        y: attachedPoint.y
      });
    }
  }

  // ====== VYKRESLENÍ PTÁKA ======
  show() {
    const pos = this.body.position;
    const angle = this.body.angle;

    push();
    translate(pos.x, pos.y); // přesun na pozici ptáka
    rotate(angle);           // otočení podle fyziky
    imageMode(CENTER);

    // vykreslení obrázku ptáka
    image(dotImg, 0, 0, this.r * 2, this.r * 2);
    pop();
  }
}

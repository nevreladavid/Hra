class SlingShot {
  constructor(x, y, body) {
    const options = {
      pointA: { x: x, y: y },
      bodyB: body,
      stiffness: 0.02,
      length: 5
    };
    this.sling = Constraint.create(options);
    World.add(world, this.sling);

    this.maxLength = 150; // maximální délka lana
  }

  fly() {
    this.sling.bodyB = null;
  }

  attach(body) {
    this.sling.bodyB = body;
  }

  show() {
  if (this.sling.bodyB && isDraggingBird) {
    const posA = this.sling.pointA;
    const posB = this.sling.bodyB.position;
    const dx = posB.x - posA.x;
    const dy = posB.y - posA.y;
    let distance = dist(posA.x, posA.y, posB.x, posB.y);

    const maxLength = 150;

    // pokud je nataženo víc než maxLength, omez jen tah, nefixuj pozici
    if (distance > maxLength) {
      const angle = atan2(dy, dx);
      const excess = distance - maxLength;

      // lehce posuneme ptáka směrem k pointA
      Matter.Body.setPosition(this.sling.bodyB, {
        x: posA.x + cos(angle) * maxLength,
        y: posA.y + sin(angle) * maxLength
      });

      // zachováme malou rychlost pro plynulý pohyb
      Matter.Body.setVelocity(this.sling.bodyB, { x: 0, y: 0 });
    }

    // vykreslení lanka
    stroke(48, 22, 8);
    strokeWeight(4);
    line(posA.x, posA.y, this.sling.bodyB.position.x, this.sling.bodyB.position.y);
  }
}

}

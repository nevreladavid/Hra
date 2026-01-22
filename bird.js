class Bird {
  constructor(x, y, r) {
    const options = {
      restitution: 0.5
    };
    this.body = Matter.Bodies.circle(x, y, r, options);
    Matter.Body.setMass(this.body, this.body.mass * 4);
    Matter.World.add(world, this.body);
    this.r = r;
  }

 isStopped() {
  return this.body.speed < 0.3;
}

reset(x, y, attachedPoint = null) {
  Matter.Body.setPosition(this.body, { x: x, y: y });
  Matter.Body.setVelocity(this.body, { x: 0, y: 0 });
  Matter.Body.setAngularVelocity(this.body, 0);
  Matter.Body.setAngle(this.body, 0);

  // pokud chceme, může se pták hned objevit v bodě praku
  if (attachedPoint) {
    Matter.Body.setPosition(this.body, { x: attachedPoint.x, y: attachedPoint.y });
  }
}


  show() {
    const pos = this.body.position;
    const angle = this.body.angle;
    push();
    translate(pos.x, pos.y);
    rotate(angle);
    imageMode(CENTER);
    image(dotImg, 0, 0, this.r * 2, this.r * 2);
    pop();
  }
}
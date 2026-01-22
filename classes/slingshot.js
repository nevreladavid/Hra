// ====== TŘÍDA SLINGSHOT (PRAK) ======
class SlingShot {

  // konstruktor – vytvoří prak a lano
  constructor(x, y, body) {

    // nastavení constraintu (lana) v Matter.js
    const options = {
      pointA: { x: x, y: y }, // pevný bod praku
      bodyB: body,            // tělo ptáka připojené k lanu
      stiffness: 0.02,        // tuhost lana (čím menší, tím víc pruží)
      length: 5               // základní délka lana
    };

    // vytvoření lana (constraintu)
    this.sling = Constraint.create(options);
    World.add(world, this.sling);

    // maximální délka natažení lana
    this.maxLength = 150;
  }

  // ====== VYSTŘELENÍ PTÁKA ======
  // odpojí ptáka od praku
  fly() {
    this.sling.bodyB = null;
  }

  // ====== ZNOVUPŘIPOJENÍ PTÁKA ======
  attach(body) {
    this.sling.bodyB = body;
  }

  // ====== VYKRESLENÍ A OMEZENÍ LANA ======
  show() {

    // lano se kreslí jen pokud:
    // - je připojen pták
    // - hráč ho právě táhne myší
    if (this.sling.bodyB && isDraggingBird) {

      const posA = this.sling.pointA;               // bod praku
      const posB = this.sling.bodyB.position;       // pozice ptáka

      const dx = posB.x - posA.x;
      const dy = posB.y - posA.y;

      // vzdálenost ptáka od praku
      let distance = dist(posA.x, posA.y, posB.x, posB.y);

      // ====== OMEZENÍ DÉLKY LANA ======
      // pokud je lano natažené víc než povoleno
      if (distance > this.maxLength) {

        // výpočet směru natažení
        const angle = atan2(dy, dx);

        // přesunutí ptáka na maximální možnou vzdálenost
        Matter.Body.setPosition(this.sling.bodyB, {
          x: posA.x + cos(angle) * this.maxLength,
          y: posA.y + sin(angle) * this.maxLength
        });

        // zastavení rychlosti, aby pták "necukal"
        Matter.Body.setVelocity(this.sling.bodyB, { x: 0, y: 0 });
      }

      // ====== VYKRESLENÍ LANA ======
      stroke(48, 22, 8);     // barva lana
      strokeWeight(4);      // tloušťka
      line(
        posA.x,
        posA.y,
        this.sling.bodyB.position.x,
        this.sling.bodyB.position.y
      );
    }
  }
}

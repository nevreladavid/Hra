class Bird {
    constructor(x, y, r) {
        this.x = x;
        this.y = y;
        this.radius = r
    }


    show() {
        fill (0);
        rect(this.x, this.y, this.r);
    }
}
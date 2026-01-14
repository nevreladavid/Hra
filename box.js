class Box {
    constructor(x, y, w, h,) {
        this.x = x;
        this.y = y;
        this.width = w;
        this.height = h;
    }


    show() {
        fill (255);
        rect(this.x, this.y, this.w, this.h);
    }
}
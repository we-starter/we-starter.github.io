export class modalLoader {
    constructor(selectorId) {
        if (!selectorId || !document.getElementById(selectorId)) {
            throw "Can not find Canvas selector with ID: " + selectorId;
        }

        this.hsl = 0;
        this.angle = 0.01;
        this.W = 220;
        this.H = 220;
        this.element = document.getElementById(selectorId);
        this.canvas = document.createElement("canvas");
        this.element.appendChild(this.canvas);
        this.ctx = this.canvas.getContext("2d");

        this.init();
    }

    init() {
        let _this = this;

        this.canvas.width = this.W;
        this.canvas.height = this.W;
        setInterval(function () {
            _this.paint();
        }, 5);
    }

    paint() {
        this.angle += 0.03;
        this.hsl <= 360 ? (this.hsl += 0.25) : (this.hsl = 0);
        let s = -Math.sin(this.angle);
        let c = Math.cos(this.angle);

        this.ctx.save();
        this.ctx.globalAlpha = 0.25;
        this.ctx.beginPath();

        this.ctx.fillStyle = "hsla(" + this.hsl + ", 100%, 50%, 1)";
        this.ctx.arc(this.W / 2 + s * 75, this.H / 2 + c * 75, 14, 0, 2 * Math.PI);

        this.ctx.fill();
        this.ctx.restore();
    }
}

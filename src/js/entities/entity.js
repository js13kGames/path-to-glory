class Entity {
    constructor() {
        this.x = this.y = this.rotation = this.age = 0;   
        this.categories = [];

        this.rng = new RNG();

        this.renderPadding = Infinity;

        this.affectedBySpeedRatio = true;
    }

    get z() { 
        return this.y; 
    }

    get inWater() {
        for (const water of this.scene.category('water')) {
            if (water.contains(this)) return true;
        }
        return false;
    }

    cycle(elapsed) {
        this.age += elapsed;
    }

    render() {
        if (DEBUG) {
            // ctx.fillStyle = '#f00';
            // ctx.fillRect(this.x - 1, this.y - 5, 2, 10);
            // ctx.fillRect(this.x - 5, this.y - 1, 10, 2);
        }

        const camera = firstItem(this.scene.category('camera'));
        if (
            !isBetween(camera.x - CANVAS_WIDTH / 2 - this.renderPadding, this.x, camera.x + CANVAS_WIDTH / 2 + this.renderPadding) ||
            !isBetween(camera.y - CANVAS_HEIGHT / 2 - this.renderPadding, this.y, camera.y + CANVAS_HEIGHT / 2 + this.renderPadding)
        ) {
            return;
        }

        this.rng.reset();
        this.doRender(camera);
    }

    doRender(camera) {

    }

    remove() {
        this.scene.remove(this);
    }

    cancelCameraOffset(camera) {
        ctx.translate(camera.x, camera.y);
        ctx.scale(1 / camera.zoom, 1 / camera.zoom);
        ctx.translate(evaluate(-CANVAS_WIDTH / 2), evaluate(-CANVAS_HEIGHT / 2));
    }
}

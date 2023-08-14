class Player extends Character {
    constructor() {
        super();
        this.categories.push('player');
    }

    render() {
        super.render();

        const { inWater } = this;
        const renderAge = this.age * (inWater ? 0.5 : 1);

        ctx.translate(this.x, this.y);

        ctx.withShadow((color) => {
            if (inWater) {
                ctx.beginPath();
                ctx.rect(-100, -100, 200, 100);
                ctx.clip();

                ctx.translate(0, 10);
            }

            ctx.fillStyle = '#fff';

            // Left leg
            ctx.wrap(() => {
                ctx.translate(0, -32);

                ctx.fillStyle = color('#666');
                ctx.translate(-6, 15);
                if (this.controls.force) ctx.rotate(-sin(renderAge * TWO_PI * 4) * PI / 16);
                ctx.fillRect(-4, 0, 8, 20);
            });

            // Right leg
            ctx.wrap(() => {
                ctx.translate(0, -32);

                ctx.fillStyle = color('#666');
                ctx.translate(6, 15);
                if (this.controls.force) ctx.rotate(sin(renderAge * TWO_PI * 4) * PI / 16);
                ctx.fillRect(-4, 0, 8, 20);
            });
            
            // Chest
            ctx.wrap(() => {
                ctx.scale(this.facing, 1);
                ctx.translate(0, -32);

                ctx.fillStyle = color('#ccc');
                if (this.controls.force) ctx.rotate(-sin(renderAge * TWO_PI * 4) * PI / 64);
                ctx.fillRect(-12, -15, 25, 30);
            });

            // Sword arm
            ctx.wrap(() => {
                ctx.scale(this.facing, 1);
                ctx.translate(0, -32);
                
                ctx.fillStyle = color('#666');
                ctx.translate(12, -10);
                if (this.controls.force) ctx.rotate(-sin(renderAge * TWO_PI * 4) * PI / 32);
                if (this.controls.shield) ctx.rotate(-PI / 2);

                if (this.age < this.attackEnd) {
                    if (this.age < this.attackStrike) {
                        const progress = (this.age - this.attackStart) / (this.attackStrike - this.attackStart);
                        ctx.rotate(progress * PI / 2);
                    } else {
                        const progress = (this.age - this.attackStrike) / (this.attackEnd - this.attackStrike);
                        ctx.rotate((1 - progress) * PI / 2);
                    }
                }

                ctx.fillRect(0, -3, 20, 6);

                // Sword
                ctx.wrap(() => {
                    ctx.translate(18, -6);

                    ctx.fillStyle = color('#444');
                    ctx.fillRect(-10, -2, 20, 4);
                    ctx.fillRect(-3, 0, 6, 12);

                    ctx.fillStyle = color('#fff');
                    ctx.beginPath();
                    ctx.moveTo(-3, 0);
                    ctx.lineTo(-5, -35);
                    ctx.lineTo(0, -40);
                    ctx.lineTo(5, -35);
                    ctx.lineTo(3, 0);
                    ctx.fill();
                });
            });

            // Head
            ctx.wrap(() => {
                ctx.scale(this.facing, 1);
                ctx.translate(0, -32);

                ctx.fillStyle = color('#fec');
                ctx.translate(0, -22);
                if (this.controls.force) ctx.rotate(-sin(renderAge * TWO_PI * 4) * PI / 32);
                ctx.fillRect(-6, -7, 12, 15);
            });

            // Shield arm
            ctx.wrap(() => {
                ctx.scale(this.facing, 1);
                ctx.translate(0, -32);

                ctx.fillStyle = color('#666');
                ctx.translate(-10, -8);
                if (this.controls.force) ctx.rotate(-sin(renderAge * TWO_PI * 4) * PI / 32);
                if (!this.controls.shield) ctx.rotate(Math.PI / 3);

                const armLength = this.controls.shield ? 25 : 10;
                ctx.fillRect(0, -3, armLength, 6);

                // Shield
                ctx.wrap(() => {
                    ctx.translate(armLength, 0);

                    if (!this.controls.shield) ctx.rotate(-Math.PI / 4);

                    ctx.fillStyle = color('#fff');

                    for (const [scale, col] of [[0.8, color('#fff')], [0.6, color('#888')]]) {
                        ctx.fillStyle = col;
                        ctx.scale(scale, scale);
                        ctx.beginPath();
                        ctx.moveTo(0, -15);
                        ctx.lineTo(15, -10);
                        ctx.lineTo(12, 10);
                        ctx.lineTo(0, 25);
                        ctx.lineTo(-12, 10);
                        ctx.lineTo(-15, -10);
                        ctx.fill();
                    }
                });
            });
        });
    }

    cycle(elapsed) {
        let x = 0, y = 0;
        if (DOWN[37]) x = -1;
        if (DOWN[38]) y = -1;
        if (DOWN[39]) x = 1;
        if (DOWN[40]) y = 1;

        this.controls.angle = atan2(y, x);
        this.controls.force = x || y ? 1 : 0;
        this.controls.shield = DOWN[16];
        this.controls.attack = DOWN[32];

        super.cycle(elapsed);
    }
}

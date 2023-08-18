class Player extends Character {
    constructor() {
        super();
        this.categories.push('player');

        this.targetTeam = 'enemy';

        this.controller = new PlayerController();
        this.controller.setEntity(this);

        this.magnetRadiusX = 250;
        this.magnetRadiusY = 250;

        this.gibs = [
            () => ctx.renderSword(),
            () => ctx.renderShield(),
            () => {
                ctx.slice(30, true, 0.5);
                ctx.translate(0, 30);
                ctx.renderLegs(this);
                ctx.renderArmoredChest(this);
            },
            () => {
                ctx.slice(30, false, 0.5);
                ctx.translate(0, 30);
                ctx.renderLegs(this);
                ctx.renderArmoredChest(this);
            },
        ];

        this.stateMachine = characterStateMachine({
            entity: this, 
            chargeTime: PLAYER_HEAVY_CHARGE_TIME,
            perfectParryTime: PLAYER_PERFECT_PARRY_TIME,
        });
    }

    getColor(color) {
        return this.age - this.lastDamage < 0.1 ? '#f00' : super.getColor(color);
    }

    render() {
        ctx.wrap(() => {
            ctx.translate(this.x, this.y);

            const aimAngle = angleBetween(this, this.controls.aim);
            ctx.fillStyle = 'rgba(0,0,0,.03)';
            ctx.beginPath();
            ctx.ellipse(0, 0, this.strikeRadiusX * 4, this.strikeRadiusY * 4, 0, aimAngle - PI / 4, aimAngle + PI / 4);
            ctx.lineTo(0, 0);
            ctx.fill();
        });

        if (DEBUG) {
            // ctx.wrap(() => {
            //     ctx.fillStyle = '#0f0';
            //     for (let x = this.x - this.magnetRadiusX - 20 ; x < this.x + this.magnetRadiusX + 20 ; x += 4) {
            //         for (let y = this.y - this.magnetRadiusY - 20 ; y < this.y + this.magnetRadiusY + 20 ; y += 4) {
            //             ctx.globalAlpha = this.strikability({ x, y }, this.magnetRadiusX, this.magnetRadiusY, PI / 2);
            //             ctx.fillRect(x - 2, y - 2, 4, 4);
            //         }
            //     }
            // });
            // ctx.wrap(() => {
            //     for (const victim of this.scene.category(this.targetTeam)) {
            //         const strikability = this.strikability(victim, this.magnetRadiusX, this.magnetRadiusY, PI / 2);
            //         if (!strikability) continue;
            //         ctx.lineWidth = strikability * 30;
            //         ctx.strokeStyle = '#ff0';
            //         ctx.beginPath();
            //         ctx.moveTo(this.x, this.y);
            //         ctx.lineTo(victim.x, victim.y);
            //         ctx.stroke();
            //     }
            // });
        }

        super.render();
    }

    renderBody() {
        ctx.renderLegs(this);
        ctx.renderArmAndSword(this);
        ctx.renderArmoredChest(this);
        ctx.renderArmAndShield(this);
        ctx.renderExhaustion(this, -70);
    }
}

class PlayerController extends CharacterController {
    cycle() {
        let x = 0, y = 0;
        if (DOWN[37] || DOWN[65]) x = -1;
        if (DOWN[38] || DOWN[87]) y = -1;
        if (DOWN[39] || DOWN[68]) x = 1;
        if (DOWN[40] || DOWN[83]) y = 1;

        const camera = firstItem(this.entity.scene.category('camera'));

        if (x || y) this.entity.controls.angle = atan2(y, x);
        this.entity.controls.force = x || y ? 1 : 0;
        this.entity.controls.shield = DOWN[16];
        this.entity.controls.attack = MOUSE_DOWN;
        this.entity.controls.aim.x = MOUSE_POSITION.x + camera.x - CANVAS_WIDTH / 2;
        this.entity.controls.aim.y = MOUSE_POSITION.y + camera.y - CANVAS_HEIGHT / 2;
        this.entity.controls.dash = DOWN[32];

        if (x) this.entity.facing = x;
    }
}

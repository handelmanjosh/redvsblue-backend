import { MAX_H, MAX_RANGE, MAX_W } from "./game";
import Plane from "./player";
import { distance, explode, nameTow2h } from "./utils";


export default class Bullet {
    dead: boolean;
    x: number;
    y: number;
    vx: number;
    vy: number;
    angle: number;
    img: string;
    width: number;
    height: number;
    plane: Plane;
    damage: number;
    canDamage: boolean;
    constructor(x: number, y: number, angle: number, width: number, height: number, vMax: number, img: string, plane: Plane, damage: number) {
        this.x = x;
        this.y = y;
        this.angle = angle;
        this.width = width;
        this.height = height;
        this.img = img;
        this.vx = Math.cos(angle) * vMax;
        this.vy = Math.sin(angle) * vMax;
        this.dead = false;
        this.plane = plane;
        this.damage = damage;
        this.canDamage = true;
    }
    update() {
        if (!this.canDamage) return;
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < 0 || this.y < 0 || this.x > MAX_W || this.y > MAX_H) this.die();
        if (distance(this, this.plane) > MAX_RANGE) this.die();
    }
    die() {
        this.dead = true;
    }
    serialize() {
        return {
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height,
            angle: this.angle,
            img: this.img,
        };
    }
}
export class BasicBullet extends Bullet {
    constructor(x: number, y: number, angle: number, plane: Plane, vMax?: number) {
        super(x, y, angle, 5, 5, Math.max(20, vMax ? vMax + 5 : 0), "", plane, 2);
    }
}
export class Missile extends Bullet {
    constructor(x: number, y: number, angle: number, plane: Plane) {
        super(x, y, angle, 15, nameTow2h.get("/missile-1.png")! * 15, 15, "/missile-1.png", plane, 20);
    }
    die() {
        this.width = this.height;
        this.canDamage = false;
        explode(this).then(() => {
            this.dead = true;
        });
    }
}
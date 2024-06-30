import Bullet from "./bullet";
import { MAX_H, MAX_W } from "./game";
import { explode } from "./utils";

export default abstract class Plane {
    x: number;
    y: number;
    angle: number;
    vx: number;
    vy: number;
    vMax: number;
    bullets: Bullet[];
    img: string;
    width: number;
    height: number;
    wallet: string;
    dead: boolean;
    health: number;
    maxHealth: number;
    canShoot: boolean;
    canMove: boolean;
    team: string;
    constructor(x: number, y: number, vMax: number, width: number, height: number, img: string, wallet: string, health: number, team: string) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.angle = 0;
        this.vx = 0;
        this.vy = 0;
        this.vMax = vMax;
        this.bullets = [];
        this.img = img;
        this.dead = false;
        this.wallet = wallet;
        this.health = health;
        this.maxHealth = health;
        this.canShoot = true;
        this.canMove = true;
        this.team = team;
    }
    takeDamage(bullet: Bullet) {
        this.health -= bullet.damage;
        if (this.health <= 0) {
            // console.log("plane died", Date.now());
            this.die();
        }
    }
    die() {
        this.width = this.height;
        if (!this.canShoot) return;
        this.canShoot = false;
        this.canMove = false;
        explode(this).then(() => {
            // if (!this.wallet.startsWith("ai-")) {
            //     console.log("exploded");
            // }
            this.dead = true;
        });
    }
    updateVelocityAndAngle(xPos: number, yPos: number) {
        if (!this.canMove) return;
        this.angle = Math.atan2(yPos, xPos);
        const vMax = Math.min(Math.sqrt(xPos ** 2 + yPos ** 2) / 100 * this.vMax, this.vMax);
        this.vx = Math.cos(this.angle) * vMax;
        this.vy = Math.sin(this.angle) * vMax;
    }
    update() {
        if (!this.canMove) return;
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < 0) this.x = 0;
        if (this.y < 0) this.y = 0;
        if (this.y > MAX_H) this.y = MAX_H;
        if (this.x > MAX_W) this.x = MAX_W;
    }
    serialize() {
        return {
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height,
            angle: this.angle,
            img: this.img,
            wallet: this.wallet,
            health: this.health,
            maxHealth: this.maxHealth,
            team: this.team,
        };
    }
    abstract action(a: string): void;
}


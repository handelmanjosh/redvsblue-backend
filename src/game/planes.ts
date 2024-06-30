import { BasicBullet, Missile } from "./bullet";
import Plane from "./player";
import { nameTow2h } from "./utils";


export class F4Eagle extends Plane {
    canShootMissile: boolean;
    right: boolean;
    constructor(x: number, y: number, wallet: string, team: string) {
        super(x, y, 10, 40, 40 * nameTow2h.get("/f4-eagle.png")!, "/f4-eagle.png", wallet, 30, team);
        this.canShootMissile = true;
        this.right = true;
    }
    action(a: string) {
        if (!this.canShoot) return;
        switch (a) {
            case " ":
            case "1": {
                this.bullets.push(
                    new BasicBullet(this.x, this.y, this.angle, this)
                );
                break;
            }
            case "2": {
                if (this.canShootMissile) {
                    let xDelta: number, yDelta: number;
                    const totalTranslate = 10;
                    if (this.right) {
                        xDelta = Math.sin(this.angle) * totalTranslate;
                        yDelta = Math.cos(this.angle) * totalTranslate;
                    } else {
                        xDelta = Math.sin(this.angle) * totalTranslate;
                        yDelta = - Math.cos(this.angle) * totalTranslate;
                    }
                    this.bullets.push(
                        new Missile(this.x + xDelta, this.y + yDelta, this.angle, this)
                    );
                    this.right = !this.right;
                    this.canShootMissile = false;
                    setTimeout(() => {
                        this.canShootMissile = true;
                    }, 1000);
                }
            }
        }
    }
}
export class F14Tomcat extends Plane {
    canShootMissile: boolean;
    canSpeedBoost: boolean;
    constructor(x: number, y: number, wallet: string, team: string) {
        super(x, y, 20, 40, 40 * nameTow2h.get("/f14-tomcat.png")!, "/f14-tomcat.png", wallet, 40, team);
        this.canShootMissile = true;
        this.canSpeedBoost = true;
    }
    action(a: string): void {
        switch (a) {
            case " ":
            case "1": {
                this.bullets.push(
                    new BasicBullet(this.x, this.y, this.angle, this, this.vMax)
                );
                break;
            }
            case "2": {
                if (this.canShootMissile) {
                    this.bullets.push(
                        new Missile(this.x, this.y, this.angle, this)
                    );
                    this.canShootMissile = false;
                    setTimeout(() => {
                        this.canShootMissile = true;
                    }, 1000);
                }
                break;
            }
            case "3": {
                if (!this.canSpeedBoost) return;
                this.vMax *= 1.25;
                this.canSpeedBoost = false;
                setTimeout(() => {
                    this.vMax /= 1.25;
                }, 5000);
                setTimeout(() => {
                    this.canSpeedBoost = true;
                }, 10000);
                break;
                // speed boost
            }
        }
    }
}
export class F106DeltaDart extends Plane {
    canShootMissile: boolean;
    canTeleport: boolean;
    constructor(x: number, y: number, wallet: string, team: string) {
        super(x, y, 30, 40, 40 * nameTow2h.get("/f106-deltadart.png")!, "/f106-deltadart.png", wallet, 20, team);
        this.canShootMissile = true;
        this.canTeleport = true;
    }
    action(a: string): void {
        switch (a) {
            case " ":
            case "1": {
                this.bullets.push(
                    new BasicBullet(this.x, this.y, this.angle, this, this.vMax)
                );
                break;
                // normal bullet
            }
            case "2": {
                if (this.canShootMissile) {
                    this.bullets.push(
                        new Missile(this.x, this.y, this.angle, this)
                    );
                    this.canShootMissile = false;
                    setTimeout(() => {
                        this.canShootMissile = true;
                    }, 1000);
                }
                break;
                // homing missile
            }
            case "3": {
                if (!this.canTeleport) return;
                this.x += this.vx * 3;
                this.y += this.vy * 3;
                this.canTeleport = false;
                setTimeout(() => {
                    this.canTeleport = true;
                }, 5000);
                break;
                // teleport
            }
        }
    }
}

export class F117Nighthawk extends Plane {
    canShootMissile: boolean;
    constructor(x: number, y: number, wallet: string, team: string) {
        super(x, y, 30, 40, 40 * nameTow2h.get("/f117-nighthawk.png")!, "/f117-nighthawk.png", wallet, 40, team);
        this.canShootMissile = true;
    }
    action(a: string): void {
        switch (a) {
            case " ":
            case "1": {
                this.bullets.push(
                    new BasicBullet(this.x, this.y, this.angle, this, this.vMax)
                );
                break;
                // normal bullet
            }
            case "2": {
                if (this.canShootMissile) {
                    this.bullets.push(
                        new Missile(this.x, this.y, this.angle, this)
                    );
                    this.canShootMissile = false;
                    setTimeout(() => {
                        this.canShootMissile = true;
                    }, 1000);
                }
                break;
                // homing missile
            }
            case "3": {

            }
            case "4": {
                // disappear
            }
        }
    }
}
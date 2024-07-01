import { TEAMS } from "../server";
import { addScore } from "../utils";
import AI from "./ai";
import Bullet from "./bullet";
import { F106DeltaDart, F117Nighthawk, F14Tomcat, F4Eagle } from "./planes";
import Plane from "./player";
import { CheckCenteredSquareCollision, flatten, randomAIWallet, randomid } from "./utils";

export const MAX_W = 10000;
export const MAX_H = 10000;
export const MAX_RANGE = 3000;
type Message = {
    involves: string[];
    killed: string;
    killedBy: string;
};
export default class Game {
    players: Map<string, Plane>;
    id: string;
    messages: Map<string, Message>;
    ai: AI[];
    score: [number, number];
    constructor() {
        this.players = new Map<string, Plane>();
        this.messages = new Map<string, Message>();
        this.id = randomid();
        this.ai = [];
        this.score = [0, 0];
    }
    async updateScoreOnChain() {
        try {
            if (this.score[0] > 0) {
                await addScore(0, this.score[0]);
            }
            this.score[0] = 0;
            if (this.score[1] > 0) {
                await addScore(1, this.score[1]);
            }
            this.score[1] = 0;
        } catch (e) {

        }
    }
    frame() {
        this.ai = this.ai.filter((ai: AI) => {
            ai.update();
            return !ai.plane.dead;
        });
        let planes: [string, Plane][] = Array.from(this.players);
        for (const [_, plane] of planes) {
            plane.update();
            plane.bullets = plane.bullets.filter((bullet: Bullet) => {
                bullet.update();
                return !bullet.dead;
            });
        }
        planes = planes.filter(([_, plane]: [string, Plane]) => {
            plane.bullets = plane.bullets.filter((bullet: Bullet) => {
                for (const [_, p] of planes) {
                    if (p.wallet != plane.wallet && p.team != plane.team && bullet.canDamage && CheckCenteredSquareCollision(p, bullet)) {
                        if (p.canMove && p.health - bullet.damage <= 0) {
                            const id2 = randomid();
                            this.messages.set(id2, {
                                involves: [p.wallet, plane.wallet],
                                killed: p.wallet,
                                killedBy: plane.wallet
                            });
                            if (plane.team === "red") {
                                this.score[0]++;
                            } else {
                                this.score[1]++;
                            }
                            setTimeout(() => {
                                this.messages.delete(id2);
                            }, 1000);
                        }
                        p.takeDamage(bullet);
                        bullet.canDamage = false;
                        bullet.die();
                    }
                }
                return !bullet.dead;
            });
            return !plane.dead;
        });
        this.players = new Map(planes);
        while (this.ai.length < 6) {
            this.addAI("/f4-eagle.png");
        }
    }
    addPlayer(wallet: string, type: number, team: string) {
        const x = Math.random() * MAX_W;
        const y = Math.random() * MAX_H;
        let player: Plane;
        switch (type) {
            case 0: {
                player = new F4Eagle(x, y, wallet, team);
                break;
            }
            case 1: {
                player = new F14Tomcat(x, y, wallet, team);
                break;
            }
            case 2: {
                player = new F106DeltaDart(x, y, wallet, team);
                break;
            }
            case 3: {
                player = new F117Nighthawk(x, y, wallet, team);
                break;
            }
            default: {
                throw new Error("uh oh");
            }
        }
        this.players.set(wallet, player);
        return player;
    }
    addAI(type: string) {
        switch (type) {
            case "/f4-eagle.png": {
                const x = Math.random() * MAX_W;
                const y = Math.random() * MAX_H;
                const redAmount = Array.from(this.players).filter(([_, p]) => p.team === "red" && p.wallet.startsWith("AI")).length
                const team = redAmount < 3 ? "red" : "blue";
                const plane = new F4Eagle(x, y, `AI-${team}-${Math.floor(Math.random() * 1000)}`, team);
                this.players.set(plane.wallet, plane);
                const ai = new AI(plane, this);
                this.ai.push(ai);
            }
        }
    }
    serialize() {
        return {
            players: Array.from(this.players).map(p => p[1].serialize()),
            bullets: flatten(Array.from(this.players).map(p => p[1].bullets.map(b => b.serialize()))),
            messages: Array.from(this.messages),
        };
    }
}
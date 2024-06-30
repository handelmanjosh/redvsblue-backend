import Game from "./game";
import Plane from "./player";
import { distance, randomBetween } from "./utils";


export default class AI {
    plane: Plane;
    game: Game;
    target: { x: number, y: number; } | undefined;
    constructor(plane: Plane, game: Game) {
        this.plane = plane;
        this.game = game;
        this.target = undefined;
    }
    update() {
        if (this.target) {
            this.plane.updateVelocityAndAngle(this.target.x - this.plane.x, this.target.y - this.plane.y);
            if (Math.random() * 5 > 4) {
                switch (this.plane.img) {
                    case "/f4-eagle.png": {
                        if (Math.random() < 0.5) {
                            this.plane.action(" ");
                        } else {
                            this.plane.action("2");
                        }
                        break;
                    }
                }
            }
            if (Math.random() * 10000 > 9990 || distance(this.plane, this.target) < 100) {
                this.target = undefined;
            }
        } else {
            const players = Array.from(this.game.players).filter(([_, p]) => p.team !== this.plane.team);
            if (players.length > 0) {
                const player = players[Math.floor(Math.random() * players.length)][1];
                this.target = { x: player.x + randomBetween(-100, 100), y: player.y + randomBetween(-100, 100) };
            } else {
                this.target = { x: randomBetween(0, 10000), y: randomBetween(0, 10000) };
            }
        }
    }

}
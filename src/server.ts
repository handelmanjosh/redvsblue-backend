
import http from 'http';
import express from 'express';
import cors from 'cors';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import Game from './game/game';
import { generateFakePricesEndingAt } from './game/utils';

dotenv.config();

const app = express();
app.use(cors());
const server = http.createServer();
export const TEAMS = ["red", "blue"];
const io = new Server(server, {
    // change this
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});
const PORT = process.env.PORT || 3005;
let games: Game[] = [];
const findGame = () => games.find((game) => Array.from(game.players).length < 5);
const addGame = () => {
    const g = new Game();
    for (let i = 0; i < 1; i++) {
        g.addAI("/f4-eagle.png");
    }
    games.push(g);
    return g;
};
let interval: any = undefined;
let interval2: any = undefined;
let data1: number[] = [];
let data2: number[] = [];
async function main() {
    io.on("connection", async (socket) => {
        // console.log("User connected");
        const wallet = socket.handshake.query.wallet as string;
        console.log(wallet);
        if (!wallet) {
            socket.on("fakeData", ({one, two}) => {
                if (data1.length === 0) data1 = generateFakePricesEndingAt(one, 200);
                if (data2.length === 0) data2 = generateFakePricesEndingAt(two, 200);
                socket.emit("fakeData", {data1, data2});
            })
            return;
        }
        console.log("Connected");
        const game = findGame() ?? addGame();
        let team = socket.handshake.query.team as string;
        if (!TEAMS.includes(team)) {
            team = "red"
        }
        const type = Number(socket.handshake.query.type as string);
        console.log({ wallet, type });
        const player = game.addPlayer(wallet, type, team);
        socket.join(game.id);
        socket.on("data", (payload) => {
            const { down, loc } = payload;
            player.updateVelocityAndAngle(loc[0], loc[1]);
            for (const item of down) {
                player.action(item);
            }
        });
        socket.on("disconnect", () => {
            console.log(`socket ${socket.id} has disconnected`);
        });
    });
    interval = setInterval(() => {
        for (const game of games) {
            game.frame();
            const data = game.serialize();
            io.to(game.id).emit("data", data);
        }
    }, 1000 / 60);
    interval2 = setInterval(() => {
        for (const game of games) {
            game.updateScoreOnChain();
        }
    }, 2 * 60 * 1000) // every 2 minutes
}

main();
server.listen(PORT, () => {
    console.log(`Server listening on port: ${PORT}`);
});







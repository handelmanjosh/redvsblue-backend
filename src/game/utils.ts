
type Locateable = {
    x: number;
    y: number;
};
type Collideable = Locateable & {
    width: number;
    height: number;
    angle: number;
};
export const nameTow2h: Map<string, number> = new Map<string, number>(
    [
        ["/f4-eagle.png", 491 / 321],
        ["/f14-tomcat.png", 490 / 305],
        ["/f15-eagle.png", 490 / 333],
        ["/f16-viper.png", 510 / 313],
        ["/f18-hornet.png", 456 / 327],
        ["/f22-raptor.png", 462 / 333],
        ["/f35-stealth.png", 463 / 317],
        ["/f86-sabre.png", 377 / 370],
        ["/f89-scorpion.png", 332 / 347],
        ["/f106-deltadart.png", 501 / 262],
        ["/f111-aardvark.png", 489 / 210],
        ["/f117-nighthawk.png", 491 / 321],
        ["/missile-1.png", 169 / 44],
        ["/missile-2.png", 162 / 66],
        ["/missile-3.png", 175 / 52],
        ["/missile-4.png", 186 / 47],
        ["/missile-5.png", 192 / 52],
        ["/missile-6.png", 191 / 52],
        ["/missile-7.png", 201 / 76]
    ],
);

export function randomid(): string {
    const letters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
    let result = "";
    for (let i = 0; i < 40; i++) {
        result += letters[Math.floor(Math.random() * letters.length)];
    }
    return result;
}
export function flatten(arr: any[][]) {
    const result: any[] = [];
    for (const inner of arr) {
        result.push(...inner);
    }
    return result;
}

export function distance(a: Locateable, b: Locateable) {
    return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
}

export function CheckCenteredSquareCollision(a: Collideable, b: Collideable) {
    const getVertices = (box: Collideable): { x: number, y: number; }[] => {
        let hw = box.width / 2;
        let hh = box.height / 2;
        let vertices = [
            { x: -hw, y: -hh },
            { x: hw, y: -hh },
            { x: hw, y: hh },
            { x: -hw, y: hh }
        ];

        // Rotate vertices
        const cos = Math.cos(box.angle);
        const sin = Math.sin(box.angle);
        return vertices.map(v => ({
            x: box.x + v.x * cos - v.y * sin,
            y: box.y + v.x * sin + v.y * cos
        }));
    };

    const overlap = (projA: number[], projB: number[]): boolean => {
        return Math.max(projA[0], projB[0]) <= Math.min(projA[1], projB[1]);
    };

    const projectOntoAxis = (vertices: { x: number, y: number; }[], axis: { x: number, y: number; }): number[] => {
        let min = axis.x * vertices[0].x + axis.y * vertices[0].y;
        let max = min;
        for (let vertex of vertices) {
            let projection = axis.x * vertex.x + axis.y * vertex.y;
            if (projection < min) min = projection;
            if (projection > max) max = projection;
        }
        return [min, max];
    };

    const verticesA = getVertices(a);
    const verticesB = getVertices(b);
    const axes = [
        { x: Math.cos(a.angle), y: Math.sin(a.angle) },
        { x: -Math.sin(a.angle), y: Math.cos(a.angle) },
        { x: Math.cos(b.angle), y: Math.sin(b.angle) },
        { x: -Math.sin(b.angle), y: Math.cos(b.angle) }
    ];

    for (let axis of axes) {
        let projA = projectOntoAxis(verticesA, axis);
        let projB = projectOntoAxis(verticesB, axis);
        if (!overlap(projA, projB)) {
            return false; // No collision
        }
    }
    return true;
}
export async function explode(explodeable: any): Promise<void> {
    return new Promise<void>((resolve) => {
        let count = -1;
        const f = () => {
            count++;
            explodeable.img = `/explosions/explosion${count}.png`;
            if (count < 5) {
                setTimeout(f, 200);
            } else {
                resolve();
            }
        };
        f();
    });
}
export function randomBetween(a: number, b: number) {
    return a + (b - a) * Math.random();
}
export function randomAIWallet() {
    const letters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
    let result = "";
    for (let i = 0; i < 58; i++) {
        result += letters[Math.floor(Math.random() * letters.length)];
    }
    return result;
}


export function generateFakePricesEndingAt(price: number, amount: number) {
        let currentPrice = price * (0.5 + Math.random());
        const prices = [currentPrice];
        for (let i = 1; i < amount; i++) {
           const direction = price > currentPrice ? 1 : -1;
           const stepSize = (price - currentPrice) / (amount - i) + direction * Math.random() * price * 0.05;
           currentPrice += stepSize;
           currentPrice = Math.max(0.01, currentPrice);
           prices.push(currentPrice);
        }
       prices[amount - 1] = price;
       return prices;
}
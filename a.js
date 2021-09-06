let i, seed = 13312;
let assetsList = ["rocket.svg", "seagull.svg", "plane.svg", "cloud.svg"];
let assets = [];
assetsList.forEach(assetName => {
    let asset = new Image();
    asset.src = assetName;
    assets.push(asset);
});

let size = 500;

let objects = [
    { speed: 2, num: 20, minSize: 35, maxSize: 50, color: "38acff", spacing: 80 },
    { speed: 3, num: 15, minSize: 70, maxSize: 100, color: "389bf8", spacing: 150 },
    { speed: 2, num: 8, minSize: 120, maxSize: 180, color: "3877F1", spacing: 60 }
];

window.onload = () => {
    let quartPi = Math.PI / 2;

    let ctx = document.querySelector("#a").getContext('2d');

    let moveTo = ctx.moveTo.bind(ctx);
    let lineTo = ctx.lineTo.bind(ctx);
    let arcTo = ctx.arcTo.bind(ctx);

    let changeFill = col => {
        ctx.fillStyle = '#' + col;
    };

    let fillRect = (x, y, width, height, col) => {
        changeFill(col);
        ctx.fillRect(x, y, width, height);
    };

    let roundRect = (x, y, width, height, col, borderCol) => {
        let radius = 8;
        ctx.lineWidth = 8;
        ctx.beginPath();
        moveTo(x + radius, y);
        lineTo(x + width - radius, y);
        arcTo(x + width, y, x + width, y + radius, radius);
        lineTo(x + width, y + height - radius);
        arcTo(x + width, y + height, x + width - radius, y + height, radius);
        lineTo(x + radius, y + height);
        arcTo(x, y + height, x, y + height - radius, radius);
        lineTo(x, y + radius);
        arcTo(x, y, x + width, y, radius);
        changeFill(col);
        ctx.strokeStyle = '#' + borderCol;
        ctx.stroke();
        ctx.fill();
    };

    // Mulberry32 pseudorandom seedable number generator
    let rand = (min, max) => {
        seed |= 0; seed = seed + 0x6D2B79F5 | 0;
        let t = Math.imul(seed ^ seed >>> 15, 1 | a);
        t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
        return min + (((t ^ t >>> 14) >>> 0) / 4294967296) * (max - min);
    };

    // Generate entities
    let entities = [];
    let cy = 180;
    for (let i = 0; i < objects.length; i++) {
        for (let j = 0; j < objects[i].num; j++) {
            let size = rand(objects[i].minSize, objects[i].maxSize);
            cy -= (objects[i].spacing + size);
            entities.push({ object: i, x: rand(0, 500), y: cy, direction: Math.round(rand(1, 10)) > 5 ? 1 : -1, size: size });
        }
    }

    let rgbToHex = (r, g, b) => {
        return ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    };

    console.table(entities);

    let showControlsUI = true;
    let launched = false;
    let turnLeft = 0;
    let turnRight = 0;
    let rockety = 460;
    let rocketx = 250;
    let rocketWidth = 65;
    let speed = 5;
    let dist = 0;
    let rot = 0;

    let draw = () => {
        // Set seed - 13k, obviously ;)
        seed = 13312;

        // Move rocket
        if (launched) {
            if (rockety > 250) {
                rockety -= Math.ceil(speed * ((500 - rockety) / 250));
            } else {
                rot += turnRight - turnLeft;
                rocketx += speed * Math.cos(rot - (quartPi));
                dist -= speed * Math.sin(rot - (quartPi));
                rockety = 250 - dist;
                ctx.setTransform(1, 0, 0, 1, 0, dist);
            }
        } else {
            ctx.setTransform(1, 0, 0, 1, 0, 0);
        }

        fillRect(0, 0, size, size, '38B7FF');

        // Draw buildings
        for (i = 0; i < 500; i += 30) {
            fillRect(i, size - 30 - rand(30, 99), rand(30, 99), 99 + 30, '33A6FF');
        }

        // Draw grass layers
        fillRect(0, size - 18, size, 18, '007C1B');
        fillRect(0, size - 18 - 8, size, 8, '008A1E');
        fillRect(0, size - 18 - 8 - 12, size, 12, '00AC2E');

        // Draw grass strands
        for (i = 0; i < 500; i += 10) {
            ctx.beginPath();
            moveTo(i, size - 18 - 8 - 12);
            lineTo(i + 10, size - 18 - 8 - 12);
            lineTo(i + rand(0, 10), rand(size - 18 - 8 - 12 - 30, size - 18 - 8 - 12 - 8));
            ctx.fill();
        }

        roundRect(196, size - 15, 108, 100, '737373', 'B5B5B5');

        let currColor = "";
        // Draw & move entities
        entities.forEach(entity => {
            if (objects[entity.object].color != currColor) {
                currColor = objects[entity.object].color;
                // Draw next sky layer
                ctx.beginPath();
                moveTo(0, entity.y);
                ctx.quadraticCurveTo(size / 2, entity.y + 170, size, entity.y);
                lineTo(size, -50000);
                lineTo(0, -50000);
                changeFill(currColor);
                ctx.fill();
            }
            if (entity.x > 500 + entity.size / 2 || entity.x < 0 - entity.size / 2) {
                entity.direction *= -1;
            }
            entity.x += entity.direction * objects[entity.object].speed;
            ctx.save();
            if (entity.direction > 0) {
                ctx.scale(-1, 1);
            }
            ctx.drawImage(assets[entity.object + 1], (entity.direction > 0 ? -1 : 1) * (entity.x), entity.y - entity.size / 2, entity.size, entity.size);
            ctx.restore();
        });

        // Draw rocket
        ctx.save();
        ctx.translate(rocketx, rockety);
        ctx.rotate(rot);
        ctx.translate(-rocketx, -rockety);
        ctx.drawImage(assets[0], rocketx - (rocketWidth / 2), rockety - (105 / 2), rocketWidth, 105);
        ctx.restore();

        let colors = ["000000", "f5dc1d", "ffe940", "7191f0", "6084f0", "ebf9ff", "d7effa", "607d8b", "eceff1", "cdd0d2", "546d79", "bbdefb"];
        let checkPixel = (x, y) => {
            let pixel = ctx.getImageData(x, y, 1, 1).data;
            // fillRect(x - 5, rockety + y - 5 - 250, 10, 10, "0f0");
            if (colors.includes(rgbToHex(pixel[0], pixel[1], pixel[2]))) {
                console.log('crashed!', rgbToHex(pixel[0], pixel[1], pixel[2]));
                launched = false;
                turnLeft = 0;
                turnRight = 0;
                rockety = 460;
                rocketx = 250;
                speed = 5;
                dist = 0;
                rot = 0;
            } else {
                console.log('safe', rgbToHex(pixel[0], pixel[1], pixel[2]));
            }
        };
        checkPixel(rocketx + ((115 / 2) * Math.cos(rot - (quartPi))), 250 + ((115 / 2) * Math.sin(rot - (quartPi))));
        checkPixel(rocketx - ((rocketWidth / 2.5) * Math.sin(rot - (quartPi))), 250 + ((rocketWidth / 2.5) * Math.cos(rot - (quartPi))));
        checkPixel(rocketx + ((rocketWidth / 2.5) * Math.sin(rot - (quartPi))), 250 - ((rocketWidth / 2.5) * Math.cos(rot - (quartPi))));

        if (showControlsUI) {
            ctx.globalAlpha = 0.6;
            fillRect(0, 0, size, size, '000');
            ctx.globalAlpha = 1;
        }

        requestAnimationFrame(draw);
    };

    draw();

    window.onkeydown = (e) => {
        console.log(e);
        if (!showControlsUI) {
            if (e.code == "Space") {
                launched = true;
            }
            else if (e.code == "ArrowLeft") {
                turnLeft = 0.1;
            }
            else if (e.code == "ArrowRight") {
                turnRight = 0.1;
            }
        }
        showControlsUI = false;
    };

    window.onkeyup = (e) => {
        if (e.code == "ArrowLeft") {
            turnLeft = 0;
        }
        else if (e.code == "ArrowRight") {
            turnRight = 0;
        }
    }
};
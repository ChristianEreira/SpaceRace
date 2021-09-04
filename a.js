let i, seed = 13312;
let assetsList = ["rocket.svg", "seagull.svg", "rocket.svg"];
let assets = [];
assetsList.forEach(assetName => {
    let asset = new Image();
    asset.src = assetName;
    assets.push(asset);
});
let objects = [{ speed: 3, num: 40, minSize: 35, maxSize: 50, color: "38ACFF", spacing: 80 },
{ speed: 1, num: 5, minSize: 100, maxSize: 300, color: "000", spacing: 150 }];

window.onload = () => {
    let size = 500;
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

    console.table(entities);

    let showControlsUI = true;
    let launched = false;
    let turnLeft = 0;
    let turnRight = 0;
    let rockety = 460;
    let rocketx = 250;
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
                rocketx += speed * Math.cos(rot - (Math.PI / 2));
                dist -= speed * Math.sin(rot - (Math.PI / 2));
                rockety = 250 - dist;
                ctx.setTransform(1, 0, 0, 1, 0, dist);
            }
        } else {
            // ctx.setTransform(1, 0, 0, 1, 0, 0);
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
        ctx.drawImage(assets[0], rocketx - (65 / 2), rockety - (105 / 2), 65, 105);
        ctx.restore();

        if (showControlsUI) {
            ctx.globalAlpha = 0.6;
            fillRect(0, 0, size, size, '000');
            ctx.globalAlpha = 1;
        }

        requestAnimationFrame(draw);
    };

    draw();

    document.querySelector("#a").onmousemove = e => {
        console.log(ctx.isPointInPath('m345.24-64.475-58.999 35c-0.11009 0.18135-0.22711 0.35364-0.33746 0.53464l-117.66 70.465c-8 4-13.999 9.9987-18.999 16.999l-58.214 79.444-61.788-84.444c-4-7-9.9987-12-16.999-16l-164-97c3.375 7.125 6.9972 14.11 10.858 20.94 4e-3 0.0064 8e-3 0.01253 0.0114 0.01896l3.132 6.0403 0.58015 0.34506c16.117 27.053 36.063 51.559 59.42 72.655l24.999 22c21 19 37 44.001 44 72.001l10.206 35.721c-4.4074 0.19961-8.2396 0.59545-11.205 1.2797-25 4-45.001 21.999-47.001 46.999-0.0653 1.0129-0.0274 1.9999-0.0379 2.9993h-28.962c-15 0-27 12-27 27h62.929c9.0099 15.628 25.776 26 45.071 26h66.999v18c0 14 11.001 25.001 25.001 25.001h22.999v8.9998c0 4 3.0007 7.9988 8.0007 7.9988 4 0 6.9997-3.9988 6.9997-7.9988v-8.9998h13.999v8.9998c1e-5 4 4.0007 7.9988 8.0007 7.9988 4 0 6.9997-3.9988 6.9997-7.9988v-16.001c0-4-2.9997-7.9988-6.9997-7.9988h-31c-5 0-10.001-4.0009-10.001-10.001v-18h90c14 0 28-6.0006 38-17.001l6.9997-7.9988c8-8 19.001-13 30.001-13h44.999c0-13-8.999-23-20.999-26l-117-20 20-73.999c3-11 8.9997-21.001 18-28.001l49-44c34-31 61-66.999 80-109zm-268 339h13.999v18c0 3.574 0.72038 6.951 2.021 10.001h-6.0195c-6 0-10.001-4.0009-10.001-10.001z', e.offsetX, e.offsetY));
    };

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
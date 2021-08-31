let i, seed;
let rocket = new Image();
rocket.src = "rocket.svg";
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

    let showControlsUI = true;
    let launched = false;
    let rockety = 460;
    let speed = 5;
    let dist = 0;

    let draw = () => {
        // Set seed - 13k, obviously ;)
        seed = 13312;

        // Move rocket
        if (launched) {
            if (rockety > 250) {
                rockety -= Math.ceil(speed * ((500 - rockety) / 250));
            } else {
                dist += speed;
                rockety = 250 - dist;
                ctx.setTransform(1, 0, 0, 1, 0, dist);
            }
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

        // Draw next sky layer
        ctx.beginPath();
        moveTo(0, 30);
        ctx.quadraticCurveTo(size / 2, 200, size, 30);
        lineTo(size, -500);
        lineTo(0, -500);
        changeFill('38ACFF');
        ctx.fill();

        // Draw rocket
        roundRect(196, size - 15, 108, 100, '737373', 'B5B5B5');
        ctx.drawImage(rocket, 217.5, rockety - (105 / 2), 65, 105);
        requestAnimationFrame(draw);

        if (showControlsUI) {
            ctx.globalAlpha = 0.6;
            fillRect(0, 0, size, size, '000');
            ctx.globalAlpha = 1;
        }
    };

    draw();

    window.onkeydown = (e) => {
        console.log(e);
        if (!showControlsUI) {
            if (e.code == "Space") {
                launched = true;
            }
        }
        showControlsUI = false;
    };
};
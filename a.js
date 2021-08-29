let ctx, i;
let size = 500;

let changeFill = col => {
    ctx.fillStyle = col;
};

let fillRect = (x, y, width, height, col) => {
    if (col) { changeFill('#' + col); }
    ctx.fillRect(x, y, width, height);
};

let rand = (min, max) => min + Math.random() * (max - min);

window.onload = () => {
    ctx = document.querySelector("#a").getContext('2d');

    fillRect(0, 0, size, size, '38B7FF');

    for (i = 0; i < 500; i += 30) {
        fillRect(i, size - 30 - rand(30, 99), rand(30, 99), 99 + 30, '33A6FF');
    }

    fillRect(0, size - 18, size, 18, '007C1B');
    fillRect(0, size - 18 - 8, size, 8, '008A1E');
    fillRect(0, size - 18 - 8 - 12, size, 12, '00AC2E');

    for (i = 0; i < 500; i += 10) {
        ctx.beginPath();
        ctx.moveTo(i, size - 18 - 8 - 12);
        ctx.lineTo(i + 10, size - 18 - 8 - 12);
        ctx.lineTo(i + rand(0, 10), rand(size - 18 - 8 - 12 - 30, size - 18 - 8 - 12 - 8));
        ctx.fill();
    }
};
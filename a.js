let ctx;

let changeFill = col => {
    ctx.fillStyle = col;
};

let fillRect = (x, y, width, height) => {
    ctx.fillRect(x, y, width, height);
};

let rand = (min, max) => min + Math.random() * (max - min);

window.onload = () => {
    ctx = document.querySelector("#a").getContext('2d');
    let size = 500;

    changeFill('#38B7FF');
    fillRect(0, 0, size, size);

    let i = 0;
    while (i < 500) {
        changeFill('#33A6FF');
        fillRect(i, size - 30 - rand(30, 99), rand(30, 99), 99 + 30);
        i += 30;
    }

    changeFill('#007C1B');
    fillRect(0, size - 18, size, 18);

    changeFill('#008A1E');
    fillRect(0, size - 18 - 8, size, 8);

    changeFill('#00AC2E');
    fillRect(0, size - 18 - 8 - 12, size, 12);

    for (let i = 0; i < 500; i+=10) {
        ctx.beginPath();
        ctx.moveTo(i, size - 18 - 8 - 12);
        ctx.lineTo(i + 10, size - 18 - 8 - 12);
        ctx.lineTo(i + rand(0, 10), rand(size - 18 - 8 - 12 - 30, size - 18 - 8 - 12 - 8));
        ctx.fill();
    }
};
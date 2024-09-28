const canvas = document.getElementById('drawingCanvas');
const ctx = canvas.getContext('2d');
let drawing = false;

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas(); // 初始调整画布大小

canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mouseup', stopDrawing);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('touchstart', startDrawing);
canvas.addEventListener('touchend', stopDrawing);
canvas.addEventListener('touchmove', draw);

function startDrawing(e) {
    drawing = true;
    ctx.beginPath();
    const { offsetX, offsetY } = getPosition(e);
    ctx.moveTo(offsetX, offsetY);
}

function stopDrawing() {
    drawing = false;
    ctx.closePath();
}

function draw(e) {
    if (!drawing) return;
    const { offsetX, offsetY } = getPosition(e);
    ctx.lineTo(offsetX, offsetY);
    ctx.stroke();
}

function getPosition(e) {
    const rect = canvas.getBoundingClientRect();
    const x = e.touches ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = e.touches ? e.touches[0].clientY - rect.top : e.clientY - rect.top;
    return { offsetX: x, offsetY: y };
}

// 保存图像的功能
document.getElementById('saveButton').addEventListener('click', () => {
    const link = document.createElement('a');
    link.download = 'drawing.png'; // 设置下载文件名
    link.href = canvas.toDataURL('image/png'); // 获取画布内容为图片
    link.click(); // 自动点击链接进行下载
});

// 清空画布的功能
document.getElementById('clearButton').addEventListener('click', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // 清空整个画布
});

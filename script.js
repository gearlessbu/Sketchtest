const canvas = document.getElementById('drawingCanvas');
const ctx = canvas.getContext('2d');
let drawing = false;

// 调整画布大小，确保适应屏幕尺寸和设备像素比
function resizeCanvas() {
    const dpr = window.devicePixelRatio || 1;
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    ctx.scale(dpr, dpr); // 缩放画布以适应设备像素比
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas(); // 初始调整画布大小

// 鼠标和触摸事件处理
canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mouseup', stopDrawing);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('touchstart', startDrawing);
canvas.addEventListener('touchend', stopDrawing);
canvas.addEventListener('touchmove', draw);

// 开始绘制
function startDrawing(e) {
    e.preventDefault(); // 防止触摸事件滚动屏幕
    drawing = true;
    ctx.beginPath();
    const { offsetX, offsetY } = getPosition(e);
    ctx.moveTo(offsetX, offsetY);
}

// 停止绘制
function stopDrawing() {
    drawing = false;
    ctx.closePath();
}

// 绘制图像
function draw(e) {
    if (!drawing) return;
    e.preventDefault(); // 防止触摸事件滚动屏幕
    const { offsetX, offsetY } = getPosition(e);
    ctx.lineTo(offsetX, offsetY);
    ctx.stroke();
}

// 获取鼠标或触摸的精确位置
function getPosition(e) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    let x, y;
    if (e.touches) {
        x = (e.touches[0].clientX - rect.left) * scaleX;
        y = (e.touches[0].clientY - rect.top) * scaleY;
    } else {
        x = (e.clientX - rect.left) * scaleX;
        y = (e.clientY - rect.top) * scaleY;
    }
    return { offsetX: x, offsetY: y };
}

// 保存图像功能
document.getElementById('saveButton').addEventListener('click', () => {
    const link = document.createElement('a');
    link.download = 'drawing.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
});

// 清空画布功能
document.getElementById('clearButton').addEventListener('click', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
});

// 让按钮也能响应触摸事件
document.getElementById('clearButton').addEventListener('touchstart', (e) => {
    e.preventDefault(); // 防止触摸事件触发其他行为
    ctx.clearRect(0, 0, canvas.width, canvas.height);
});

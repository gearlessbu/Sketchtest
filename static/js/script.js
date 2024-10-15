const canvas = document.getElementById('drawingCanvas');
const ctx = canvas.getContext('2d');
let drawing = false;

function resizeCanvas(width, height) {
    // 调整画布的宽高属性和 CSS 样式
    canvas.width = width;
    canvas.height = height;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.clearRect(0, 0, width, height);  // 清除画布
}

canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mouseup', stopDrawing);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('touchstart', startDrawing);
canvas.addEventListener('touchend', stopDrawing);
canvas.addEventListener('touchmove', draw);

function startDrawing(e) {
    e.preventDefault();
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
    e.preventDefault();
    const { offsetX, offsetY } = getPosition(e);
    ctx.lineTo(offsetX, offsetY);
    ctx.stroke();
}

// 考虑 canvas 缩放，获取相对位置
function getPosition(e) {
    const rect = canvas.getBoundingClientRect();
    let x, y;
    const scaleX = canvas.width / rect.width;  // 水平方向的缩放比例
    const scaleY = canvas.height / rect.height;  // 垂直方向的缩放比例

    if (e.touches) {
        x = (e.touches[0].clientX - rect.left) * scaleX;
        y = (e.touches[0].clientY - rect.top) * scaleY;
    } else {
        x = (e.clientX - rect.left) * scaleX;
        y = (e.clientY - rect.top) * scaleY;
    }
    return { offsetX: x, offsetY: y };
}

// 保存图像并通过 AJAX 发送到后端
document.getElementById('saveButton').addEventListener('click', () => {
    const imageData = canvas.toDataURL('image/png');
    fetch('/process_image', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image_data: imageData }),
    })
    .then(response => response.json())
    .then(data => {
        console.log(data.message);
    })
    .catch(error => {
        console.error('Error:', error);
    });
});

// 清空画布
document.getElementById('clearButton').addEventListener('click', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
});

// 调整画布大小
document.getElementById('resizeButton').addEventListener('click', () => {
    const width = parseInt(document.getElementById('canvasWidth').value);
    const height = parseInt(document.getElementById('canvasHeight').value);
    resizeCanvas(width, height);
});

let scene, camera, renderer;
let line, points = [];

function init() {
    // 创建场景
    scene = new THREE.Scene();

    // 创建相机
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    // 创建渲染器
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // 监听鼠标事件
    document.addEventListener('mousedown', onMouseDown);
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);

    // 清空按钮事件
    document.getElementById('clearButton').addEventListener('click', clearLines);

    animate();
}

function onMouseDown(event) {
    points.push(getMousePosition(event));
    drawLine();
}

function onMouseMove(event) {
    if (points.length > 0) {
        points[points.length - 1] = getMousePosition(event);
        drawLine();
    }
}

function onMouseUp() {
    // 当鼠标释放时，停止更新线条
}

function getMousePosition(event) {
    const rect = renderer.domElement.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    const vector = new THREE.Vector3(x, y, 0.5);
    vector.unproject(camera);
    vector.sub(camera.position).normalize();

    const distance = -camera.position.z / vector.z;
    return camera.position.clone().add(vector.multiplyScalar(distance));
}

function drawLine() {
    if (line) {
        scene.remove(line);
    }

    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({ color: 0xff0000 });
    line = new THREE.Line(geometry, material);
    scene.add(line);
}

function clearLines() {
    points = [];
    if (line) {
        scene.remove(line);
        line = null;
    }
}

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

// 窗口调整时更新渲染器
window.addEventListener('resize', function() {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});

init();

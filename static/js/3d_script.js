import * as THREE from '/static/js/libs/three.module.js';
import { TransformControls } from '/static/js/libs/controls/TransformControls.js';

window.onload = function() {
    // 模式切换
    document.getElementById('modeSwitch').addEventListener('click', function() {
        window.location.href = "/2d_mode"; // 切换到2D模式的网页
    });

    // Three.js 初始化
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // 画线部分
    let isDrawing = false;
    let currentLine;
    const lines = [];

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    // 添加 TransformControls 用于XYZ方向的移动
    const transformControl = new TransformControls(camera, renderer.domElement);
    scene.add(transformControl);

    function onMouseMove(event) {
        if (!isDrawing) return;
        const points = currentLine.geometry.vertices;
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(scene.children);
        if (intersects.length > 0) {
            points[points.length - 1].copy(intersects[0].point);
            currentLine.geometry.verticesNeedUpdate = true;
        }
    }

    function onMouseDown(event) {
        if (isDrawing) {
            isDrawing = false;
            currentLine.geometry.verticesNeedUpdate = true;
            lines.push(currentLine);

            // 启用 TransformControls 让用户可以拖动线条
            transformControl.attach(currentLine);
        } else {
            isDrawing = true;
            const geometry = new THREE.Geometry();
            const material = new THREE.LineBasicMaterial({ color: 0x0000ff });
            currentLine = new THREE.Line(geometry, material);
            scene.add(currentLine);

            geometry.vertices.push(new THREE.Vector3(), new THREE.Vector3());
        }
    }

    window.addEventListener('mousemove', onMouseMove, false);
    window.addEventListener('mousedown', onMouseDown, false);

    transformControl.addEventListener('change', function() {
        renderer.render(scene, camera);
    });

    transformControl.setMode("translate");
    camera.position.z = 5;

    function animate() {
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
    }
    animate();
};

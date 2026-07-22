// 1. Automatic Fields Initialization
document.getElementById('invoice').value = 'INV-' + Math.floor(Math.random() * 90000 + 10000);
document.getElementById('date').value = new Date().toISOString().slice(0, 10);

// 2. Core Functional Logic 
function addRow() {
    let tr = document.createElement('tr');
    tr.style.opacity = '0';
    tr.style.transform = 'translateY(10px)';
    tr.style.transition = 'all 0.4s ease';
    
    tr.innerHTML = `
        <td><input class="product-name" placeholder="Enter Product Name"></td>
        <td><input type="number" value="1" min="1" oninput="calc()"></td>
        <td><input type="number" value="0" min="0" oninput="calc()"></td>
        <td><input type="number" value="18" min="0" oninput="calc()"></td>
        <td class="t">0.00</td>
    `;
    document.querySelector('#tbl tbody').appendChild(tr);
    
    // Smooth Entry Animation for rows
    setTimeout(() => {
        tr.style.opacity = '1';
        tr.style.transform = 'translateY(0)';
    }, 10);
}

function calc() {
    let grandTotal = 0;
    document.querySelectorAll('#tbl tbody tr').forEach(row => {
        let inputs = row.querySelectorAll('input');
        let qty = +inputs[1].value || 0;
        let price = +inputs[2].value || 0;
        let gst = +inputs[3].value || 0;
        
        let rowTotal = qty * price * (1 + gst / 100);
        row.querySelector('.t').textContent = rowTotal.toFixed(2);
        grandTotal += rowTotal;
    });
    document.getElementById('grand').textContent = grandTotal.toFixed(2);
}

// 3. Three.js - 3D Background Matrix Creation
const container = document.getElementById('canvas-container');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

renderer.setSize(window.innerWidth, window.innerHeight);
container.appendChild(renderer.domElement);

// Populate 3D space with complex wireframe geometry elements
const geometry = new THREE.IcosahedronGeometry(0.7, 1);
const material = new THREE.MeshBasicMaterial({ color: 0x00f2fe, wireframe: true, transparent: true, opacity: 0.15 });
const instancedMesh = new THREE.Group();

for (let i = 0; i < 45; i++) {
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(
        (Math.random() - 0.5) * 30,
        (Math.random() - 0.5) * 30,
        (Math.random() - 0.5) * 30
    );
    mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
    mesh.userData = {
        speedX: (Math.random() - 0.5) * 0.01,
        speedY: (Math.random() - 0.5) * 0.01
    };
    instancedMesh.add(mesh);
}
scene.add(instancedMesh);
camera.position.z = 12;

// Interactive 3D Parallax Mouse Tracking
let mouseX = 0, mouseY = 0;
document.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX - window.innerWidth / 2) * 0.0003;
    mouseY = (e.clientY - window.innerHeight / 2) * 0.0003;
});

// Render Engine Animation Frame Loop
function animate() {
    requestAnimationFrame(animate);
    
    instancedMesh.children.forEach(mesh => {
        mesh.rotation.x += 0.002;
        mesh.rotation.y += 0.003;
        mesh.position.x += mesh.userData.speedX;
        mesh.position.y += mesh.userData.speedY;

        // Boundaries reset
        if (Math.abs(mesh.position.x) > 15) mesh.userData.speedX *= -1;
        if (Math.abs(mesh.position.y) > 15) mesh.userData.speedY *= -1;
    });

    // Camera organic breathing tracking response
    camera.position.x += (mouseX * 10 - camera.position.x) * 0.05;
    camera.position.y += (-mouseY * 10 - camera.position.y) * 0.05;
    camera.lookAt(scene.position);

    renderer.render(scene, camera);
}
animate();

// Handling Viewport Window Resizes dynamically
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Initial load check
calc();
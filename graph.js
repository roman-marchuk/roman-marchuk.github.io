class Graph {
    constructor() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer();
        this.nodes = [];
        this.edges = [];
    }

    init() {
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.getElementById('graph-container').appendChild(this.renderer.domElement);

        this.camera.position.z = 5;

        // Create nodes
        const mainNode = this.createNode(0, 0, 0, 0x00ff00, 'Chat');
        const aboutNode = this.createNode(-2, 1, 0, 0xff0000, 'About');
        const contactNode = this.createNode(2, 1, 0, 0x0000ff, 'Contact');
        const projectsNode = this.createNode(0, -2, 0, 0xffff00, 'Projects');

        // Create edges
        this.createEdge(mainNode, aboutNode);
        this.createEdge(mainNode, contactNode);
        this.createEdge(mainNode, projectsNode);

        // Add click event listener
        window.addEventListener('click', this.onMouseClick.bind(this), false);
    }

    createNode(x, y, z, color, name) {
        const geometry = new THREE.SphereGeometry(0.3, 32, 32);
        const material = new THREE.MeshBasicMaterial({ color: color });
        const sphere = new THREE.Mesh(geometry, material);
        sphere.position.set(x, y, z);
        sphere.name = name;
        this.scene.add(sphere);
        this.nodes.push(sphere);
        return sphere;
    }

    createEdge(node1, node2) {
        const material = new THREE.LineBasicMaterial({ color: 0xffffff });
        const geometry = new THREE.BufferGeometry().setFromPoints([node1.position, node2.position]);
        const line = new THREE.Line(geometry, material);
        this.scene.add(line);
        this.edges.push(line);
    }

    animate() {
        requestAnimationFrame(this.animate.bind(this));

        // Rotate the entire graph
        this.scene.rotation.x += 0.001;
        this.scene.rotation.y += 0.002;

        this.renderer.render(this.scene, this.camera);
    }

    onMouseClick(event) {
        const mouse = new THREE.Vector2();
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(mouse, this.camera);

        const intersects = raycaster.intersectObjects(this.nodes);

        if (intersects.length > 0) {
            const clickedNode = intersects[0].object;
            this.handleNodeClick(clickedNode);
        }
    }

    handleNodeClick(node) {
        if (node.name === 'Chat') {
            document.getElementById('chat-window').classList.remove('hidden');
        } else {
            const infoPanel = document.getElementById('info-panel');
            const infoTitle = document.getElementById('info-title');
            const infoContent = document.getElementById('info-content');

            infoTitle.textContent = node.name;
            infoContent.textContent = `This is the ${node.name.toLowerCase()} section. Add your content here.`;

            infoPanel.classList.remove('hidden');
        }
    }
}
class Graph {
    constructor() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.nodes = [];
        this.edges = [];
        this.controls = null;
    }

    init() {
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setClearColor(0x1a1a2e); // Set background color
        document.getElementById('graph-container').appendChild(this.renderer.domElement);

        this.camera.position.z = 5;

        // Add ambient light
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        this.scene.add(ambientLight);

        // Add point light
        const pointLight = new THREE.PointLight(0xffffff, 1);
        pointLight.position.set(5, 5, 5);
        this.scene.add(pointLight);

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
        this.renderer.domElement.addEventListener('click', this.onMouseClick.bind(this), false);

        // Add OrbitControls
        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.25;
        this.controls.screenSpacePanning = false;
        this.controls.maxDistance = 100;
        this.controls.minDistance = 1;
    }

    createNode(x, y, z, color, name) {
        const geometry = new THREE.SphereGeometry(0.3, 32, 32);
        const material = new THREE.MeshPhongMaterial({ color: color });
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
        this.controls.update();
        this.renderer.render(this.scene, this.camera);
    }

    onMouseClick(event) {
        event.preventDefault();
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
        const chatWindow = document.getElementById('chat-window');
        const infoPanel = document.getElementById('info-panel');

        if (node.name === 'Chat') {
            chatWindow.classList.toggle('hidden');
            infoPanel.classList.add('hidden');
        } else {
            chatWindow.classList.add('hidden');
            const infoTitle = document.getElementById('info-title');
            const infoContent = document.getElementById('info-content');

            infoTitle.textContent = node.name;
            infoContent.textContent = `This is the ${node.name.toLowerCase()} section. Add your content here.`;

            infoPanel.classList.remove('hidden');
        }
    }
}
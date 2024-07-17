let graph;

function init() {
    graph = new Graph();
    graph.init();
    graph.animate();

    window.addEventListener('resize', onWindowResize, false);
}

function onWindowResize() {
    graph.camera.aspect = window.innerWidth / window.innerHeight;
    graph.camera.updateProjectionMatrix();
    graph.renderer.setSize(window.innerWidth, window.innerHeight);
}

init();
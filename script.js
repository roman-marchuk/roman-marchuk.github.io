// Mock data for the graph
const graphData = {
    nodes: [
      { id: 'center', name: 'AI Chat', color: '#ff9900' },
      { id: 'projects', name: 'Projects', color: '#00ff00' },
      { id: 'contact', name: 'Contact', color: '#0000ff' },
      { id: 'about', name: 'About Me', color: '#ff00ff' },
      { id: 'skills', name: 'Skills', color: '#00ffff' },
    ],
    links: [
      { source: 'center', target: 'projects' },
      { source: 'center', target: 'contact' },
      { source: 'center', target: 'about' },
      { source: 'center', target: 'skills' },
    ]
  };
  
  // NodeContent component remains the same
  
  const PersonalWebsite = () => {
    const [selectedNode, setSelectedNode] = React.useState(null);
    const fgRef = React.useRef();
  
    const handleNodeClick = React.useCallback(node => {
      if (!node || !fgRef.current) return;
  
      setSelectedNode(node);
      
      try {
        const distance = 40;
        const distRatio = 1 + distance/Math.hypot(node.x, node.y, node.z);
  
        const newPosition = node.x !== undefined && node.y !== undefined && node.z !== undefined
          ? { x: node.x * distRatio, y: node.y * distRatio, z: node.z * distRatio }
          : null;
  
        if (newPosition) {
          fgRef.current.cameraPosition(
            newPosition,
            node,
            3000
          );
        }
      } catch (error) {
        console.error("Error positioning camera:", error);
      }
    }, [fgRef]);
  
    return (
      <div className="h-screen w-full relative">
        <ForceGraph3D
          ref={fgRef}
          graphData={graphData}
          nodeLabel="name"
          nodeColor={node => node.color}
          onNodeClick={handleNodeClick}
          nodeThreeObject={(node) => {
            const group = new THREE.Group();
  
            const sphere = new THREE.Mesh(
              new THREE.SphereGeometry(3),
              new THREE.MeshPhongMaterial({ color: node.color })
            );
            group.add(sphere);
  
            const label = new SpriteText(node.name);
            label.color = '#ffffff';
            label.textHeight = 2;
            label.position.y = 4;
            group.add(label);
  
            return group;
          }}
          linkWidth={2}
          linkColor={() => '#ffffff'}
          linkOpacity={0.8}
          linkCurvature={0.25}
          linkMaterial={(link) => new THREE.MeshBasicMaterial({
            color: '#ffffff',
            transparent: true,
            opacity: 0.8,
            depthWrite: false
          })}
          linkDirectionalParticles={5}
          linkDirectionalParticleWidth={1}
          linkDirectionalParticleColor={() => '#ffff00'}
          backgroundColor="#000011"
        />
        {selectedNode && (
          <div className="absolute top-4 left-4 z-10">
            <div className="bg-white bg-opacity-80 p-4 rounded-lg shadow-lg">
              <h3 className="text-lg font-bold mb-2">Selected Node: {selectedNode.name}</h3>
              <NodeContent node={selectedNode} />
            </div>
          </div>
        )}
      </div>
    );
  };
  
  ReactDOM.render(
    <React.StrictMode>
      <PersonalWebsite />
    </React.StrictMode>,
    document.getElementById('root')
  );
// Main graph data
const mainGraphData = {
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
  
  // Subgraph data for each main node
  const subGraphs = {
    center: {
      nodes: [
        { id: 'chat1', name: 'General Chat', color: '#ffcc00' },
        { id: 'chat2', name: 'Technical Support', color: '#ffaa00' },
        { id: 'chat3', name: 'Feedback', color: '#ff8800' },
      ],
      links: [
        { source: 'chat1', target: 'chat2' },
        { source: 'chat2', target: 'chat3' },
        { source: 'chat3', target: 'chat1' },
      ]
    },
    projects: {
      nodes: [
        { id: 'project1', name: 'Web Development', color: '#66ff66' },
        { id: 'project2', name: 'Mobile Apps', color: '#33ff33' },
        { id: 'project3', name: 'Data Science', color: '#00ff00' },
      ],
      links: [
        { source: 'project1', target: 'project2' },
        { source: 'project2', target: 'project3' },
        { source: 'project3', target: 'project1' },
      ]
    },
    // Add similar subgraphs for 'contact', 'about', and 'skills'
  };
  
  const PersonalWebsite = () => {
    const [graphData, setGraphData] = React.useState(mainGraphData);
    const [selectedNode, setSelectedNode] = React.useState(null);
    const [zoomLevel, setZoomLevel] = React.useState(0);
    const fgRef = React.useRef();
  
    const handleNodeClick = React.useCallback(node => {
      if (!node || !fgRef.current) return;
  
      setSelectedNode(node);
      
      if (zoomLevel === 0 && subGraphs[node.id]) {
        // Zoom into subgraph
        setZoomLevel(1);
        setGraphData(subGraphs[node.id]);
  
        const distance = 40;
        const distRatio = 1 + distance/Math.hypot(node.x, node.y, node.z);
  
        fgRef.current.cameraPosition(
          { x: node.x * distRatio, y: node.y * distRatio, z: node.z * distRatio },
          node,
          2000
        );
      }
    }, [zoomLevel]);
  
    const handleEscape = React.useCallback((event) => {
      if (event.key === 'Escape' && zoomLevel === 1) {
        // Zoom out to main graph
        setZoomLevel(0);
        setGraphData(mainGraphData);
        setSelectedNode(null);
  
        // Reset camera position
        fgRef.current.cameraPosition(
          { x: 0, y: 0, z: 200 },
          { x: 0, y: 0, z: 0 },
          2000
        );
      }
    }, [zoomLevel]);
  
    React.useEffect(() => {
      window.addEventListener('keydown', handleEscape);
      return () => {
        window.removeEventListener('keydown', handleEscape);
      };
    }, [handleEscape]);
  
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
              <p>{zoomLevel === 0 ? "Click to zoom in" : "Press Escape to zoom out"}</p>
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
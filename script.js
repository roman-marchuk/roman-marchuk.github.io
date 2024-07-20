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

// Subgraph data for 'projects' and 'about'
const subGraphs = {
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
  about: {
    nodes: [
      { id: 'bio', name: 'Biography', color: '#ff99ff' },
      { id: 'education', name: 'Education', color: '#ff66ff' },
      { id: 'hobbies', name: 'Hobbies', color: '#ff33ff' },
    ],
    links: [
      { source: 'bio', target: 'education' },
      { source: 'education', target: 'hobbies' },
      { source: 'hobbies', target: 'bio' },
    ]
  },
};

// Chat Interface Component
const ChatInterface = () => (
  <div className="bg-white bg-opacity-80 p-4 rounded-lg shadow-lg w-96">
    <h3 className="text-lg font-bold mb-2">AI Chat</h3>
    <div className="h-64 bg-gray-100 mb-2 p-2 overflow-y-auto rounded">
      {/* Chat messages would go here */}
    </div>
    <input type="text" placeholder="Type your message..." className="w-full p-2 mb-2 border rounded" />
    <button className="w-full bg-blue-500 text-white p-2 rounded">Send</button>
  </div>
);

// Contact Form Component
const ContactForm = () => (
  <div className="bg-white bg-opacity-80 p-4 rounded-lg shadow-lg w-96">
    <h3 className="text-lg font-bold mb-2">Contact Me</h3>
    <input type="text" placeholder="Name" className="w-full p-2 mb-2 border rounded" />
    <input type="email" placeholder="Email" className="w-full p-2 mb-2 border rounded" />
    <textarea placeholder="Message" className="w-full p-2 mb-2 border rounded h-32"></textarea>
    <button className="w-full bg-blue-500 text-white p-2 rounded">Send</button>
  </div>
);

const PersonalWebsite = () => {
  const [graphData, setGraphData] = React.useState(mainGraphData);
  const [selectedNode, setSelectedNode] = React.useState(null);
  const [zoomLevel, setZoomLevel] = React.useState(0);
  const fgRef = React.useRef();

  const handleNodeClick = React.useCallback(node => {
    if (!node || !fgRef.current) return;

    setSelectedNode(node);
    
    if (zoomLevel === 0) {
      setZoomLevel(1);
      if (subGraphs[node.id]) {
        setGraphData(subGraphs[node.id]);
      }

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
    if (event.key === 'Escape' && (zoomLevel === 1 || selectedNode)) {
      setZoomLevel(0);
      setGraphData(mainGraphData);
      setSelectedNode(null);

      fgRef.current.cameraPosition(
        { x: 0, y: 0, z: 200 },
        { x: 0, y: 0, z: 0 },
        2000
      );
    }
  }, [zoomLevel, selectedNode]);

  React.useEffect(() => {
    window.addEventListener('keydown', handleEscape);
    return () => {
      window.removeEventListener('keydown', handleEscape);
    };
  }, [handleEscape]);

  return (
    <div className="h-screen w-full relative font-sans">
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
        linkWidth={1}
        linkColor={() => '#ffffff'}
        linkOpacity={0.6}
        linkCurvature={0.25}
        backgroundColor="#000011"
      />
      {selectedNode && (
        <div className="absolute inset-0 flex items-center justify-center z-10">
          {selectedNode.id === 'center' && <ChatInterface />}
          {selectedNode.id === 'contact' && <ContactForm />}
          {/* {(selectedNode.id === 'projects' || selectedNode.id === 'about') && (
            <div className="bg-white bg-opacity-80 p-4 rounded-lg shadow-lg">
              <h3 className="text-lg font-bold mb-2">Exploring: {selectedNode.name}</h3>
              <p>Press Escape to return to main view.</p>
            </div>
          )} */}
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
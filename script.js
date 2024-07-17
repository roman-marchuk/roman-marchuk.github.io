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
  
  const NodeContent = ({ node }) => {
    switch (node.id) {
      case 'center':
        return (
          <div className="p-4 bg-gray-100 rounded-lg">
            <h2 className="text-xl font-bold mb-2">AI Chat</h2>
            <div className="mb-2">
              <input
                type="text"
                placeholder="Ask me anything..."
                className="w-full p-2 border rounded"
              />
            </div>
            <button className="bg-blue-500 text-white px-4 py-2 rounded">Send</button>
          </div>
        );
      case 'projects':
        return (
          <div className="p-4 bg-green-100 rounded-lg">
            <h2 className="text-xl font-bold mb-2">Projects</h2>
            <ul className="list-disc pl-5">
              <li>Project 1</li>
              <li>Project 2</li>
              <li>Project 3</li>
            </ul>
          </div>
        );
      case 'contact':
        return (
          <div className="p-4 bg-blue-100 rounded-lg">
            <h2 className="text-xl font-bold mb-2">Contact</h2>
            <p>Email: example@example.com</p>
            <p>Phone: (123) 456-7890</p>
          </div>
        );
      case 'about':
        return (
          <div className="p-4 bg-purple-100 rounded-lg">
            <h2 className="text-xl font-bold mb-2">About Me</h2>
            <p>I'm a passionate developer with a love for creating innovative solutions.</p>
          </div>
        );
      case 'skills':
        return (
          <div className="p-4 bg-cyan-100 rounded-lg">
            <h2 className="text-xl font-bold mb-2">Skills</h2>
            <ul className="list-disc pl-5">
              <li>JavaScript</li>
              <li>React</li>
              <li>Node.js</li>
              <li>Python</li>
            </ul>
          </div>
        );
      default:
        return null;
    }
  };
  
  const PersonalWebsite = () => {
    const [selectedNode, setSelectedNode] = React.useState(null);
    const fgRef = React.useRef();
  
    const handleNodeClick = React.useCallback(node => {
      setSelectedNode(node);
      
      // Aim at node from outside it
      const distance = 40;
      const distRatio = 1 + distance/Math.hypot(node.x, node.y, node.z);
  
      fgRef.current.cameraPosition(
        { x: node.x * distRatio, y: node.y * distRatio, z: node.z * distRatio }, // new position
        node, // lookAt ({ x, y, z })
        3000  // ms transition duration
      );
    }, [fgRef]);
  
    return (
      <div className="h-screen w-full relative">
        <ForceGraph3D
          ref={fgRef}
          graphData={graphData}
          nodeLabel="name"
          nodeColor={node => node.color}
          onNodeClick={handleNodeClick}
          nodeThreeObject={node => {
            const sprite = new SpriteText(node.name);
            sprite.color = node.color;
            sprite.textHeight = 8;
            return sprite;
          }}
        />
        {selectedNode && (
          <div className="absolute top-4 left-4 z-10">
            <div className="bg-white p-4 rounded-lg shadow-lg">
              <h3 className="text-lg font-bold mb-2">Selected Node: {selectedNode.name}</h3>
              <NodeContent node={selectedNode} />
            </div>
          </div>
        )}
      </div>
    );
  };
  
  ReactDOM.render(<PersonalWebsite />, document.getElementById('root'));
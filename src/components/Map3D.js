import React, { useRef, useState, useMemo, useCallback } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { TextureLoader, Color } from 'three';
import { OrbitControls, Sphere, Html, Line, Text } from '@react-three/drei';
import { servers as serverData, latencyPairs } from '../data/servers';
import exchangeServers from '../data/exchangeServers';
import { latlonToXY } from '../utils/latlonToXY';
import { getLatencyColor } from '../utils/getLatencyColor';
import MovingDot from './MovingDot';
// import { useSpring, a } from '@react-spring/three';
import { Stars } from '@react-three/drei';
import Globe from './Globe';
import ServerMarker from './ServerMarker';


const providerColors = {
  AWS: 'orange',
  Azure: 'blue',
  GCP: 'green',
};

const allNodes = [
  { id: 1, position: [-1, 0, 0], provider: 'AWS' },
  { id: 2, position: [0, 1, 0], provider: 'Azure' },
  { id: 3, position: [1, 0, 0], provider: 'GCP' },
  { id: 4, position: [0, -1, 0], provider: 'AWS' },
];

const latencyLinks = [
  { from: 1, to: 2, latency: 30 },
  { from: 2, to: 3, latency: 50 },
  { from: 3, to: 4, latency: 20 },
  { from: 4, to: 1, latency: 40 },
];

const dataCenters = [
  { name: 'AWS', position: [0.5, 0.3, 0.2], color: 'orange' },
  { name: 'GCP', position: [-0.4, 0.2, 0.1], color: 'blue' },
  { name: 'Azure', position: [0.1, -0.5, -0.2], color: 'green' }
];

function Map3D({ selectedProviders }) {
  const earthRef = useRef();
  const earthTexture = useLoader(TextureLoader, '/earth.jpg');
  const [hoveredServer, setHoveredServer] = useState(null);
  // const [hoveredNode, setHoveredNode] = useState(null);
  const [hovered, setHovered] = useState(null);

  useFrame(() => {
    if (earthRef.current) {
      earthRef.current.rotation.y += 0.001;
    }
  });

  const handlePointerOver = useCallback((server, event) => {
    setHoveredServer({ ...server, x: event.clientX, y: event.clientY });
  }, []);

  const handlePointerOut = useCallback(() => {
    setHoveredServer(null);
  }, []);

  const visibleNodes = useMemo(
    () => allNodes.filter((node) => selectedProviders.includes(node.provider)),
    [selectedProviders]
  );

  const getNodeById = (id) => visibleNodes.find((node) => node.id === id);

  const visibleLinks = useMemo(() =>
    latencyLinks.filter(link => getNodeById(link.from) && getNodeById(link.to)),
    [visibleNodes]
  );

  const positions = [];
  const colors = [];

  visibleLinks.forEach(link => {
    const from = getNodeById(link.from);
    const to = getNodeById(link.to);
    const latencyColor = new Color(getLatencyColor(link.latency));
    if (from && to) {
      positions.push(...from.position, ...to.position);
      colors.push(latencyColor.r, latencyColor.g, latencyColor.b);
      colors.push(latencyColor.r, latencyColor.g, latencyColor.b);
    }
  });

  const filteredServers = useMemo(() =>
    serverData.filter(server => selectedProviders.includes(server.provider)),
    [selectedProviders]
  );

  const filteredLatencyPairs = useMemo(() =>
    latencyPairs.filter(pair =>
      selectedProviders.includes(pair.from.provider) &&
      selectedProviders.includes(pair.to.provider)
    ), [selectedProviders]
  );

  return (
    <>

      {/*  Animated space stars background */}
      <Stars
        radius={100}
        depth={50}
        count={8000}
        factor={4}
        saturation={0}
        fade
        speed={1}
      />

      {/*  Your existing 3D components */}
      <Globe />
      <ServerMarker selectedProviders={selectedProviders} />
      <MovingDot from={[1, 0, 0]} to={[0, 1, 0]} />
    

      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      <OrbitControls enableZoom={true} />

      {/* Earth */}
      <mesh ref={earthRef}>
        <sphereGeometry args={[1, 64, 64]} />
        <meshStandardMaterial map={earthTexture} />
      </mesh>

      {/* Data Center Labels */}
      {dataCenters
        .filter(provider => selectedProviders.includes(provider.name))
        .map((provider, index) => (
          <mesh
            key={index}
            position={provider.position}
            onPointerOver={() => setHovered(provider.name)}
            onPointerOut={() => setHovered(null)}
          >
            <boxGeometry args={[0.03, 0.03, 0.03]} />
            <meshStandardMaterial color={provider.color} />
            {hovered === provider.name && (
              <Html distanceFactor={10}>
                <div style={{
                  background: 'white',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  fontSize: '12px'
                }}>
                  {provider.name}
                </div>
              </Html>
            )}
          </mesh>
        ))}

      {/* Server Nodes */}
      {filteredServers.map((node) => (
        <mesh
          key={node.id}
          position={node.position}
          onPointerOver={(e) => handlePointerOver(node, e)}
          onPointerOut={handlePointerOut}
        >
          <sphereGeometry args={[0.05, 32, 32]} />
          <meshStandardMaterial color={providerColors[node.provider]} />
        </mesh>
      ))}

      {/* Latency Lines with Moving Dots */}
      {filteredLatencyPairs.map((pair, index) => {
        const fromNode = allNodes.find(n => n.provider === pair.from.provider);
        const toNode = allNodes.find(n => n.provider === pair.to.provider);
        if (!fromNode || !toNode) return null;

        return (
          <React.Fragment key={index}>
            <Line
              points={[fromNode.position, toNode.position]}
              color={getLatencyColor(pair.latency)}
              lineWidth={2}
            />
            <MovingDot start={fromNode.position} end={toNode.position} />
          </React.Fragment>
        );
      })}

      {/* Exchange Server Nodes */}
      {exchangeServers
        .filter(server => selectedProviders.includes(server.provider))
        .map((server, index) => {
          const pos = latlonToXY(server.lat, server.lon);
          return (
            <mesh
              key={index}
              position={pos}
              onPointerOver={() => setHoveredServer({ ...server, pos })}
              onPointerOut={() => setHoveredServer(null)}
            >
              <sphereGeometry args={[0.015, 16, 16]} />
              <meshStandardMaterial color={providerColors[server.provider]} />
            </mesh>
          );
        })}

      {/* Sphere Nodes */}
      {visibleNodes.map((node) => (
        <Sphere key={node.id} position={node.position} args={[0.1, 16, 16]}>
          <meshStandardMaterial color={providerColors[node.provider]} />
        </Sphere>
      ))}

      {/* Latency Labels */}
      {visibleLinks.map(link => {
        const from = getNodeById(link.from);
        const to = getNodeById(link.to);
        if (!from || !to) return null;

        const mid = [
          (from.position[0] + to.position[0]) / 2,
          (from.position[1] + to.position[1]) / 2,
          (from.position[2] + to.position[2]) / 2,
        ];

        return (
          <Text
            key={`${link.from}-${link.to}`}
            position={mid}
            fontSize={0.1}
            color="white"
            anchorX="center"
            anchorY="middle"
          >
            {link.latency}ms
          </Text>
        );
      })}

      {/* Line Connections */}
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            array={new Float32Array(positions)}
            count={positions.length / 3}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            array={new Float32Array(colors)}
            count={colors.length / 3}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial vertexColors />
      </lineSegments>

      {/* Tooltip */}
      {hoveredServer && (
        <Html position={hoveredServer.pos} center>
          <div style={{
            background: '#222',
            color: '#fff',
            padding: '4px 8px',
            borderRadius: '4px',
            fontSize: '0.7rem',
            pointerEvents: 'none'
          }}>
            <strong>{hoveredServer.name}</strong><br />
            {hoveredServer.location}<br />
            <em>{hoveredServer.provider}</em>
          </div>
        </Html>
      )}
    </>
  );
}

export default Map3D;

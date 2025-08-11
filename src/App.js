import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import Map3D from './components/Map3D';
import './App.css';


// import MovingDot from './components/MovingDot';

function App() {
  const [selectedProviders, setSelectedProviders] = useState(['AWS', 'Azure', 'GCP']);

  const toggleProvider = (provider) => {
    setSelectedProviders(prev =>
      prev.includes(provider)
        ? prev.filter(p => p !== provider)
        : [...prev, provider]
    );
  };

  return (
    <>
      {/* Provider Toggle UI */}
      <div
        style={{
          position: 'absolute',
          top: 10,
          left: 10,
          zIndex: 1,
          background: '#ffffffcc',
          padding: '10px 16px',
          borderRadius: '10px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        }}
      >
        <strong>Toggle Providers:</strong><br />
        <label>
          <input
            type="checkbox"
            checked={selectedProviders.includes('AWS')}
            onChange={() => toggleProvider('AWS')}
          />{' '}
          AWS
        </label>
        <br />
        <label>
          <input
            type="checkbox"
            checked={selectedProviders.includes('Azure')}
            onChange={() => toggleProvider('Azure')}
          />{' '}
          Azure
        </label>
        <br />
        <label>
          <input
            type="checkbox"
            checked={selectedProviders.includes('GCP')}
            onChange={() => toggleProvider('GCP')}
          />{' '}
          GCP
        </label>
      </div>

      {/* 3D Map View */}
      <div style={{ width: '100vw', height: '100vh' }}>
        <Canvas camera={{ position: [0, 0, 2] }}>
          <Map3D selectedProviders={selectedProviders} />
        </Canvas>
      </div>
    </>
  );
}

export default App;

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const MovingDot = ({ from, to, color = 'white' }) => {
  const dotRef = useRef();
  const speed = 0.01;
  const tRef = useRef(Math.random()); // random initial offset

  useFrame(() => {
    tRef.current += speed;
    if (tRef.current > 1) tRef.current = 0;

    const position = new THREE.Vector3().lerpVectors(
      new THREE.Vector3(...from),
      new THREE.Vector3(...to),
      tRef.current
    );

    if (dotRef.current) {
      dotRef.current.position.set(position.x, position.y, position.z);
    }
  });

  return (
    <mesh ref={dotRef}>
      <sphereGeometry args={[0.01, 8, 8]} />
      <meshBasicMaterial color={color} />
    </mesh>
  );
};

export default React.memo(MovingDot);

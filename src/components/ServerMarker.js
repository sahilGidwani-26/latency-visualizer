import React from 'react';
import { Sphere } from '@react-three/drei';

export default function ServerMarker() {
  return (
    <Sphere args={[0.05, 16, 16]}>
      <meshStandardMaterial attach="material" color="red" />
    </Sphere>
  );
}
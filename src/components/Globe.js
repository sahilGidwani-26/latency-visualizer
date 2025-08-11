import React from 'react';
import { Sphere } from '@react-three/drei';

export default function Globe() {
  return (
    <Sphere args={[1, 32, 32]}>
      <meshStandardMaterial attach="material" color="blue" />
    </Sphere>
  );
}
import { useMemo } from 'react';
import * as THREE from 'three';

export default function Orbit({ radius, color = '#ff6b9d', opacity = 0.2 }) {
  const points = useMemo(() => {
    const curve = new THREE.EllipseCurve(
      0, 0,
      radius, radius,
      0, 2 * Math.PI,
      false,
      0
    );
    
    const points = curve.getPoints(64);
    return points.map(p => new THREE.Vector3(p.x, 0, p.y));
  }, [radius]);

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry().setFromPoints(points);
    return geo;
  }, [points]);

  return (
    <line geometry={geometry}>
      <lineBasicMaterial 
        color={color} 
        transparent 
        opacity={opacity} 
        linewidth={1}
      />
    </line>
  );
}
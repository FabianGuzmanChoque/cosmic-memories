import { useRef, useState, useMemo } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { TextureLoader } from 'three';
import * as THREE from 'three';

export default function Planet({ 
  image, 
  radius = 0.5, 
  orbitRadius = 5, 
  orbitSpeed = 0.5, 
  rotationSpeed = 0.5,
  startAngle = 0,
  onClick
}) {
  const meshRef = useRef();
  const glowRef = useRef();
  const groupRef = useRef();
  const [hovered, setHovered] = useState(false);
  
  const angleRef = useRef(startAngle);
  
  const texture = useMemo(() => {
    if (image) {
      return new TextureLoader().load(image);
    }
    return null;
  }, [image]);

  useFrame((state, delta) => {
    angleRef.current += delta * orbitSpeed;
    
    if (groupRef.current) {
      groupRef.current.position.x = Math.cos(angleRef.current) * orbitRadius;
      groupRef.current.position.z = Math.sin(angleRef.current) * orbitRadius;
    }
    
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * rotationSpeed;
    }
    
    if (glowRef.current) {
      glowRef.current.scale.setScalar(hovered ? 1.3 : 1);
    }
  });

  return (
    <group ref={groupRef} position={[orbitRadius, 0, 0]}>
      <mesh
        ref={meshRef}
        onClick={(e) => {
          e.stopPropagation();
          onClick && onClick();
        }}
        onPointerOver={() => {
          setHovered(true);
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          setHovered(false);
          document.body.style.cursor = 'auto';
        }}
      >
        <sphereGeometry args={[radius, 32, 32]} />
        <meshStandardMaterial
          map={texture}
          color={texture ? '#ffffff' : '#ff6b9d'}
          roughness={0.8}
          metalness={0.1}
        />
      </mesh>
      
      <mesh ref={glowRef}>
        <sphereGeometry args={[radius * 1.2, 16, 16]} />
        <meshBasicMaterial
          color={hovered ? '#ff6b9d' : '#ff6b9d'}
          transparent
          opacity={hovered ? 0.4 : 0.25}
          side={THREE.BackSide}
        />
      </mesh>
      
      <pointLight
        color="#ffffff"
        intensity={hovered ? 1 : 0.5}
        distance={radius * 5}
      />
    </group>
  );
}
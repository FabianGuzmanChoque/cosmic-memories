import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const sunVertexShader = `
  varying vec2 vUv;
  varying vec3 vNormal;
  void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const sunFragmentShader = `
  uniform float time;
  uniform vec3 color;
  varying vec2 vUv;
  varying vec3 vNormal;
  
  void main() {
    float pulse = 0.8 + 0.2 * sin(time * 2.0);
    float noise = sin(vUv.x * 20.0 + time) * sin(vUv.y * 20.0 + time * 0.5) * 0.1;
    vec3 finalColor = color * (pulse + noise);
    float fresnel = pow(1.0 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
    finalColor += vec3(1.0, 0.8, 0.6) * fresnel * 0.5;
    gl_FragColor = vec4(finalColor, 1.0);
  }
`;

export default function Sun({ mainImage, onClick }) {
  const meshRef = useRef();
  const glowRef = useRef();
  const particlesRef = useRef();
  
  const uniforms = useMemo(() => ({
    time: { value: 0 },
    color: { value: new THREE.Color('#ff6b9d') }
  }), []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    uniforms.time.value = t;
    
    if (meshRef.current) {
      meshRef.current.rotation.y = t * 0.2;
    }
    
    if (glowRef.current) {
      glowRef.current.scale.setScalar(1 + Math.sin(t * 2) * 0.1);
    }
    
    if (particlesRef.current) {
      particlesRef.current.rotation.y = t * 0.3;
    }
  });

  const particlePositions = useMemo(() => {
    const positions = new Float32Array(300 * 3);
    for (let i = 0; i < 300; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 2.5 + Math.random() * 1.5;
      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 2;
      positions[i * 3 + 2] = Math.sin(angle) * radius;
    }
    return positions;
  }, []);

  return (
    <group onClick={onClick}>
      <mesh ref={meshRef}>
        <sphereGeometry args={[1.5, 64, 64]} />
        <shaderMaterial
          vertexShader={sunVertexShader}
          fragmentShader={sunFragmentShader}
          uniforms={uniforms}
        />
      </mesh>
      
      <mesh ref={glowRef}>
        <sphereGeometry args={[2, 32, 32]} />
        <meshBasicMaterial
          color="#ff6b9d"
          transparent
          opacity={0.15}
          side={THREE.BackSide}
        />
      </mesh>
      
      <pointLight color="#ff6b9d" intensity={2} distance={50} />
      
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={300}
            array={particlePositions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.05}
          color="#ffd700"
          transparent
          opacity={0.8}
          sizeAttenuation
        />
      </points>
    </group>
  );
}
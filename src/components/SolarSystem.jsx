import * as THREE from 'three';
import { useState, useRef, useCallback, useMemo, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import { motion } from 'framer-motion';
import { X, Link, Trash2, Plus, Heart, Volume2, VolumeX } from 'lucide-react';

function FloatingParticles() {
  const count = 80;
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 80;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 40;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 60;
    }
    return pos;
  }, []);

  const ref = useRef();
  
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.02;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.2} color="#ffb6c1" transparent opacity={0.4} />
    </points>
  );
}

function ShootingStar({ startPosition, onComplete }) {
  const ref = useRef();
  const groupRef = useRef();
  const speed = useMemo(() => 2.5 + Math.random() * 2, []);
  const direction = useMemo(() => new THREE.Vector3(
    -0.4 - Math.random() * 0.4,
    -0.3 - Math.random() * 0.3,
    -0.3 - Math.random() * 0.4
  ).normalize(), []);
  
  const distance = useRef(0);
  const maxDistance = 100 + Math.random() * 50;

  useFrame(() => {
    if (!groupRef.current) return;
    
    groupRef.current.position.x += direction.x * speed;
    groupRef.current.position.y += direction.y * speed;
    groupRef.current.position.z += direction.z * speed;
    
    distance.current += speed;
    if (distance.current > maxDistance) {
      onComplete();
    }
  });

  return (
    <group ref={groupRef} position={startPosition}>
      <mesh>
        <sphereGeometry args={[0.2, 8, 8]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
      <mesh position={[0.8, 0.5, 0.5]}>
        <sphereGeometry args={[0.12, 6, 6]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.7} />
      </mesh>
      <mesh position={[1.5, 1, 1]}>
        <sphereGeometry args={[0.06, 6, 6]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.4} />
      </mesh>
      <pointLight color="#ffffff" intensity={5} distance={20} />
    </group>
  );
}

function ShootingStarSystem() {
  const [stars, setStars] = useState([]);
  const lastSpawnTime = useRef(0);

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    if (time - lastSpawnTime.current > 4 + Math.random() * 6) {
      lastSpawnTime.current = time;
      const startPos = [
        40 + Math.random() * 30,
        20 + Math.random() * 25,
        30 + Math.random() * 20
      ];
      setStars(prev => [...prev.slice(-3), { 
        id: Date.now(), 
        startPosition: startPos 
      }]);
    }
  });

  const removeStar = (id) => {
    setStars(prev => prev.filter(s => s.id !== id));
  };

  return (
    <>
      {stars.map(star => (
        <ShootingStar 
          key={star.id} 
          startPosition={star.startPosition} 
          onComplete={() => removeStar(star.id)}
        />
      ))}
    </>
  );
}

function Sun({ onClick }) {
  const meshRef = useRef();
  const glowRef = useRef();
  const glow2Ref = useRef();
  const particlesRef = useRef();
  const coronaRef = useRef();
  
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (meshRef.current) {
      meshRef.current.rotation.y = t * 0.08;
    }
    if (glowRef.current) {
      glowRef.current.scale.setScalar(1.12 + Math.sin(t * 1.2) * 0.08);
    }
    if (glow2Ref.current) {
      glow2Ref.current.scale.setScalar(1.25 + Math.sin(t * 0.8 + 1) * 0.1);
    }
    if (coronaRef.current) {
      coronaRef.current.rotation.z = t * 0.1;
    }
    if (particlesRef.current) {
      particlesRef.current.rotation.y = t * 0.15;
      particlesRef.current.rotation.x = Math.sin(t * 0.3) * 0.1;
    }
  });

  const particlePositions = useMemo(() => {
    const positions = new Float32Array(300 * 3);
    for (let i = 0; i < 300; i++) {
      const theta = Math.random() * Math.PI * 2;
      const r = 2.8 + Math.random() * 1.8;
      const y = (Math.random() - 0.5) * 2;
      positions[i * 3] = Math.cos(theta) * r;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = Math.sin(theta) * r;
    }
    return positions;
  }, []);

  const coronaPoints = useMemo(() => {
    const points = [];
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      points.push(new THREE.Vector3(Math.cos(angle) * 5, Math.sin(angle) * 5, 0));
      points.push(new THREE.Vector3(Math.cos(angle + 0.3) * 6, Math.sin(angle + 0.3) * 6, 0));
    }
    return points;
  }, []);

  return (
    <group onClick={onClick}>
      <mesh ref={meshRef}>
        <sphereGeometry args={[2, 64, 64]} />
        <meshStandardMaterial 
          color="#ff6b9d" 
          emissive="#ff6b9d" 
          emissiveIntensity={1}
          roughness={0.2}
        />
      </mesh>
      
      <mesh ref={glowRef}>
        <sphereGeometry args={[2.6, 32, 32]} />
        <meshBasicMaterial 
          color="#ff8fb3" 
          transparent 
          opacity={0.25}
          side={THREE.BackSide}
        />
      </mesh>
      
      <mesh ref={glow2Ref}>
        <sphereGeometry args={[3.5, 24, 24]} />
        <meshBasicMaterial 
          color="#ff6b9d" 
          transparent 
          opacity={0.1}
          side={THREE.BackSide}
        />
      </mesh>

      <mesh ref={coronaRef} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[4, 0.08, 8, 64]} />
        <meshBasicMaterial color="#ffd700" transparent opacity={0.25} />
      </mesh>

      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={300}
            array={particlePositions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial size={0.1} color="#ffd700" transparent opacity={0.9} />
      </points>
      
      <pointLight color="#ff6b9d" intensity={10} distance={80} decay={1} />
      <pointLight color="#ffd700" intensity={2} distance={20} position={[0, 4, 0]} />
    </group>
  );
}

function Planet({ position, color, onClick, image }) {
  const ref = useRef();
  const glowRef = useRef();
  const ringRef = useRef();
  
  const texture = useMemo(() => {
    if (image) {
      const loader = new THREE.TextureLoader();
      return loader.load(image);
    }
    return null;
  }, [image]);
  
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y += 0.006;
    }
    if (glowRef.current) {
      glowRef.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 2 + position[0]) * 0.06);
    }
    if (ringRef.current) {
      ringRef.current.rotation.z = state.clock.elapsedTime * 0.1;
    }
  });

  const hasRing = position[0] > 15;

  return (
    <group position={position}>
      <mesh 
        ref={ref}
        onClick={(e) => { e.stopPropagation(); onClick(); }}
      >
        <sphereGeometry args={[1, 32, 32]} />
        {texture ? (
          <meshStandardMaterial 
            map={texture}
            roughness={0.6}
          />
        ) : (
          <meshStandardMaterial 
            color={color} 
            emissive={color}
            emissiveIntensity={0.4}
            roughness={0.4}
          />
        )}
      </mesh>
      
      {hasRing && (
        <mesh ref={ringRef} rotation={[Math.PI / 2.5, 0, 0]}>
          <ringGeometry args={[1.5, 2.2, 32]} />
          <meshBasicMaterial color={color} transparent opacity={0.35} side={THREE.DoubleSide} />
        </mesh>
      )}
      
      <mesh ref={glowRef}>
        <sphereGeometry args={[1.5, 16, 16]} />
        <meshBasicMaterial color={color} transparent opacity={0.2} side={THREE.BackSide} />
      </mesh>
    </group>
  );
}

function OrbitLine({ radius }) {
  const points = useMemo(() => {
    const pts = [];
    for (let i = 0; i <= 80; i++) {
      const angle = (i / 80) * Math.PI * 2;
      pts.push(new THREE.Vector3(Math.cos(angle) * radius, 0, Math.sin(angle) * radius));
    }
    return pts;
  }, [radius]);

  return (
    <line>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={points.length}
          array={new Float32Array(points.flatMap(p => [p.x, p.y, p.z]))}
          itemSize={3}
        />
      </bufferGeometry>
      <lineBasicMaterial color="#ff6b9d" transparent opacity={0.1} />
    </line>
  );
}

function ExtraOrbits() {
  const extraOrbits = [8, 12, 16, 21, 27, 33, 39];
  
  return (
    <>
      {extraOrbits.map((radius) => (
        <OrbitLine key={radius} radius={radius} />
      ))}
    </>
  );
}

function generatePlanetPositions(memories) {
  const solarSystemScale = [8, 12, 16, 21, 27, 33, 39, 45];
  const positions = [];
  
  for (let i = 0; i < memories.length; i++) {
    const memory = memories[i];
    let radius, angle;
    
    if (memory.orbitRadius) {
      radius = memory.orbitRadius;
    } else {
      radius = solarSystemScale[i] || (45 + (i - 8) * 6);
    }
    
    if (memory.orbitAngle !== undefined) {
      angle = memory.orbitAngle;
    } else {
      angle = (i * Math.PI * 2) / 8 + Math.PI / 8;
    }
    
    const x = Math.cos(angle) * radius;
    const z = Math.sin(angle) * radius;
    positions.push([x, 0, z]);
  }
  
  return positions;
}

export default function SolarSystem({ memories, onAddMemory, onUpdateMemory, onDeleteMemory, isSharedView = false, sharedTitle = '', sharedMusic = '' }) {
  const [selectedMemory, setSelectedMemory] = useState(null);
  const [showExport, setShowExport] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [copied, setCopied] = useState(false);
  const [universeTitle, setUniverseTitle] = useState('');
  const [newMemory, setNewMemory] = useState({ title: '', message: '', date: '', image: '' });
  const [showHearts, setShowHearts] = useState(false);
  const [musicEnabled, setMusicEnabled] = useState(false);
  const [musicUrl, setMusicUrl] = useState('');
  const [showWelcome, setShowWelcome] = useState(true);
  const [showGallery, setShowGallery] = useState(false);
  const [deletingPlanet, setDeletingPlanet] = useState(null);
  const [deletingIds, setDeletingIds] = useState(new Set());
  const musicRef = useRef(null);

  useEffect(() => {
    if (isSharedView && sharedMusic) {
      setMusicUrl(sharedMusic);
      setMusicEnabled(true);
      if (sharedMusic.includes('youtube')) {
        // YouTube opens in new tab
      } else if (sharedMusic.includes('spotify')) {
        // Spotify shows embed
      } else {
        // Direct MP3 - autoplay
        setTimeout(() => {
          musicRef.current = new Audio(sharedMusic);
          musicRef.current.loop = true;
          musicRef.current.volume = 0.3;
          musicRef.current.play().catch(() => {});
        }, 500);
      }
    } else if (!isSharedView) {
      const savedMusic = localStorage.getItem('cosmic-music');
      if (savedMusic) {
        setMusicUrl(savedMusic);
        if (savedMusic.includes('.mp3') || savedMusic.includes('audio')) {
          setTimeout(() => {
            musicRef.current = new Audio(savedMusic);
            musicRef.current.loop = true;
            musicRef.current.volume = 0.3;
            musicRef.current.play().catch(() => {});
          }, 500);
        }
      }
    }
  }, [isSharedView, sharedMusic]);

  useEffect(() => {
    if (musicUrl && (musicUrl.includes('.mp3') || musicUrl.includes('audio'))) {
      setTimeout(() => {
        if (!musicRef.current) {
          musicRef.current = new Audio(musicUrl);
          musicRef.current.loop = true;
          musicRef.current.volume = 0.3;
        }
        musicRef.current.play().catch(() => {});
        setMusicEnabled(true);
      }, 300);
    }
  }, [musicUrl]);

  const toggleMusic = useCallback(() => {
    const musicLink = musicUrl || sharedMusic;
    
    if (!musicLink) return;
    
    if (musicLink.includes('youtube') || musicLink.includes('youtu.be')) {
      const videoId = musicLink.split('v=')[1]?.split('&')[0] || musicLink.split('/').pop();
      window.open(`https://www.youtube.com/watch?v=${videoId}&autoplay=1`, '_blank');
      setMusicEnabled(true);
      return;
    }
    
    if (musicLink.includes('spotify')) {
      setMusicEnabled(!musicEnabled);
      return;
    }
    
    if (musicRef.current) {
      if (musicEnabled) {
        musicRef.current.pause();
      } else {
        musicRef.current.play().catch(() => {});
      }
    } else {
      musicRef.current = new Audio(musicLink);
      musicRef.current.loop = true;
      musicRef.current.volume = 0.3;
      musicRef.current.play().catch(() => {});
    }
    setMusicEnabled(!musicEnabled);
  }, [musicEnabled, musicUrl, sharedMusic]);

  const handleMusicUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setMusicUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const planetMemories = memories.slice(1);
  const planetPositions = useMemo(() => generatePlanetPositions(planetMemories), [planetMemories]);
  
  const colors = ['#ff6b9d', '#c084fc', '#fcd34d', '#60a5fa', '#4ade80', '#fb923c', '#e879f9', '#22d3ee'];

  const handlePlanetClick = useCallback((memory) => {
    setSelectedMemory(memory);
  }, []);

  const handleClosePanel = useCallback(() => {
    setSelectedMemory(null);
  }, []);

  const handleDelete = useCallback((id, position) => {
    setDeletingPlanet({ id, position });
    setDeletingIds(prev => new Set([...prev, id]));
    setSelectedMemory(null);
    setTimeout(() => {
      onDeleteMemory(id);
      setDeletingPlanet(null);
      setDeletingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }, 1500);
  }, [onDeleteMemory]);

  function ExplosionParticles({ position, color }) {
    const ref = useRef();
    const count = 80;
    const [progress, setProgress] = useState(0);
    
    const positions = useMemo(() => {
      const pos = new Float32Array(count * 3);
      const velocities = [];
      for (let i = 0; i < count; i++) {
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.random() * Math.PI;
        const speed = 0.5 + Math.random() * 1.5;
        velocities.push({
          x: Math.sin(phi) * Math.cos(theta) * speed,
          y: Math.sin(phi) * Math.sin(theta) * speed,
          z: Math.cos(phi) * speed
        });
        pos[i * 3] = 0;
        pos[i * 3 + 1] = 0;
        pos[i * 3 + 2] = 0;
      }
      ref.current = { velocities };
      return pos;
    }, []);

    useFrame(() => {
      if (ref.current && ref.current.velocities) {
        const positions = ref.current.geometry.attributes.position.array;
        const vels = ref.current.velocities;
        for (let i = 0; i < count; i++) {
          positions[i * 3] += vels[i].x * 0.4;
          positions[i * 3 + 1] += vels[i].y * 0.4;
          positions[i * 3 + 2] += vels[i].z * 0.4;
        }
        ref.current.geometry.attributes.position.needsUpdate = true;
        setProgress(p => Math.min(p + 0.03, 1));
      }
    });

    return (
      <points ref={ref} position={position}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial 
          size={0.5} 
          color={color} 
          transparent 
          opacity={1 - progress * 0.8}
          sizeAttenuation
        />
      </points>
    );
  }

  const handleAddSubmit = (e) => {
    e.preventDefault();
    const solarSystemScale = [8, 12, 16, 21, 27, 33, 39, 45];
    const idx = planetMemories.length;
    const orbitRadius = solarSystemScale[idx] || (45 + (idx - 8) * 6);
    const orbitAngle = Math.random() * Math.PI * 2;
    const color = colors[idx % colors.length];
    onAddMemory({ id: Date.now(), ...newMemory, orbitRadius, orbitAngle, color });
    setNewMemory({ title: '', message: '', date: '', image: '' });
    setShowAdd(false);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewMemory(prev => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const exportAllMemories = useCallback(() => {
    const dataStr = JSON.stringify(memories, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'mis-recuerdos-cosmicos.json';
    link.click();
    URL.revokeObjectURL(url);
    setShowExport(false);
  }, [memories]);

  const copyShareLink = useCallback(() => {
    const musicToShare = musicUrl && musicUrl.startsWith('http') ? musicUrl : null;
    const shareData = {
      type: 'cosmic-memories',
      version: '1.0',
      title: universeTitle || 'Mi Universo de Recuerdos',
      music: musicToShare,
      memories: memories.map(m => ({ 
        title: m.title, 
        date: m.date, 
        message: m.message,
        orbitRadius: m.orbitRadius,
        orbitAngle: m.orbitAngle,
        color: m.color,
        image: m.image?.startsWith('http') ? m.image : null
      }))
    };
    const encoded = btoa(encodeURIComponent(JSON.stringify(shareData)));
    const link = `${window.location.origin}?shared=${encoded}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  }, [memories, universeTitle, musicUrl]);

  const romanticQuotes = [
    "Cada estrella representa un momento contigo",
    "Tu amor brilla más que mil soles",
    "Juntos hemos creado un universo de recuerdos",
    "Eres mi sol en este cosmos infinito",
    "Mis favoritos están en este cielo",
  ];

  return (
    <div style={{ width: '100vw', height: '100vh', background: 'radial-gradient(ellipse at 30% 20%, #1a0a2e 0%, #0a0515 40%, #020104 80%, #000000 100%)' }}>
      <Canvas camera={{ position: [0, 45, 80], fov: 40 }}>
        <color attach="background" args={['#050210']} />
        <fog attach="fog" args={['#050210', 80, 200]} />
        
        <ambientLight intensity={0.25} />
        <pointLight position={[0, 0, 0]} intensity={15} color="#ff6b9d" />
        <pointLight position={[60, 60, 60]} intensity={2.5} color="#ffffff" />
        <pointLight position={[-40, -30, -40]} intensity={1.5} color="#4a2c6e" />
        
        <Stars radius={200} depth={100} count={6000} factor={5} saturation={0.3} fade speed={0.25} />
        
        <FloatingParticles />
        <ShootingStarSystem />
        {/* <NebulaClouds /> */}
        {/* <MeteorShower /> */}
        
        <Sun onClick={() => memories[0] && handlePlanetClick(memories[0])} />
        
        <ExtraOrbits />
        
        {planetMemories.map((memory, index) => (
          !deletingIds.has(memory.id) && (
            <Planet
              key={memory.id}
              position={planetPositions[index]}
              color={memory.color || colors[index % colors.length]}
              image={memory.image}
              onClick={() => handlePlanetClick(memory)}
            />
          )
        ))}
        
        {deletingPlanet && (
          <ExplosionParticles 
            position={deletingPlanet.position} 
            color={planetMemories.find(m => m.id === deletingPlanet.id)?.color || '#ff6b9d'}
          />
        )}
        
        <OrbitControls 
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={5}
          maxDistance={150}
          autoRotate={!selectedMemory}
          autoRotateSpeed={0.1}
        />
      </Canvas>

      {selectedMemory && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: 'radial-gradient(circle at center, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.9) 100%)' }}
          onClick={handleClosePanel}
        >
          <motion.div
            initial={{ scale: 0.7, y: 60, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            transition={{ type: "spring", duration: 0.6 }}
            className="glass-panel max-w-xl w-full mx-4 p-0 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
            style={{ borderRadius: '24px' }}
          >
            <div className="relative">
              {selectedMemory.image ? (
                <div 
                  className="w-full overflow-y-auto" 
                  style={{ 
                    maxHeight: '50vh',
                    background: '#000'
                  }}
                >
                  <img 
                    src={selectedMemory.image} 
                    alt="" 
                    className="w-full h-auto block"
                    style={{ 
                      objectFit: 'contain',
                    }} 
                  />
                  <p className="text-center text-white/40 text-xs py-2">Desliza para ver la imagen completa</p>
                </div>
              ) : (
                <div className="w-full h-40 flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #ff6b9d 0%, #4a2c6e 100%)', borderRadius: '24px 24px 0 0' }}>
                  <Heart className="w-16 h-16 text-white/50" />
                </div>
              )}
            </div>
            
            <div className="p-8 pt-4">
              <button
                onClick={handleClosePanel}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 transition-all"
                style={{ background: 'rgba(0,0,0,0.3)' }}
              >
                <X className="w-5 h-5 text-white" />
              </button>
              
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <h2 className="text-3xl font-light text-white mb-2">{selectedMemory.title}</h2>
                <p className="text-sm text-white/50 mb-4">{selectedMemory.date}</p>
                <p className="text-white/80 leading-relaxed text-lg">{selectedMemory.message}</p>
              </motion.div>
              
              {!isSharedView && (
                <motion.div 
                  className="pt-6 mt-6 border-t border-white/10 flex gap-3"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <button
                    onClick={() => {
                      const idx = planetMemories.findIndex(m => m.id === selectedMemory.id);
                      if (idx >= 0 && planetPositions[idx]) {
                        handleDelete(selectedMemory.id, planetPositions[idx]);
                      } else {
                        handleDelete(selectedMemory.id, [0, 0, 0]);
                      }
                    }}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-500/20 text-red-400 text-sm hover:bg-red-500/30 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                    Eliminar
                  </button>
                </motion.div>
              )}
              
              <motion.p 
                className="text-center text-white/30 text-xs mt-6 italic"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                {romanticQuotes[Math.floor(Math.random() * romanticQuotes.length)]}
              </motion.p>
            </div>
          </motion.div>
        </motion.div>
      )}

      {showExport && !isSharedView && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: 'rgba(0,0,0,0.7)' }}
          onClick={() => setShowExport(false)}
        >
          <motion.div
            initial={{ scale: 0.8, y: 30 }}
            animate={{ scale: 1, y: 0 }}
            className="glass-panel max-w-md w-full mx-4 p-8"
            onClick={(e) => e.stopPropagation()}
            style={{ borderRadius: '20px' }}
          >
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-pink-500" fill="#ff6b9d" />
                <h3 className="text-xl font-light text-white">Compartir Universo</h3>
              </div>
              <button onClick={() => setShowExport(false)}>
                <X className="w-5 h-5 text-white/50 hover:text-white" />
              </button>
            </div>
            
            <p className="text-white/60 text-sm mb-5">
              Comparte tu historia de amor con alguien especial
            </p>
            
            <input
              type="text"
              placeholder="Nombre del universo"
              value={universeTitle}
              onChange={(e) => setUniverseTitle(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 mb-5"
              style={{ background: 'rgba(255,255,255,0.05)' }}
            />
            
            <div className="space-y-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={exportAllMemories}
                className="w-full py-4 rounded-xl text-white font-medium flex items-center justify-center gap-2"
                style={{ background: 'linear-gradient(135deg, #ff6b9d 0%, #c084fc 100%)' }}
              >
                <Link className="w-4 h-4" />
                Descargar Recuerdos
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={copyShareLink}
                className="w-full py-4 rounded-xl text-white flex items-center justify-center gap-2"
                style={{ background: 'rgba(255,255,255,0.1)' }}
              >
                {copied ? <Heart className="w-4 h-4 text-pink-500" fill="#ff6b9d" /> : <Link className="w-4 h-4" />}
                {copied ? '¡Enlace Copiado con Amor!' : 'Copiar Enlace'}
              </motion.button>
            </div>

            {copied && (
              <motion.p 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center text-pink-400 text-sm mt-4"
              >
                Comparte este enlace con tu persona especial
              </motion.p>
            )}

            <p className="text-center text-white/40 text-xs mt-3">
              Las imágenes se comparten. YouTube y enlaces directos funcionan para música.
            </p>
          </motion.div>
        </motion.div>
      )}

      {showAdd && !isSharedView && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-end"
          style={{ background: 'rgba(0,0,0,0.5)' }}
          onClick={() => setShowAdd(false)}
        >
          <motion.div
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="glass-panel max-w-sm w-full p-6 m-4"
            style={{ borderRadius: '20px' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-5">
              <div className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-pink-400" />
                <h3 className="text-lg font-light text-white">Nuevo Recuerdo</h3>
              </div>
              <button onClick={() => setShowAdd(false)}>
                <X className="w-5 h-5 text-white/50" />
              </button>
            </div>
            
            <form onSubmit={handleAddSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Título del recuerdo"
                value={newMemory.title}
                onChange={(e) => setNewMemory(prev => ({ ...prev, title: e.target.value }))}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm"
                required
              />
              <textarea
                placeholder="Escribe un mensaje romántico..."
                value={newMemory.message}
                onChange={(e) => setNewMemory(prev => ({ ...prev, message: e.target.value }))}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm h-28 resize-none"
              />
              <input
                type="date"
                value={newMemory.date}
                onChange={(e) => setNewMemory(prev => ({ ...prev, date: e.target.value }))}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm"
              />
              <div>
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" id="img-upload2" />
                <label 
                  htmlFor="img-upload2" 
                  className="block w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white/60 text-sm text-center cursor-pointer hover:bg-white/10 transition-all"
                >
                  {newMemory.image && !newMemory.image.startsWith('http') ? '✓ Imagen cargada' : '📷 Subir imagen'}
                </label>
              </div>
              <input
                type="text"
                placeholder="O pega un enlace de imagen..."
                value={newMemory.image?.startsWith('http') ? newMemory.image : ''}
                onChange={(e) => setNewMemory(prev => ({ ...prev, image: e.target.value }))}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-white/30"
              />
              <motion.button 
                type="submit" 
                className="w-full py-3 rounded-xl text-white font-medium flex items-center justify-center gap-2"
                style={{ background: 'linear-gradient(135deg, #ff6b9d 0%, #c084fc 100%)' }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Heart className="w-4 h-4" fill="white" />
                Crear Planeta
              </motion.button>
            </form>
          </motion.div>
        </motion.div>
      )}

      {!isSharedView && (
        <div className="fixed bottom-6 right-6 z-40 flex gap-3">
          <motion.button
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowGallery(true)}
            className="w-14 h-14 rounded-full flex items-center justify-center shadow-lg"
            style={{ background: 'linear-gradient(135deg, #c084fc 0%, #60a5fa 100%)' }}
          >
            <Heart className="w-6 h-6 text-white" fill="white" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowAdd(true)}
            className="w-14 h-14 rounded-full flex items-center justify-center shadow-lg"
            style={{ background: 'linear-gradient(135deg, #ff6b9d 0%, #c084fc 100%)' }}
          >
            <Plus className="w-6 h-6 text-white" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1, rotate: -5 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowExport(true)}
            className="w-14 h-14 rounded-full flex items-center justify-center glass-panel"
          >
            <Link className="w-5 h-5 text-white" />
          </motion.button>
        </div>
      )}

      {isSharedView && (
        <div className="fixed bottom-6 right-6 z-40">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowGallery(true)}
            className="w-14 h-14 rounded-full flex items-center justify-center shadow-lg"
            style={{ background: 'linear-gradient(135deg, #c084fc 0%, #60a5fa 100%)' }}
          >
            <Heart className="w-6 h-6 text-white" fill="white" />
          </motion.button>
        </div>
      )}

      {(musicUrl || sharedMusic) && (
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={toggleMusic}
          className="fixed bottom-6 left-6 z-40 w-12 h-12 rounded-full flex items-center justify-center glass-panel"
          initial={false}
          animate={{ scale: musicEnabled ? 1.1 : 1 }}
          style={{ 
            background: musicEnabled ? 'linear-gradient(135deg, #ff6b9d 0%, #c084fc 100%)' : undefined 
          }}
        >
          {musicEnabled ? (
            <Volume2 className="w-5 h-5 text-white" />
          ) : (
            <VolumeX className="w-5 h-5 text-white/60" />
          )}
        </motion.button>
      )}

      {(musicUrl?.includes('spotify') || sharedMusic?.includes('spotify')) && (() => {
          let url = (musicUrl || sharedMusic);
          if (url.includes('spotify.com')) {
            const match = url.match(/track\/([a-zA-Z0-9]+)/);
            if (match && match[1]) {
              url = `https://open.spotify.com/embed/track/${match[1]}?autoplay=1`;
            }
          }
          return (
            <iframe
              style={{ position: 'fixed', bottom: 80, left: 6, borderRadius: 12, opacity: musicEnabled ? 1 : 0.3 }}
              src={url}
              width="200"
              height="80"
              allow="autoplay; encrypted-media"
              title="Spotify"
            />
          );
        })()}

      {!isSharedView && (
        <>
          <input
            type="text"
            placeholder="Enlace de Spotify..."
            value={musicUrl.startsWith('http') ? musicUrl : ''}
            onChange={(e) => {
              setMusicUrl(e.target.value);
              if (e.target.value.includes('spotify')) {
                setMusicEnabled(true);
              }
            }}
            className="fixed bottom-20 left-6 z-40 px-3 py-2 rounded-lg glass-panel text-xs text-white w-48 placeholder-white/30"
            style={{ background: 'rgba(255,255,255,0.1)' }}
          />
        </>
      )}

      {showGallery && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: 'rgba(0,0,0,0.9)' }}
          onClick={() => setShowGallery(false)}
        >
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="glass-panel max-w-4xl w-full mx-4 p-6"
            style={{ borderRadius: '20px', maxHeight: '80vh', overflow: 'auto' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-light text-white">Galería de Recuerdos</h3>
              <button onClick={() => setShowGallery(false)}>
                <X className="w-6 h-6 text-white/50" />
              </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {memories.filter(m => m.image).map((memory, idx) => (
                <motion.div
                  key={memory.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="relative aspect-square rounded-xl overflow-hidden cursor-pointer"
                  onClick={() => {
                    setShowGallery(false);
                    handlePlanetClick(memory);
                  }}
                >
                  <img src={memory.image} alt={memory.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 flex items-end" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)' }}>
                    <p className="text-white text-sm p-3">{memory.title}</p>
                  </div>
                </motion.div>
              ))}
              {memories.filter(m => m.image).length === 0 && (
                <p className="col-span-full text-center text-white/50 py-8">
                  No hay imágenes todavía. ¡Agrega recuerdos con fotos!
                </p>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}

      {isSharedView && showWelcome && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: 'radial-gradient(ellipse at center, rgba(106, 27, 154, 0.3) 0%, rgba(0,0,0,0.95) 100%)' }}
          onClick={() => setShowWelcome(false)}
        >
          <motion.div
            initial={{ scale: 0.3, y: 100, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            transition={{ type: "spring", duration: 0.8, bounce: 0.4 }}
            className="glass-panel w-full mx-4 text-center relative"
            style={{ 
              borderRadius: '28px',
              border: '1px solid rgba(255,255,255,0.15)',
              boxShadow: '0 0 100px rgba(255, 107, 157, 0.5), 0 0 150px rgba(192, 132, 252, 0.35)',
              minWidth: '380px',
              maxWidth: '460px',
              padding: '40px 32px'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute inset-0 opacity-25 rounded-28px" style={{
              background: 'radial-gradient(circle at 30% 20%, #ff6b9d 0%, transparent 50%), radial-gradient(circle at 70% 80%, #c084fc 0%, transparent 50%)'
            }} />
            
            <div className="relative z-10 flex flex-col items-center" style={{ gap: '16px' }}>
              <motion.div
                animate={{ scale: [1, 1.12, 1], rotate: [0, 4, -4, 0] }}
                transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
              >
                <div className="w-24 h-24 rounded-full flex items-center justify-center" style={{
                  background: 'linear-gradient(135deg, #ff6b9d 0%, #c084fc 100%)',
                  boxShadow: '0 0 50px rgba(255, 107, 157, 0.7)'
                }}>
                  <Heart className="w-12 h-12 text-white" fill="white" />
                </div>
              </motion.div>
              
              <h2 className="text-2xl font-light text-white" style={{ 
                textShadow: '0 0 25px rgba(255, 107, 157, 0.6)',
                margin: 0
              }}>
                ¡Bienvenido!
              </h2>
              
              <div className="w-16 h-0.5 rounded-full" style={{
                background: 'linear-gradient(90deg, transparent, #ff6b9d, transparent)'
              }} />
              
              <p className="text-white/90 text-sm font-light" style={{ margin: 0 }}>
                {sharedTitle || 'Alguien especial ha compartido este universo contigo'}
              </p>
              
              <p className="text-white/50 text-xs" style={{ margin: 0 }}>
                Explora los planetas y descubre cada momento especial guardado con amor.
              </p>
              
              <button 
                onClick={() => setShowWelcome(false)}
                className="rounded-xl text-white font-medium relative overflow-hidden group"
                style={{ 
                  background: 'linear-gradient(135deg, #ff6b9d 0%, #c084fc 100%)',
                  boxShadow: '0 6px 25px rgba(255, 107, 157, 0.5)',
                  padding: '12px 32px',
                  fontSize: '14px',
                  marginTop: '8px'
                }}
              >
                <span className="relative z-10">Comenzar a Explorar</span>
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity" style={{
                  background: 'linear-gradient(135deg, #c084fc 0%, #ff6b9d 100%)'
                }} />
              </button>
              
              <p className="text-white/30 text-xs" style={{ margin: 0, marginTop: '4px' }}>
                Toca en cualquier lugar para cerrar
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}

      {isSharedView && (
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="fixed top-5 left-1/2 -translate-x-1/2 z-40 glass-panel px-8 py-4"
          style={{ borderRadius: '30px' }}
        >
          <div className="flex items-center gap-3">
            <Heart className="w-5 h-5 text-pink-500" fill="#ff6b9d" />
            <p className="text-white/80 text-sm font-light">
              <span className="font-medium">{sharedTitle || 'Universo de Recuerdos'}</span>
              <span className="text-white/40 mx-2">•</span>
              Una historia de amor compartida
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
}
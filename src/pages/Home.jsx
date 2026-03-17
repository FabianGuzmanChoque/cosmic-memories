import { useState, useEffect } from 'react';
import SolarSystem from '../components/SolarSystem';

export default function Home() {
  const [memories, setMemories] = useState([]);
  const [isSharedView, setIsSharedView] = useState(false);
  const [sharedTitle, setSharedTitle] = useState('');
  const [sharedMusic, setSharedMusic] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sharedData = params.get('shared');
    
    if (sharedData) {
      try {
        const decoded = JSON.parse(decodeURIComponent(atob(sharedData)));
        if (decoded.type === 'cosmic-memories' && decoded.memories) {
          setMemories(decoded.memories.map((m, i) => ({ ...m, id: Date.now() + i })));
          setIsSharedView(true);
          setSharedTitle(decoded.title || 'Universo de Recuerdos');
          if (decoded.music) {
            setSharedMusic(decoded.music);
          }
          return;
        }
      } catch (e) {
        console.error('Error parsing shared data', e);
      }
    }

    const saved = localStorage.getItem('memories');
    if (saved) {
      setMemories(JSON.parse(saved));
    } else {
      const defaultMemories = [
        {
          id: 1,
          title: 'El Comienzo',
          message: 'Donde todo cambió y nuestras estrellas comenzaron a brillar juntas.',
          date: '2024-01-15',
          image: null
        },
        {
          id: 2,
          title: 'Primera Cita',
          message: 'Esa tarde donde el tiempo se detuvo.',
          date: '2024-02-20',
          image: null
        },
        {
          id: 3,
          title: 'Viaje Juntos',
          message: 'Explorando el universo, uno al lado del otro.',
          date: '2024-06-10',
          image: null
        },
        {
          id: 4,
          title: 'Momentos Especiales',
          message: 'Pequeños fragmentos de eternidad compartida.',
          date: '2024-09-05',
          image: null
        }
      ];
      setMemories(defaultMemories);
      localStorage.setItem('memories', JSON.stringify(defaultMemories));
    }
  }, []);

  const handleAddMemory = (newMemory) => {
    const updated = [...memories, newMemory];
    setMemories(updated);
    localStorage.setItem('memories', JSON.stringify(updated));
  };

  const handleUpdateMemory = (updatedMemory) => {
    console.log('Updating memory:', updatedMemory);
    const updated = memories.map(m => m.id === updatedMemory.id ? updatedMemory : m);
    console.log('Updated memories:', updated);
    setMemories(updated);
    localStorage.setItem('memories', JSON.stringify(updated));
  };

  const handleDeleteMemory = (id) => {
    const updated = memories.filter(m => m.id !== id);
    setMemories(updated);
    localStorage.setItem('memories', JSON.stringify(updated));
  };

  return (
    <div className="w-full h-screen">
      <SolarSystem 
        memories={memories} 
        onAddMemory={handleAddMemory}
        onUpdateMemory={handleUpdateMemory}
        onDeleteMemory={handleDeleteMemory}
        isSharedView={isSharedView}
        sharedTitle={sharedTitle}
        sharedMusic={sharedMusic}
      />
    </div>
  );
}
import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import Input from './shared/Input';
import Button from './shared/Button';
import Card from './shared/Card';

const ParticipantForm = () => {
  const [name, setName] = useState('');
  const { addParticipant } = useAppContext();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      addParticipant(name);
      setName('');
    }
  };

  return (
    <Card>
      <h3 className="text-xl font-bold mb-4 text-cyan-300">1. Añadir Participantes</h3>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
        <Input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nombre del participante"
          required
        />
        <Button type="submit" variant="secondary" className="flex-shrink-0">Añadir</Button>
      </form>
      
      {/* --- BLOQUE DE CÓDIGO ELIMINADO ---
          Aquí antes se mostraba la lista de participantes. 
          Lo hemos quitado para mantener el anonimato. 
      */}

    </Card>
  );
};

export default ParticipantForm;

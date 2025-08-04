
import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import Input from './shared/Input';
import Button from './shared/Button';
import Card from './shared/Card';

const ParticipantForm = () => {
  const [name, setName] = useState('');
  const { addParticipant, participants } = useAppContext();

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
      {participants.length > 0 && (
        <div className="mt-4">
          <h4 className="font-semibold text-gray-300">Participantes registrados:</h4>
          <ul className="list-disc list-inside mt-2 text-gray-400">
            {participants.map(p => <li key={p.id}>{p.name}</li>)}
          </ul>
        </div>
      )}
    </Card>
  );
};

export default ParticipantForm;

import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import Input from './shared/Input';
import Button from './shared/Button';
import Card from './shared/Card';

const ParticipantForm = () => {
  const [name, setName] = useState('');
  // Pedimos el ID del juego y la función para añadir participantes
  const { addParticipant, game } = useAppContext();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = name.trim();
    if (trimmedName) {
      addParticipant(trimmedName);
      
      // --- ¡CAMBIO IMPORTANTE! ---
      // Guardamos el nombre de este jugador en su navegador, asociado a este juego.
      localStorage.setItem(`porra-musical-user-${game.id}`, trimmedName);
      // -----------------------------

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
          placeholder="Tu nombre de participante"
          required
        />
        <Button type="submit" variant="secondary" className="flex-shrink-0">Añadir</Button>
      </form>
    </Card>
  );
};

export default ParticipantForm;

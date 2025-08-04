import React, { useState } from 'react';
import Card from '../shared/Card';
import Button from '../shared/Button';
import Input from '../shared/Input';
import { Game, GameState } from '../../types';
import { TrophyIcon } from '../icons/Icons';

// --- NUEVO: AÑADIMOS LAS HERRAMIENTAS DE FIREBASE ---
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set } from 'firebase/database';
import { firebaseConfig } from '../../firebaseConfig';

// --- NUEVO: INICIALIZAMOS LA CONEXIÓN ---
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
// ----------------------------------------------------

const createNewGame = (name: string): Game => {
  return {
    id: crypto.randomUUID(),
    name,
    gameState: GameState.SUBMISSION,
    participants: [],
    songs: [],
    votes: [],
  };
};

const HomeView = () => {
  const [gameName, setGameName] = useState('');
  const [joinGameId, setJoinGameId] = useState('');

  const handleCreateGame = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = gameName.trim();
    if (!trimmedName) return;
    
    const newGame = createNewGame(trimmedName);

    // --- CAMBIO IMPORTANTE: GUARDAMOS EN FIREBASE ---
    // En lugar de localStorage, usamos la función 'set' de Firebase
    const gameRef = ref(db, 'games/' + newGame.id);
    await set(gameRef, newGame);
    // ------------------------------------------------

    // Esto te redirige a la nueva partida
    window.location.hash = `/game/${newGame.id}`;
  };

  const handleJoinGame = (e: React.FormEvent) => {
    e.preventDefault();
    let gameId = joinGameId.trim();
    if (!gameId) return;

    const urlParts = gameId.split('#/game/');
    if (urlParts.length > 1) {
      gameId = urlParts[1];
    }
    
    window.location.hash = `/game/${gameId}`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white p-4">
      <div className="w-full max-w-md mx-auto">
        <header className="py-6 text-center">
            <div className="flex justify-center items-center gap-4">
            <TrophyIcon className="w-10 h-10 text-yellow-400" />
            <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
                La Porra Musical
            </h1>
            </div>
            <p className="mt-2 text-lg text-gray-400">Crea una partida o únete a una existente</p>
        </header>

        <div className="space-y-8">
            <Card>
                <h2 className="text-2xl font-bold mb-4 text-cyan-300">Crear Nueva Partida</h2>
                <form onSubmit={handleCreateGame} className="space-y-4">
                    <Input
                        type="text"
                        value={gameName}
                        onChange={(e) => setGameName(e.target.value)}
                        placeholder="Ej: Porra Musical de Verano"
                        required
                    />
                    <Button type="submit" className="w-full">Crear Juego</Button>
                </form>
            </Card>

            <Card>
                <h2 className="text-2xl font-bold mb-4 text-cyan-300">Unirse a una Partida</h2>
                 <form onSubmit={handleJoinGame} className="space-y-4">
                    <Input
                        type="text"
                        value={joinGameId}
                        onChange={(e) => setJoinGameId(e.target.value)}
                        placeholder="Pega el enlace o ID del juego aquí"
                        required
                    />
                    <Button type="submit" variant="secondary" className="w-full">Unirse al Juego</Button>
                </form>
            </Card>
        </div>
      </div>
    </div>
  );
};

export default HomeView;

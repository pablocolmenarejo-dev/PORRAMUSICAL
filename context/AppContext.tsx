import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { AppContextType, Game, GameState, Participant, Song, Vote } from '../types';
import Button from '../components/shared/Button';
import Card from '../components/shared/Card';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue, set } from 'firebase/database';
import { firebaseConfig } from '../firebaseConfig';

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children, gameId }: { children: ReactNode; gameId: string }) => {
  const [game, setGame] = useState<Game | null>(null);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const gameRef = ref(db, 'games/' + gameId);

    onValue(gameRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const sanitizedGame = {
          ...data,
          participants: data.participants || [],
          songs: data.songs || [],
          votes: data.votes || [],
          revealedSongIds: data.revealedSongIds || [],
        };
        setGame(sanitizedGame);
        setError('');
      } else {
        setGame(null);
        setError(`Juego con ID "${gameId}" no encontrado.`);
      }
      setLoading(false);
    });
  }, [gameId]);

  const updateGameInDb = (updatedGame: Game) => {
    const gameRef = ref(db, 'games/' + updatedGame.id);
    set(gameRef, updatedGame);
  };

  const updateGame = (updater: (draft: Game) => Game) => {
    if (game) {
      const updatedGame = updater(game);
      updateGameInDb(updatedGame);
    }
  };

  const addParticipant = (name: string) => {
    updateGame(draft => {
      if (name.trim() && !draft.participants.some(p => p.name.toLowerCase() === name.toLowerCase())) {
        const newParticipant: Participant = { id: crypto.randomUUID(), name: name.trim() };
        return { ...draft, participants: [...draft.participants, newParticipant] };
      }
      return draft;
    });
  };

  const addSong = (song: Omit<Song, 'id'>) => {
    updateGame(draft => {
      const newSong: Song = { ...song, id: crypto.randomUUID() };
      return { ...draft, songs: [...draft.songs, newSong] };
    });
  };

  const castVote = (vote: Vote) => {
    updateGame(draft => {
      const newVotes = [...draft.votes];
      const existingVoteIndex = newVotes.findIndex(v => v.voterId === vote.voterId && v.songId === vote.songId);
      if (existingVoteIndex !== -1) {
        newVotes[existingVoteIndex] = vote;
      } else {
        newVotes.push(vote);
      }
      return { ...draft, votes: newVotes };
    });
  };

  const setGameState = (state: GameState) => {
    updateGame(draft => ({ ...draft, gameState: state }));
  };

  const revealSong = (songId: string) => {
    updateGame(draft => {
      if (!draft.revealedSongIds.includes(songId)) {
        return { ...draft, revealedSongIds: [...draft.revealedSongIds, songId] };
      }
      return draft;
    });
  };

  const resetGame = () => {
    updateGame(draft => ({
      ...draft,
      gameState: GameState.SUBMISSION,
      songs: [],
      participants: [],
      votes: [],
      revealedSongIds: [],
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
          <p>Cargando juego desde la base de datos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="text-center">
            <h2 className="text-2xl font-bold text-red-500 mb-4">Error</h2>
            <p className="text-gray-300 mb-6">{error}</p>
            <Button onClick={() => window.location.hash = ''} variant="secondary">
                Volver al Inicio
            </Button>
        </Card>
      </div>
    );
  }
  
  if (!game) return null;

  const value: AppContextType = {
    game,
    gameState: game.gameState,
    songs: game.songs,
    participants: game.participants,
    votes: game.votes,
    addSong,
    addParticipant,
    castVote,
    setGameState,
    resetGame,
    revealSong,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

// --- FUNCIÓN CORREGIDA ---
// La exportación que faltaba ha sido restaurada.
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

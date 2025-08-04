import React, { createContext, useContext, useState, ReactNode, useCallback, useEffect } from 'react';
import { AppContextType, Game, GameState, Participant, Song, Vote } from '../types';
import Button from '../components/shared/Button';
import Card from '../components/shared/Card';

const getGameFromStorage = (gameId: string): Game | null => {
  try {
    const gameJson = localStorage.getItem(`porra-musical-game-${gameId}`);
    return gameJson ? JSON.parse(gameJson) : null;
  } catch (error) {
    console.error("Failed to parse game data from localStorage", error);
    return null;
  }
};

const saveGameToStorage = (game: Game) => {
  localStorage.setItem(`porra-musical-game-${game.id}`, JSON.stringify(game));
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children, gameId }: { children: ReactNode; gameId: string }) => {
  const [game, setGame] = useState<Game | null>(() => getGameFromStorage(gameId));
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const loadedGame = getGameFromStorage(gameId);
    if (loadedGame) {
      setGame(loadedGame);
      setError('');
    } else {
      setGame(null);
      setError(`Juego con ID "${gameId}" no encontrado. Es posible que el enlace sea incorrecto o el juego haya sido borrado.`);
    }
  }, [gameId]);

  useEffect(() => {
    if (game) {
      saveGameToStorage(game);
    }
  }, [game]);

  const updateGame = (updater: (draft: Game) => Game) => {
    setGame(prevGame => {
        if (!prevGame) return null;
        return updater(prevGame);
    });
  };

  const addParticipant = useCallback((name: string) => {
    updateGame(draft => {
      if (name.trim() && !draft.participants.some(p => p.name.toLowerCase() === name.toLowerCase())) {
        const newParticipant: Participant = { id: crypto.randomUUID(), name: name.trim() };
        return { ...draft, participants: [...draft.participants, newParticipant] };
      }
      return draft;
    });
  }, []);

  const addSong = useCallback((song: Omit<Song, 'id'>) => {
    updateGame(draft => {
      const newSong: Song = { ...song, id: crypto.randomUUID() };
      return { ...draft, songs: [...draft.songs, newSong] };
    });
  }, []);

  const castVote = useCallback((vote: Vote) => {
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
  }, []);

  const setGameState = useCallback((state: GameState) => {
    updateGame(draft => ({ ...draft, gameState: state }));
  }, []);

  const resetGame = useCallback(() => {
    updateGame(draft => ({
      ...draft,
      gameState: GameState.SUBMISSION,
      songs: [],
      participants: [],
      votes: [],
    }));
  }, []);

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

  if (!game) {
    return (
        <div className="min-h-screen flex items-center justify-center">
            <p>Cargando juego...</p>
        </div>
    );
  }

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
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

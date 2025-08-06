// pablocolmenarejo-dev/porramusical/PORRAMUSICAL-fa8abcd5a6b39b83eda823564e73e90c00f60fbc/types.ts

export interface Song {
  id: string;
  title: string;
  artist: string;
  youtubeUrl: string;
  submittedBy: string; // Participant ID
}

export interface Participant {
  id: string;
  name: string;
}

export interface Vote {
  voterId: string; // Participant ID
  songId: string;
  guessedParticipantId: string;
}

export enum GameState {
  SUBMISSION = 'SUBMISSION',
  VOTING = 'VOTING',
  REVEAL = 'REVEAL',
  RESULTS = 'RESULTS',
}

export interface Game {
  id: string;
  name: string;
  gameState: GameState;
  songs: Song[];
  participants: Participant[];
  votes: Vote[];
  creatorId: string; // ID del creador/moderador
  revealedSongIds: string[]; // IDs de las canciones reveladas
}

export interface AppContextType {
  game: Game | null;
  gameState: GameState;
  songs: Song[];
  participants: Participant[];
  votes: Vote[];
  addSong: (song: Omit<Song, 'id'>) => void;
  addParticipant: (name: string) => void;
  castVote: (vote: Vote) => void;
  setGameState: (state: GameState) => void;
  resetGame: () => void;
  revealSong: (songId: string) => void; // Nueva función
}

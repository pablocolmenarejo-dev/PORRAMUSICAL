import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { GameState, Vote } from '../../types';
import Button from '../shared/Button';
import Card from '../shared/Card';
import { MusicNoteIcon } from '../icons/Icons';

const getYouTubeThumbnail = (url: string): string | null => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    const videoId = (match && match[2].length === 11) ? match[2] : null;

    if (videoId) {
        return `https://img.youtube.com/vi/${videoId}/sddefault.jpg`;
    }
    return null;
};


const VotingView = () => {
  const { participants, songs, castVote, setGameState, votes } = useAppContext();
  const [currentVoterId, setCurrentVoterId] = useState<string>('');

  const handleVote = (songId: string, guessedParticipantId: string) => {
    if (!currentVoterId) return;
    const vote: Vote = { voterId: currentVoterId, songId, guessedParticipantId };
    castVote(vote);
  };
  
  const getVoteForSong = (songId: string) => {
    return votes.find(v => v.voterId === currentVoterId && v.songId === songId)?.guessedParticipantId || '';
  }
  
  if (!currentVoterId) {
    return (
      <Card className="max-w-md mx-auto text-center">
        <h2 className="text-2xl font-bold mb-4 text-cyan-300">¿Quién está votando?</h2>
        <select
          onChange={(e) => setCurrentVoterId(e.target.value)}
          value={currentVoterId}
          className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 mb-4"
        >
          <option value="">Selecciona tu nombre para votar...</option>
          {participants.map(p => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
      </Card>
    );
  }

  const votesByCurrentUser = votes.filter(v => v.voterId === currentVoterId && v.guessedParticipantId).length;
  const allVotesIn = participants.every(p => 
      votes.filter(v => v.voterId === p.id && v.guessedParticipantId).length === songs.length
  );
  
  const guessedParticipantIds = new Set(
    votes
      .filter(v => v.voterId === currentVoterId && v.guessedParticipantId)
      .map(v => v.guessedParticipantId)
  );

  return (
    <div className="space-y-8">
      <Card>
        <div className="flex flex-wrap justify-between items-center gap-2">
            <h2 className="text-2xl font-bold text-cyan-300">
                Turno de <span className="text-white">{participants.find(p => p.id === currentVoterId)?.name}</span>
            </h2>
            <Button variant="secondary" onClick={() => setCurrentVoterId('')}>Cambiar de votante</Button>
        </div>
        <p className="text-gray-400 mt-1">Asigna cada canción a la persona que crees que la trajo.</p>
        <p className="text-sm text-purple-400 mt-1">Progreso: {votesByCurrentUser}/{songs.length} votos emitidos.</p>

        <div className="mt-4 pt-4 border-t border-gray-700/50">
            <h4 className="font-semibold text-gray-300 mb-3">Participantes a asignar:</h4>
            {participants.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                {participants.map(participant => (
                    <span
                    key={participant.id}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-all duration-300 ease-in-out ${
                        guessedParticipantIds.has(participant.id)
                        ? 'bg-green-500/80 text-white line-through decoration-2 decoration-black/50'
                        : 'bg-gray-700 text-gray-300'
                    }`}
                    >
                    {participant.name}
                    </span>
                ))}
                </div>
            ) : (
                <p className="text-sm text-gray-500">No hay participantes para asignar.</p>
            )}
        </div>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {songs.map(song => {
          const thumbnailUrl = getYouTubeThumbnail(song.youtubeUrl);
          return (
             <Card key={song.id} className="!p-0 flex flex-col overflow-hidden bg-gray-800">
                {thumbnailUrl ? (
                    <img
                        src={thumbnailUrl}
                        alt={`Carátula de ${song.title}`}
                        className="w-full h-48 object-cover"
                        loading="lazy"
                    />
                ) : (
                    <div className="w-full h-48 bg-gray-700 flex items-center justify-center">
                        <MusicNoteIcon className="w-12 h-12 text-gray-500" />
                    </div>
                )}
                <div className="p-4 flex flex-col flex-grow">
                    <div className="flex-grow">
                        <h3 className="font-bold text-lg truncate" title={song.title}>{song.title}</h3>
                        <p className="text-gray-400 mb-4">{song.artist}</p>
                    </div>
                    <select
                        value={getVoteForSong(song.id)}
                        onChange={(e) => handleVote(song.id, e.target.value)}
                        className="w-full px-4 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                        <option value="">¿Quién la trajo?</option>
                        {participants.map(p => (
                            <option key={p.id} value={p.id}>{p.name}</option>
                        ))}
                    </select>
                </div>
            </Card>
          );
        })}
      </div>
      
      <div className="text-center mt-8">
        <Button onClick={() => setGameState(GameState.REVEAL)} disabled={!allVotesIn}>
          Iniciar la Revelación
        </Button>
        {!allVotesIn && <p className="text-yellow-400 mt-2 text-sm">Todos los participantes deben votar por todas las canciones para continuar.</p>}
      </div>
    </div>
  );
};

export default VotingView;
import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../context/AppContext';
import { GameState, Vote } from '../../types';
import Button from '../shared/Button';
import Card from '../shared/Card';
import { MusicNoteIcon } from '../icons/Icons';

const getYouTubeVideoId = (url: string): string | null => {
    if (!url) return null;
    let videoId = null;
    // Expresiones regulares para varios formatos de URL de YouTube
    const regexps = [
        /(?:\?v=|&v=|\/embed\/|\/v\/|http:\/\/googleusercontent.com\/http:\/\/googleusercontent.com\/youtube.com\/0\/7\/)([^&#?]+)/,
        /(?:http:\/\/googleusercontent.com\/http:\/\/googleusercontent.com\/youtube.com\/0\/6\/)[^/]*\?id=([^&]+)/,
        /youtu\.be\/([^&#?]+)/
    ];
    for (const re of regexps) {
        const match = url.match(re);
        if (match && match[1]) {
            videoId = match[1];
            break;
        }
    }
    return videoId && videoId.length === 11 ? videoId : null;
};

const getYouTubeEmbedUrl = (url: string): string | null => {
    const videoId = getYouTubeVideoId(url);
    return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
};


const VotingView = () => {
  const { game, participants, songs, castVote, setGameState, votes } = useAppContext();
  const [currentVoterId, setCurrentVoterId] = useState<string>('');
  const [localParticipantName, setLocalParticipantName] = useState<string | null>(null);

  // Al cargar, identifica al usuario guardado en el navegador para este juego
  useEffect(() => {
    if (game) {
      // Busca el nombre de usuario guardado en localStorage
      const savedUser = localStorage.getItem(`porra-musical-user-${game.id}`);
      if (savedUser) {
        setLocalParticipantName(savedUser);
        const participant = participants.find(p => p.name === savedUser);
        if (participant) {
            // Si encuentra al participante, establece su ID para la votación
            setCurrentVoterId(participant.id);
        }
      }
    }
  }, [game, participants]);

  const handleVote = (songId: string, guessedParticipantId: string) => {
    if (!currentVoterId) return;
    const vote: Vote = { voterId: currentVoterId, songId, guessedParticipantId };
    castVote(vote);
  };

  const getVoteForSong = (songId: string) => {
    const vote = votes.find(v => v.voterId === currentVoterId && v.songId === songId);
    return vote ? vote.guessedParticipantId : '';
  };

  const guessedParticipantIds = new Set(votes.filter(v => v.voterId === currentVoterId && v.guessedParticipantId).map(v => v.guessedParticipantId));
  
  const allVotesIn = participants.length > 0 && songs.length > 0 && participants.every(p => 
    songs.every(s => votes.some(v => v.voterId === p.id && v.songId === s.id))
  );

  return (
    <div className="space-y-8">
      <Card>
        <div>
            {localParticipantName ? (
                <>
                    <h2 className="text-2xl font-bold text-cyan-300">Turno de {localParticipantName}</h2>
                    <p className="text-gray-400 mt-1">Asigna cada canción a la persona que crees que la trajo.</p>
                </>
            ) : (
                <>
                    <h2 className="text-2xl font-bold text-cyan-300">Modo Espectador</h2>
                    <p className="text-yellow-400 mt-1">No te has unido como participante. No puedes votar.</p>
                </>
            )}

            {currentVoterId && (
                <p className="text-sm text-gray-500 mt-1">
                    Progreso: {votes.filter(v => v.voterId === currentVoterId).length}/{songs.length} votos emitidos.
                </p>
            )}
        </div>
        <div className="mt-4 pt-4 border-t border-gray-700/50">
            <h4 className="font-semibold text-gray-300 mb-3">Participantes a asignar:</h4>
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
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {songs.map(song => {
          const embedUrl = getYouTubeEmbedUrl(song.youtubeUrl);
          return (
             <Card key={song.id} className="!p-0 flex flex-col overflow-hidden bg-gray-800">
                <div className="w-full h-48 bg-gray-900">
                {embedUrl ? (
                    <iframe
                        src={embedUrl}
                        title={song.title}
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        loading="lazy"
                    ></iframe>
                ) : (
                    <div className="w-full h-48 flex items-center justify-center">
                        <p className="text-xs text-gray-400 px-4 text-center">No se pudo generar la vista previa del vídeo.</p>
                    </div>
                )}
                </div>
                <div className="p-4 flex flex-col flex-grow">
                    <div className="flex-grow">
                        <h3 className="font-bold text-lg truncate" title={song.title}>{song.title}</h3>
                        <p className="text-gray-400 mb-4">{song.artist}</p>
                    </div>
                    <select
                        value={getVoteForSong(song.id)}
                        onChange={(e) => handleVote(song.id, e.target.value)}
                        className="w-full px-4 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                        // El desplegable se deshabilita si el usuario no es un participante válido
                        disabled={!currentVoterId}
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
            {!allVotesIn && (
                <p className="text-xs text-yellow-400 mt-2">
                    Todos los participantes deben votar por todas las canciones para continuar.
                </p>
            )}
        </div>
    </div>
  );
};

export default VotingView;

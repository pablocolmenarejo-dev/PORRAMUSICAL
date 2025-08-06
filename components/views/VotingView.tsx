import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../context/AppContext';
import { GameState, Vote } from '../../types';
import Button from '../shared/Button';
import Card from '../shared/Card';
import { MusicNoteIcon } from '../icons/Icons';

const getYouTubeVideoId = (url: string): string | null => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
};

const getYouTubeThumbnail = (url: string): string | null => {
    const videoId = getYouTubeVideoId(url);
    return videoId ? \`https://img.youtube.com/vi/\${videoId}/sddefault.jpg\` : null;
};

const getYouTubeEmbedUrl = (url: string): string | null => {
    const videoId = getYouTubeVideoId(url);
    return videoId ? \`https://www.youtube.com/embed/\${videoId}\` : null;
};

const VotingView = () => {
  const { game, participants, songs, castVote, setGameState, votes } = useAppContext();
  const [currentVoterId, setCurrentVoterId] = useState<string>('');
  const [localParticipantName, setLocalParticipantName] = useState<string | null>(null);

  useEffect(() => {
    if (game) {
      const savedUser = localStorage.getItem(\`porra-musical-user-\${game.id}\`);
      setLocalParticipantName(savedUser);
      const participant = participants.find(p => p.name === savedUser);
      if (participant) {
        setCurrentVoterId(participant.id);
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

  return (
    <div className="space-y-8">
       <Card>
        <div className="flex justify-between items-start">
            <div>
                <h2 className="text-2xl font-bold text-cyan-300">¡A votar!</h2>
                <p className="text-gray-400 mt-1">Adivina quién ha enviado cada canción.</p>
            </div>
            <div className="text-right">
                <label htmlFor="voter-select" className="block text-sm font-medium text-gray-400 mb-1">Votando como:</label>
                <select
                    id="voter-select"
                    value={currentVoterId}
                    onChange={(e) => setCurrentVoterId(e.target.value)}
                    className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-1 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                    <option value="">Selecciona tu nombre</option>
                    {participants.map(p => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                </select>
            </div>
        </div>
        <div className="mt-4 pt-4 border-t border-gray-700/50">
            <h4 className="font-semibold text-gray-300 mb-3">Participantes a asignar:</h4>
            {participants.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                {participants.map(participant => (
                    <span
                    key={participant.id}
                    className={\`px-3 py-1 rounded-full text-sm font-medium transition-all duration-300 ease-in-out \${
                        guessedParticipantIds.has(participant.id)
                        ? 'bg-green-500/80 text-white line-through decoration-2 decoration-black/50'
                        : 'bg-gray-700 text-gray-300'
                    }\`}
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
          const embedUrl = getYouTubeEmbedUrl(song.youtubeUrl);
          const thumbnailUrl = getYouTubeThumbnail(song.youtubeUrl);
          return (
             <Card key={song.id} className="!p-0 flex flex-col overflow-hidden bg-gray-800">
                {embedUrl ? (
                    <div className="w-full h-48">
                        <iframe
                            src={embedUrl}
                            title={song.title}
                            className="w-full h-full"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        ></iframe>
                    </div>
                ) : thumbnailUrl ? (
                    <img
                        src={thumbnailUrl}
                        alt={\`Carátula de \${song.title}\`}
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
    </div>
  );
};

export default VotingView;

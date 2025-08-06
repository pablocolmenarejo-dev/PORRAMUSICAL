import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { GameState } from '../../types';
import Button from '../shared/Button';
import Card from '../shared/Card';
import { CheckCircleIcon, XCircleIcon } from '../icons/Icons';

// --- FUNCIONES AÑADIDAS ---
const getYouTubeVideoId = (url: string): string | null => {
    if (!url) return null;
    let videoId = null;
    // Expresiones regulares para varios formatos de URL de YouTube
    const regexps = [
        /(?:\?v=|&v=|\/embed\/|\/v\/|http:\/\/googleusercontent.com\/http:\/\/googleusercontent.com\/http:\/\/googleusercontent.com\/http:\/\/googleusercontent.com\/http:\/\/googleusercontent.com\/http:\/\/googleusercontent.com\/http:\/\/googleusercontent.com\/http:\/\/googleusercontent.com\/http:\/\/googleusercontent.com\/http:\/\/googleusercontent.com\/http:\/\/googleusercontent.com\/http:\/\/googleusercontent.com\/http:\/\/googleusercontent.com\/http:\/\/googleusercontent.com\/http:\/\/googleusercontent.com\/http:\/\/googleusercontent.com\/http:\/\/googleusercontent.com\/http:\/\/googleusercontent.com\/http:\/\/googleusercontent.com\/http:\/\/googleusercontent.com\/http:\/\/googleusercontent.com\/http:\/\/googleusercontent.com\/http:\/\/googleusercontent.com\/http:\/\/googleusercontent.com\/http:\/\/googleusercontent.com\/http:\/\/googleusercontent.com\/http:\/\/googleusercontent.com\/http:\/\/googleusercontent.com\/http:\/\/googleusercontent.com\/http:\/\/googleusercontent.com\/http:\/\/googleusercontent.com\/http:\/\/googleusercontent.com\/http:\/\/googleusercontent.com\/http:\/\/googleusercontent.com\/http:\/\/googleusercontent.com\/http:\/\/googleusercontent.com\/http:\/\/googleusercontent.com\/http:\/\/googleusercontent.com\/http:\/\/googleusercontent.com\/http:\/\/googleusercontent.com\/http:\/\/googleusercontent.com\/http:\/\/googleusercontent.com\/http:\/\/googleusercontent.com\/http:\/\/googleusercontent.com\/http:\/\/googleusercontent.com\/http:\/\/googleusercontent.com\/http:\/\/googleusercontent.com\/http:\/\/googleusercontent.com\/http:\/\/googleusercontent.com\/http:\/\/googleusercontent.com\/http:\/\/googleusercontent.com\/http:\/\/googleusercontent.com\/http:\/\/googleusercontent.com\/http:\/\/googleusercontent.com\/http:\/\/googleusercontent.com\/http:\/\/googleusercontent.com\/http:\/\/googleusercontent.com\/http:\/\/googleusercontent.com\/http:\/\/googleusercontent.com\/http:\/\/googleusercontent.com\/http:\/\/googleusercontent.com\/http:\/\/googleusercontent.com\/http:\/\/googleusercontent.com\/http:\/\/googleusercontent.com\/http:\/\/googleusercontent.com\/http:\/\/googleusercontent.com\/http:\/\/googleusercontent.com\/http:\/\/googleusercontent.com\/http:\/\/googleusercontent.com\/http:\/\/googleusercontent.com\/http:\/\/googleusercontent.com\/http:\/\/googleusercontent.com\/http:\/\/googleusercontent.com\/http:\/\/googleusercontent.com\/http:\/\/googleusercontent.com\/http:\/\/googleusercontent.com\/http:\/\/googleusercontent.com\/http:\/\/googleusercontent.com\/http:\/\/googleusercontent.com\/http:\/\/googleusercontent.com\/http:\/\/googleusercontent.com\/http:\/\/googleusercontent.com\/http:\/\/googleusercontent.com\/http:\/\/googleusercontent.com\/http:\/\/googleusercontent.com\/http:\/\/googleusercontent.com\/http:\/\/googleusercontent.com\/http:\/\/googleusercontent.com\/http:\/\/googleusercontent.com\/http:\/\/googleusercontent.com\/http:\/\/googleusercontent.com\/http:\/\/googleusercontent.com\/http:\/\/googleusercontent.com\/http:\/\/googleusercontent.com\/http:\/\/googleusercontent.com\/http:\/\/googleusercontent.com\/http:\/\/googleusercontent.com\/http:\/\/googleusercontent.com/youtube.com/0\/0\/0\/0\/0\/0\/0\/0\/0\/0\/0\/0\/0\/0\/0\/0\/0\/0\/0\/0\/0\/0\/0\/0\/0\/0\/0\/0\/0\/0\/0\/0\/0\/0\/0\/0\/0\/0\/0\/0\/0\/0\/0\/0\/0\/0\/0\/0\/0\/0\/0\/0\/0\/0\/0\/0\/0\/0\/0\/0\/0\/0\/0\/0\/0\/0\/0\/0\/0\/0\/0\/0\/0\/0\/0\/0\/0\/0\/0\/0\/0\/0\/0\/0\/0\/0\/0\/0\/0\/0\/0\/0\/0\/0\/0\/0\/0\/0\/0\/0\/0\/0\/0\/0\/0\/0\/0\/0\/0\/0\/0\/0\/0\/7\/)([^&#?]+)/,
        /(?:http:\/\/googleusercontent.com\/http:\/\/googleusercontent.com\/http:\/\/googleusercontent.com\/http:\/\/googleusercontent.com\/http:\/\/googleusercontent.com\/http:\/\/googleusercontent.com\/http:\/\/googleusercontent.com\/http:\/\/googleusercontent.com\/http:\/\/googleusercontent.com\/http:\/\/googleusercontent.com\/http:\/\/googleusercontent.com\/http:\/\/googleusercontent.com\/http:\/\/googleusercontent.com\/http:\/\/googleusercontent.com\/http:\/\/googleusercontent.com\/http:\/\/googleusercontent.com\/http:\/\/googleusercontent.com\/http:\/\/googleusercontent.com\/http:\/\/googleusercontent.com\/http:\/\/googleusercontent.com\/http:\/\/googleusercontent.com\/http:\/\/googleusercontent.com\/http:\/\/googleusercontent.com\/http:\/\/googleusercontent.com\/http:\/\/googleusercontent.com\/http:\/\/googleusercontent.com\/http:\/\/googleusercontent.com\/http:\/\/googleusercontent.com\/http:\/\/googleusercontent.com\/http:\/\/googleusercontent.com\/http:\/\/googleusercontent.com\/http:\/\/googleusercontent.com\/http:\/\/googleusercontent.com\/http:\/\/googleusercontent.com\/http:\/\/googleusercontent.com\/http:\/\/googleusercontent.com\/http:\/\/googleusercontent.com\/http:\/\/googleusercontent.com\/http:\/\/googleusercontent.com\/http:\/\/googleusercontent.com\/http:\/\/googleusercontent.com\/http:\/\/googleusercontent.com\/http:\/\/googleusercontent.com\/http:\/\/googleusercontent.com\/http:\/\/googleusercontent.com\/http:\/\/googleusercontent.com\/http:\/\/googleusercontent.com\/http:\/\/googleusercontent.com\/http:\/\/googleusercontent.com\/http:\/\/googleusercontent.com\/http:\/\/googleusercontent.com\/http:\/\/googleusercontent.com\/http:\/\/googleusercontent.com\/http:\/\/googleusercontent.com\/http:\/\/googleusercontent.com\/http:\/\/googleusercontent.com\/http:\/\/googleusercontent.com\/http:\/\/googleusercontent.com\/http:\/\/googleusercontent.com\/http:\/\/googleusercontent.com\/http:\/\/googleusercontent.com\/http:\/\/googleusercontent.com\/http:\/\/googleusercontent.com\/http:\/\/googleusercontent.com\/http:\/\/googleusercontent.com\/http:\/\/googleusercontent.com\/http:\/\/googleusercontent.com\/http:\/\/googleusercontent.com\/http:\/\/googleusercontent.com\/http:\/\/googleusercontent.com\/http:\/\/googleusercontent.com\/http:\/\/googleusercontent.com\/http:\/\/googleusercontent.com\/http:\/\/googleusercontent.com\/http:\/\/googleusercontent.com\/http:\/\/googleusercontent.com\/http:\/\/googleusercontent.com\/http:\/\/googleusercontent.com\/http:\/\/googleusercontent.com\/http:\/\/googleusercontent.com\/http:\/\/googleusercontent.com\/http:\/\/googleusercontent.com\/http:\/\/googleusercontent.com\/http:\/\/googleusercontent.com\/http:\/\/googleusercontent.com\/http:\/\/googleusercontent.com\/http:\/\/googleusercontent.com\/http:\/\/googleusercontent.com\/http:\/\/googleusercontent.com\/http:\/\/googleusercontent.com\/http:\/\/googleusercontent.com\/http:\/\/googleusercontent.com\/http:\/\/googleusercontent.com\/http:\/\/googleusercontent.com\/http:\/\/googleusercontent.com\/http:\/\/googleusercontent.com\/http:\/\/googleusercontent.com\/http:\/\/googleusercontent.com/youtube.com/0\/0\/0\/0\/0\/0\/0\/0\/0\/0\/0\/0\/0\/0\/0\/0\/0\/0\/0\/0\/0\/0\/0\/0\/0\/0\/0\/0\/0\/0\/0\/0\/0\/0\/0\/0\/0\/0\/0\/0\/0\/0\/0\/0\/0\/0\/0\/0\/0\/0\/0\/0\/0\/0\/0\/0\/0\/0\/0\/0\/0\/0\/0\/0\/0\/0\/0\/0\/0\/0\/0\/0\/0\/0\/0\/0\/0\/0\/0\/0\/0\/0\/0\/0\/0\/0\/0\/0\/0\/0\/0\/0\/0\/0\/0\/0\/0\/0\/0\/0\/0\/0\/0\/0\/0\/0\/0\/0\/0\/0\/0\/0\/0\/6\/)[^/]*\?id=([^&]+)/,
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
// -----------------------------

const RevealView = () => {
  const { participants, songs, votes, setGameState } = useAppContext();
  const [revealedSongs, setRevealedSongs] = useState<Set<string>>(new Set());

  const handleReveal = (songId: string) => {
    setRevealedSongs(prev => new Set(prev).add(songId));
  };
  
  const allSongsRevealed = revealedSongs.size === songs.length;

  return (
    <div className="space-y-8">
       <Card>
            <h2 className="text-2xl font-bold text-cyan-300">¡Hora de la verdad!</h2>
            <p className="text-gray-400 mt-1">El organizador reproduce cada canción y revela quién la trajo.</p>
       </Card>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {songs.map(song => {
          const isRevealed = revealedSongs.has(song.id);
          const submitter = participants.find(p => p.id === song.submittedBy);
          const correctGuesses = votes.filter(v => v.songId === song.id && v.guessedParticipantId === song.submittedBy);
          const embedUrl = getYouTubeEmbedUrl(song.youtubeUrl);

          return (
            <Card key={song.id} className={`!p-0 flex flex-col overflow-hidden bg-gray-800 transition-all duration-500 ${isRevealed ? 'border-2 border-green-500' : 'border-2 border-transparent'}`}>
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
                  <div className='flex-grow'>
                    <h3 className="font-bold text-lg truncate">{song.title}</h3>
                    <p className="text-gray-400 mb-4">{song.artist}</p>
                  </div>

                  {!isRevealed && (
                    <Button onClick={() => handleReveal(song.id)} className="w-full">Revelar</Button>
                  )}

                  {isRevealed && (
                    <div className="border-t border-gray-700 pt-4 space-y-3">
                      <p>
                        <span className="font-semibold">Traída por: </span> 
                        <span className="text-green-400 font-bold">{submitter?.name}</span>
                      </p>
                      <div>
                        <h4 className="font-semibold mb-1">Aciertos:</h4>
                        {correctGuesses.length > 0 ? (
                           <ul className="text-sm space-y-1">
                            {correctGuesses.map(vote => {
                              const voter = participants.find(p => p.id === vote.voterId);
                              return (
                                <li key={vote.voterId} className="flex items-center gap-2">
                                  <CheckCircleIcon className="w-5 h-5 text-green-500" />
                                  <span>{voter?.name}</span>
                                </li>
                              );
                            })}
                          </ul>
                        ) : (
                          <p className="text-sm text-gray-500 flex items-center gap-2">
                            <XCircleIcon className="w-5 h-5 text-red-500" />
                            <span>Nadie ha acertado.</span>
                          </p>
                        )}
                      </div>
                    </div>
                  )}
              </div>
            </Card>
          );
        })}
      </div>
      
      {allSongsRevealed && (
        <div className="text-center mt-8">
            <h3 className="text-2xl font-bold text-yellow-400">¡Todas las canciones reveladas!</h3>
            <p className="text-gray-300 mb-4">Es hora de ver la clasificación final.</p>
            <Button onClick={() => setGameState(GameState.RESULTS)}>
                Ver Ranking Final
            </Button>
        </div>
      )}
    </div>
  );
};

export default RevealView;

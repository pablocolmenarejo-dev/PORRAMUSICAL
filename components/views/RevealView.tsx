import React, { useMemo, useState, useEffect } from 'react';
import { useAppContext } from '../../context/AppContext';
import { GameState } from '../../types';
import Button from '../shared/Button';
import Card from '../shared/Card';
import { CheckCircleIcon, XCircleIcon, TrophyIcon } from '../icons/Icons';

// --- FUNCIONES CORREGIDAS ---
const getYouTubeVideoId = (url: string): string | null => {
    if (!url) return null;
    const regExp = /^.*(http:\/\/googleusercontent.com\/youtube.com\/7\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2] && match[2].length === 11) ? match[2] : null;
};

const getYouTubeEmbedUrl = (url: string): string | null => {
    const videoId = getYouTubeVideoId(url);
    // URL de incrustación estándar y correcta de YouTube
    return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
};
// -----------------------------

const RevealView = () => {
    const { game, participants, songs, votes, setGameState, revealSong } = useAppContext();
    const [isModerator, setIsModerator] = useState(false);

    useEffect(() => {
        if (game) {
            const moderatorId = localStorage.getItem(`porra-musical-moderator-${game.id}`);
            if (moderatorId && moderatorId === game.creatorId) {
                setIsModerator(true);
            }
        }
    }, [game]);

    const revealedSongs = game?.revealedSongIds || [];
    const allSongsRevealed = revealedSongs.length === songs.length;

    const liveScores = useMemo(() => {
        if (!game) return [];
        const scores = participants.map(participant => {
            const correctVotes = votes.filter(vote => {
                if (vote.voterId !== participant.id) return false;
                if (!revealedSongs.includes(vote.songId)) return false;
                const song = songs.find(s => s.id === vote.songId);
                return song && song.submittedBy === vote.guessedParticipantId;
            });
            return { id: participant.id, name: participant.name, score: correctVotes.length };
        });
        return scores.sort((a, b) => b.score - a.score);
    }, [revealedSongs, participants, songs, votes, game]);

    const getMedal = (index: number) => {
        if (index === 0) return <TrophyIcon className="w-6 h-6 text-yellow-400" />;
        if (index === 1) return <TrophyIcon className="w-6 h-6 text-gray-400" />;
        if (index === 2) return <TrophyIcon className="w-6 h-6 text-yellow-600" />;
        return <span className="text-gray-600 font-bold w-6 text-center">{index + 1}</span>;
    };

    return (
        <div className="space-y-8">
            <Card>
                <h2 className="text-2xl font-bold text-cyan-300">¡Hora de la verdad!</h2>
                <p className="text-gray-400 mt-1">El organizador reproduce cada canción y revela quién la trajo.</p>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                    {songs.map(song => {
                        const isRevealed = revealedSongs.includes(song.id);
                        const submitter = participants.find(p => p.id === song.submittedBy);
                        const correctGuesses = votes.filter(v => v.songId === song.id && v.guessedParticipantId === song.submittedBy);
                        const embedUrl = getYouTubeEmbedUrl(song.youtubeUrl);

                        return (
                            <Card key={song.id} className={`!p-0 flex flex-col overflow-hidden bg-gray-800 transition-all duration-500 ${isRevealed ? 'border-2 border-green-500' : 'border-2 border-transparent'}`}>
                                <div className="w-full h-48 bg-gray-900">
                                    {embedUrl ? (
                                        <iframe src={embedUrl} title={song.title} className="w-full h-full" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen loading="lazy"></iframe>
                                    ) : (
                                        <div className="w-full h-48 flex items-center justify-center"><p className="text-xs text-gray-400 px-4 text-center">No se pudo generar la vista previa.</p></div>
                                    )}
                                </div>
                                <div className="p-4 flex flex-col flex-grow">
                                    <div className='flex-grow'>
                                        <h3 className="font-bold text-lg truncate">{song.title}</h3>
                                        <p className="text-gray-400 mb-4">{song.artist}</p>
                                    </div>
                                    {isModerator && !isRevealed && <Button onClick={() => revealSong(song.id)} className="w-full">Revelar</Button>}
                                    {isRevealed && (
                                        <div className="border-t border-gray-700 pt-4 space-y-3">
                                            <p><span className="font-semibold">Traída por: </span><span className="text-green-400 font-bold">{submitter?.name}</span></p>
                                            <div>
                                                <h4 className="font-semibold mb-1">Aciertos:</h4>
                                                {correctGuesses.length > 0 ? (
                                                    <ul className="text-sm space-y-1">
                                                        {correctGuesses.map(vote => {
                                                            const voter = participants.find(p => p.id === vote.voterId);
                                                            return <li key={vote.voterId} className="flex items-center gap-2"><CheckCircleIcon className="w-5 h-5 text-green-500" /><span>{voter?.name}</span></li>;
                                                        })}
                                                    </ul>
                                                ) : <p className="text-sm text-gray-500 flex items-center gap-2"><XCircleIcon className="w-5 h-5 text-red-500" /><span>Nadie ha acertado.</span></p>}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </Card>
                        );
                    })}
                </div>
                <div className="lg:col-span-1">
                    <Card>
                        <h3 className="text-xl font-bold mb-4 text-cyan-300">Ranking en Directo</h3>
                        {liveScores.length > 0 ? (
                            <ul className="space-y-3">
                                {liveScores.map((player, index) => (
                                    <li key={player.id} className="flex items-center justify-between bg-gray-900/50 p-3 rounded-md">
                                        <div className="flex items-center gap-3">
                                            {getMedal(index)}
                                            <span className="font-semibold">{player.name}</span>
                                        </div>
                                        <div className="font-bold text-purple-400">{player.score} pts</div>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-gray-500">Aún no se han revelado canciones.</p>
                        )}
                    </Card>
                </div>
            </div>

            {allSongsRevealed && (
                <div className="text-center mt-8">
                    <h3 className="text-2xl font-bold text-yellow-400">¡Todas las canciones reveladas!</h3>
                    <p className="text-gray-300 mb-4">Es hora de ver la clasificación final.</p>
                    <Button onClick={() => setGameState(GameState.RESULTS)}>Ver Ranking Final</Button>
                </div>
            )}
        </div>
    );
};

export default RevealView;

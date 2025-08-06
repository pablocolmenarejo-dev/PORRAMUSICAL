// pablocolmenarejo-dev/porramusical/PORRAMUSICAL-fa8abcd5a6b39b83eda823564e73e90c00f60fbc/components/views/RevealView.tsx

import React, { useMemo, useState, useEffect } from 'react';
import { useAppContext } from '../../context/AppContext';
import { GameState } from '../../types';
import Button from '../shared/Button';
import Card from '../shared/Card';
import { CheckCircleIcon, XCircleIcon, TrophyIcon } from '../icons/Icons';

const getYouTubeVideoId = (url: string): string | null => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2] && match[2].length === 11) ? match[2] : null;
};

const getYouTubeEmbedUrl = (url: string): string | null => {
    const videoId = getYouTubeVideoId(url);
    return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
};

const RevealView = () => {
  const { game, participants, songs, votes, setGameState, revealSong } = useAppContext();
  const [isModerator, setIsModerator] = useState(false);

  // Comprueba si el usuario actual es el moderador
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
  
  // ... resto del componente sin cambios ...
};


import React, { useMemo } from 'react';
import { useAppContext } from '../../context/AppContext';
import Button from '../shared/Button';
import Card from '../shared/Card';
import { TrophyIcon } from '../icons/Icons';

const ResultsView = () => {
  const { participants, songs, votes, resetGame } = useAppContext();

  const scores = useMemo(() => {
    const participantScores = participants.map(participant => {
      const correctVotes = votes.filter(vote => {
        if (vote.voterId !== participant.id) return false;
        const song = songs.find(s => s.id === vote.songId);
        return song && song.submittedBy === vote.guessedParticipantId;
      });
      return {
        id: participant.id,
        name: participant.name,
        score: correctVotes.length
      };
    });

    return participantScores.sort((a, b) => b.score - a.score);
  }, [participants, songs, votes]);

  const getMedal = (index: number) => {
    if (index === 0) return <TrophyIcon className="w-8 h-8 text-yellow-400" />;
    if (index === 1) return <TrophyIcon className="w-8 h-8 text-gray-400" />;
    if (index === 2) return <TrophyIcon className="w-8 h-8 text-yellow-600" />;
    return <span className="text-gray-600 font-bold w-8 text-center">{index + 1}</span>;
  };
  
  return (
    <div className="max-w-2xl mx-auto space-y-8">
        <Card>
            <h2 className="text-3xl font-bold text-center text-cyan-300">Clasificación Final</h2>
        </Card>

      <div className="space-y-4">
        {scores.map((player, index) => (
          <Card key={player.id} className="!p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {getMedal(index)}
                <span className="text-xl font-semibold">{player.name}</span>
              </div>
              <div className="text-2xl font-bold text-purple-400">
                {player.score} <span className="text-base font-normal text-gray-400">aciertos</span>
              </div>
            </div>
          </Card>
        ))}
      </div>
      
      <div className="text-center mt-8">
        <Button onClick={resetGame}>
          Jugar de Nuevo
        </Button>
      </div>
    </div>
  );
};

export default ResultsView;

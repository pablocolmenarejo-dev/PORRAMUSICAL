
import React from 'react';
import { useAppContext } from '../../context/AppContext';
import { GameState } from '../../types';
import Button from '../shared/Button';
import Card from '../shared/Card';
import ParticipantForm from '../ParticipantForm';
import SongForm from '../SongForm';
import { MusicNoteIcon } from '../icons/Icons';

const SubmissionView = () => {
  const { setGameState, participants, songs } = useAppContext();
  const canStartVoting = participants.length >= 2 && songs.length >= participants.length;

  return (
    <div className="space-y-8">
      <div className="grid md:grid-cols-2 gap-8">
        <ParticipantForm />
        <SongForm />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <h3 className="text-xl font-bold mb-4 text-cyan-300">Canciones Añadidas</h3>
          {songs.length > 0 ? (
            <ul className="space-y-2">
              {songs.map((song) => (
                <li key={song.id} className="flex items-center gap-3 bg-gray-900/50 p-3 rounded-md">
                  <MusicNoteIcon className="w-5 h-5 text-purple-400 flex-shrink-0" />
                  <div>
                    <p className="font-semibold">{song.title}</p>
                    <p className="text-sm text-gray-400">{song.artist}</p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">Aún no se han añadido canciones.</p>
          )}
        </Card>

        <Card className="flex flex-col items-center justify-center">
          <h3 className="text-xl font-bold mb-4 text-cyan-300">¿Listos para empezar?</h3>
          <p className="text-gray-400 text-center mb-4">
            Necesitas al menos 2 participantes y una canción por cada uno para comenzar a votar.
          </p>
          <Button onClick={() => setGameState(GameState.VOTING)} disabled={!canStartVoting}>
            Comenzar Votación
          </Button>
          {!canStartVoting && (
            <p className="text-xs text-yellow-400 mt-2 text-center">
              Faltan {Math.max(0, 2 - participants.length)} participantes y {Math.max(0, participants.length - songs.length)} canciones.
            </p>
          )}
        </Card>
      </div>
    </div>
  );
};

export default SubmissionView;

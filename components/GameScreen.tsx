import React, { useState } from 'react';
import { AppProvider, useAppContext } from '../context/AppContext';
import SubmissionView from './views/SubmissionView';
import VotingView from './views/VotingView';
import RevealView from './views/RevealView';
import ResultsView from './views/ResultsView';
import { GameState } from '../types';
import { MusicNoteIcon, TrophyIcon } from './icons/Icons';
import Card from './shared/Card';
import Input from './shared/Input';
import Button from './shared/Button';

const Header = ({ gameName, gameId, gameState }: { gameName: string; gameId: string; gameState: GameState }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
    };

    return (
        <header className="py-6 text-center">
            <div className="flex justify-center items-center gap-4">
                <TrophyIcon className="w-10 h-10 text-yellow-400" />
                <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
                    La Porra Musical
                </h1>
                <MusicNoteIcon className="w-10 h-10 text-cyan-400" />
            </div>
            <p className="mt-2 text-lg text-gray-400 font-semibold">{gameName}</p>

            {gameState === GameState.SUBMISSION && (
                <Card className="max-w-lg mx-auto mt-6 !p-4 bg-gray-800/80">
                    <p className="text-sm text-gray-300 mb-2 font-semibold">¡Partida creada! Invita a otros jugadores con este enlace:</p>
                    <div className="flex items-center gap-2">
                        <Input 
                            type="text"
                            readOnly 
                            value={window.location.href}
                            className="text-sm !py-2 text-cyan-300 bg-gray-900"
                            onFocus={(e) => e.target.select()}
                        />
                        <Button onClick={handleCopy} variant="secondary" className="!py-2 flex-shrink-0 w-28">
                            {copied ? '¡Copiado!' : 'Copiar'}
                        </Button>
                    </div>
                </Card>
            )}
        </header>
    );
};


const AppContent = () => {
    const { game, gameState } = useAppContext();

    if (!game) {
        return <Card><p className="text-center">Cargando juego...</p></Card>;
    }

    const renderGameState = () => {
        switch (gameState) {
            case GameState.SUBMISSION: return <SubmissionView />;
            case GameState.VOTING: return <VotingView />;
            case GameState.REVEAL: return <RevealView />;
            case GameState.RESULTS: return <ResultsView />;
            default: return <SubmissionView />;
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white font-sans">
            <main className="container mx-auto px-4 pb-12">
                <Header gameName={game.name} gameId={game.id} gameState={gameState}/>
                <div className="mt-8">
                    {renderGameState()}
                </div>
            </main>
        </div>
    );
};

const GameScreen = ({ gameId }: { gameId: string }) => {
    return (
        <AppProvider gameId={gameId}>
            <AppContent />
        </AppProvider>
    );
};

export default GameScreen;
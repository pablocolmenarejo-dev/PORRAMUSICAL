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
        <header className="py-6 text-center relative"> {/* 'relative' es importante para posicionar el botón */}
    {/* Este es el nuevo botón de la casa */}
    <a href="/#" className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1V9a1 1 0 011-1h2a1 1 0 011 1v10a1 1 0 001 1m-6 0h6" />
        </svg>
    </a>
    
    {/* Esto es el título que ya tenías */}
    <div className="flex justify-center items-center gap-4">
        <TrophyIcon className="w-10 h-10 text-yellow-400" />
        <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
            La Porra Musical
        </h1>
        <MusicNoteIcon className="w-10 h-10 text-cyan-400" />
    </div>
    
    {/* Y aquí mantenemos el nombre del juego */}
    <p className="mt-2 text-lg text-gray-400 font-semibold">{gameName}</p>
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

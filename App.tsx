import React, { useState, useEffect } from 'react';
import HomeView from './src/components/views/HomeView';
import GameScreen from './components/GameScreen';

const App = () => {
  const [hash, setHash] = useState(window.location.hash);

  useEffect(() => {
    const handleHashChange = () => {
      setHash(window.location.hash);
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const route = hash.replace(/^#/, '');
  const gameIdMatch = route.match(/^\/game\/(.+)/);

  if (gameIdMatch) {
    const gameId = gameIdMatch[1];
    return <GameScreen gameId={gameId} />;
  }

  return <HomeView />;
};

export default App;

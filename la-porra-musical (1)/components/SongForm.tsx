
import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { extractSongInfo } from '../services/geminiService';
import Input from './shared/Input';
import Button from './shared/Button';
import Card from './shared/Card';
import { SpinnerIcon, YouTubeIcon } from './icons/Icons';

const SongForm = () => {
  const { addSong, participants } = useAppContext();
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [submittedBy, setSubmittedBy] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [urlAnalyzed, setUrlAnalyzed] = useState(false);

  const handleAnalyzeUrl = async () => {
    if (!youtubeUrl) return;
    setIsLoading(true);
    setError('');
    setUrlAnalyzed(false);
    try {
      const songInfo = await extractSongInfo(youtubeUrl);
      setTitle(songInfo.title);
      setArtist(songInfo.artist);
      setUrlAnalyzed(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Ocurrió un error desconocido.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title && artist && youtubeUrl && submittedBy) {
      addSong({ title, artist, youtubeUrl, submittedBy });
      setTitle('');
      setArtist('');
      setYoutubeUrl('');
      setSubmittedBy('');
      setUrlAnalyzed(false);
      setError('');
    }
  };

  return (
    <Card>
        <h3 className="text-xl font-bold mb-4 text-cyan-300">2. Añadir Canciones</h3>
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-2">
                <Input
                    type="url"
                    value={youtubeUrl}
                    onChange={(e) => setYoutubeUrl(e.target.value)}
                    placeholder="Pega un enlace de YouTube"
                    disabled={isLoading}
                />
                <Button onClick={handleAnalyzeUrl} disabled={isLoading || !youtubeUrl} variant="secondary" className="flex-shrink-0 flex items-center justify-center gap-2">
                    {isLoading ? <SpinnerIcon /> : <YouTubeIcon className="w-5 h-5 text-red-500"/>}
                    {isLoading ? 'Analizando...' : 'Analizar'}
                </Button>
            </div>

            {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
            
            {(urlAnalyzed || error) && (
              <form onSubmit={handleSubmit} className="space-y-4 border-t border-gray-700 pt-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Tu Nombre (Quien añade la canción)</label>
                  <select
                    value={submittedBy}
                    onChange={(e) => setSubmittedBy(e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="">Selecciona tu nombre</option>
                    {participants.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
                </div>
                <Input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Título de la canción" required />
                <Input type="text" value={artist} onChange={(e) => setArtist(e.target.value)} placeholder="Artista" required />
                <Button type="submit" disabled={!title || !artist || !submittedBy}>Añadir Canción a la Porra</Button>
              </form>
            )}
        </div>
    </Card>
  );
};

export default SongForm;

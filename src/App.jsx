import { useState } from 'react';
import Home from './components/Home';
import Learn from './components/Learn';
import Game from './components/Game';
import Art from './components/Art';
import MathSection from './components/MathSection';

function App() {
  const [mode, setMode] = useState('home');

  return (
    <div
      className={`App mode-${mode}`}
      style={mode === 'home' ? {
        backgroundColor: 'transparent',
        boxShadow: 'none',
        border: 'none',
        borderRadius: 0,
        overflow: 'visible',
        minHeight: '100vh',
        width: '100vw',
        maxWidth: 'none',
        margin: 0,
        padding: 0
      } : {}}
    >
      {/* Global Top CTA - Hidden on homepage */}
      {mode !== 'home' && (
        <div className="global-top-cta">
          A tiny free joy for you created by <a href="https://x.com/hannaz_z" target="_blank" rel="noopener noreferrer">Hanna Z</a>
        </div>
      )}

      <main className="container-cute fade-in">
        {mode !== 'home' && (
          <button
            onClick={() => setMode('home')}
            className="btn-back-simple"
          >
            ← Back
          </button>
        )}

        {mode === 'home' && <Home setMode={setMode} />}
        {mode === 'learn' && <Learn />}
        {mode === 'game' && <Game />}
        {mode === 'art' && <Art />}
        {mode === 'math' && <MathSection />}
      </main>
    </div>
  );
}

export default App;

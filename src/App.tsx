import { useState } from 'react';
import { fetchQuestions, submitScore, Question } from './services/api';
import { LoginView } from './views/LoginView';
import { GameView } from './views/GameView';
import { ResultView } from './views/ResultView';
import './App.css';

type ViewState = 'login' | 'loading' | 'game' | 'result';

function App() {
  const [view, setView] = useState<ViewState>('login');
  const [playerId, setPlayerId] = useState<string>('');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [score, setScore] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const threshold = parseInt(import.meta.env.VITE_PASS_THRESHOLD || '3');
  const questionCount = parseInt(import.meta.env.VITE_QUESTION_COUNT || '5');

  const handleLogin = async (id: string) => {
    setPlayerId(id);
    setView('loading');

    // Fetch questions from GAS
    const data = await fetchQuestions(questionCount);
    setQuestions(data);
    setView('game');
  };

  const handleGameEnd = async (finalScore: number) => {
    setScore(finalScore);
    setView('result');
    setIsSubmitting(true);

    // Submit score to GAS
    await submitScore({
      id: playerId,
      score: finalScore,
      timestamp: new Date().toISOString()
    });

    setIsSubmitting(false);
  };

  const handleRetry = () => {
    setView('login');
    setScore(0);
    setQuestions([]);
  };

  return (
    <div className="app-container">
      {view === 'login' && <LoginView onLogin={handleLogin} />}

      {view === 'loading' && (
        <div className="loading-view" style={{ textAlign: 'center' }}>
          <h2 className="blink" style={{ color: 'var(--secondary-color)' }}>LOADING...</h2>
          <p>FETCHING DATA FROM SERVER</p>
        </div>
      )}

      {view === 'game' && questions.length > 0 && (
        <GameView questions={questions} onGameEnd={handleGameEnd} />
      )}

      {view === 'result' && (
        <ResultView
          score={score}
          totalQuestions={questions.length}
          threshold={threshold}
          onRetry={handleRetry}
          isSubmitting={isSubmitting}
        />
      )}
    </div>
  );
}

export default App;

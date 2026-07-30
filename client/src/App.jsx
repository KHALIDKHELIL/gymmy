import { useState, useEffect, useMemo } from 'react';
import { useStore } from './store';
// 1. IMPORT YOUR JSON DATA DIRECTLY
import exercisesData from './data/exercises.json';

function App() {
  // 2. USE THE IMPORTED DATA IMMEDIATELY (No loading state needed!)
  const [exercises, setExercises] = useState(exercisesData);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('pool'); // 'pool' | 'session'
  
  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMuscle, setSelectedMuscle] = useState('All');
  
  // Workout Timer States
  const [durationMinutes, setDurationMinutes] = useState(30);
  const [timeLeft, setTimeLeft] = useState(null); // stored in seconds
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  const { session, addToSession, removeFromSession } = useStore();

  // Timer Countdown & Auto-Destroy Logic
  useEffect(() => {
    let interval = null;
    if (isTimerRunning && timeLeft !== null && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isTimerRunning) {
      setIsTimerRunning(false);
      setTimeLeft(null);
      session.forEach((ex) => removeFromSession(ex.id));
      alert("⏰ Time's up! Great workout—your session has self-destructed.");
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timeLeft, session, removeFromSession]);

  const startTimer = () => {
    if (durationMinutes > 0) {
      setTimeLeft(durationMinutes * 60);
      setIsTimerRunning(true);
    }
  };

  const stopTimer = () => {
    setIsTimerRunning(false);
    setTimeLeft(null);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const isAdded = (id) => session.some((ex) => ex.id === id);

  const muscleGroups = useMemo(() => {
    const groups = new Set(exercises.map((ex) => ex.primaryMuscle));
    return ['All', ...Array.from(groups)];
  }, [exercises]);

  const filteredExercises = useMemo(() => {
    return exercises.filter((ex) => {
      const matchesMuscle = selectedMuscle === 'All' || ex.primaryMuscle === selectedMuscle;
      const matchesSearch = 
        ex.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ex.equipment.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesMuscle && matchesSearch;
    });
  }, [exercises, selectedMuscle, searchQuery]);

  const clearSession = () => {
    session.forEach((ex) => removeFromSession(ex.id));
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 pb-24">
      
      {/* STICKY MOBILE HEADER & TABS */}
      <header className="sticky top-0 z-50 bg-gray-900/95 backdrop-blur-md border-b border-gray-800 px-4 py-3">
        <div className="max-w-md mx-auto flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black tracking-tight text-white">
              GYM<span className="text-blue-500">FLOW</span>
            </h1>
            
            {isTimerRunning && timeLeft !== null && (
              <span className="bg-red-950 border border-red-500/50 text-red-400 text-xs font-mono font-bold px-2 py-0.5 rounded-full animate-pulse">
                ⏱ {formatTime(timeLeft)}
              </span>
            )}
          </div>

          <span className="text-xs font-semibold px-2.5 py-1 bg-gray-800 text-gray-300 rounded-full border border-gray-700">
            {session.length} {session.length === 1 ? 'Exercise' : 'Exercises'}
          </span>
        </div>

        {/* TAB BUTTONS */}
        <div className="max-w-md mx-auto grid grid-cols-2 gap-2 bg-gray-950 p-1 rounded-xl border border-gray-800">
          <button
            onClick={() => setActiveTab('pool')}
            className={`py-2 text-sm font-bold rounded-lg transition-all ${
              activeTab === 'pool'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Exercise Pool
          </button>
          <button
            onClick={() => setActiveTab('session')}
            className={`py-2 text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${
              activeTab === 'session'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <span>My Session</span>
            {session.length > 0 && (
              <span className="bg-white text-blue-900 text-xs px-1.5 py-0.5 rounded-full font-black">
                {session.length}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* MAIN CONTENT AREA */}
      <main className="max-w-md mx-auto px-4 pt-4">
        
        {/* TAB 1: EXERCISE POOL */}
        {activeTab === 'pool' && (
          <div>
            {loading ? (
              <div className="flex justify-center items-center py-20 text-gray-500 font-medium">
                Loading exercises...
              </div>
            ) : (
              <>
                {/* SEARCH BAR */}
                <div className="mb-3">
                  <input
                    type="text"
                    placeholder="Search by name or equipment (e.g., Barbell)..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>

                {/* MUSCLE GROUP CHIPS (HORIZONTAL SCROLL) */}
                <div className="flex gap-2 overflow-x-auto pb-3 mb-4 no-scrollbar">
                  {muscleGroups.map((muscle) => (
                    <button
                      key={muscle}
                      onClick={() => setSelectedMuscle(muscle)}
                      className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all shrink-0 ${
                        selectedMuscle === muscle
                          ? 'bg-blue-600 text-white shadow-sm'
                          : 'bg-gray-900 text-gray-400 border border-gray-800 hover:text-white'
                      }`}
                    >
                      {muscle}
                    </button>
                  ))}
                </div>

                {/* EXERCISE LIST */}
                {filteredExercises.length === 0 ? (
                  <div className="text-center py-12 text-gray-500 text-sm">
                    No exercises found matching your search.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredExercises.map((ex) => {
                      const added = isAdded(ex.id);
                      return (
                        <div 
                          key={ex.id} 
                          className="bg-gray-900 rounded-2xl overflow-hidden border border-gray-800 shadow-sm flex flex-col"
                        >
                          <div className="h-52 bg-gray-950 relative flex items-center justify-center border-b border-gray-800/60">
                            <img 
                              src={ex.mediaUrl || `https://placehold.co/400x200/1f2937/a3a3a3?text=${ex.name.split(' ').join('+')}`} 
                              alt={ex.name} 
                              className="w-full h-full object-contain"
                            />
                            <span className="absolute top-3 right-3 bg-gray-900/90 backdrop-blur-sm text-blue-400 border border-blue-500/30 text-xs px-2.5 py-1 rounded-full font-bold uppercase tracking-wider">
                              {ex.primaryMuscle}
                            </span>
                          </div>

                          <div className="p-4 flex flex-col gap-3">
                            <div>
                              <h2 className="text-lg font-bold text-white leading-snug">
                                {ex.name}
                              </h2>
                              <p className="text-xs text-gray-400 mt-0.5 font-medium">
                                Equipment: <span className="text-gray-300">{ex.equipment}</span>
                              </p>
                            </div>

                            <button 
                              onClick={() => addToSession(ex)}
                              disabled={added}
                              className={`w-full py-2.5 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-1.5 ${
                                added
                                  ? 'bg-emerald-950/50 border border-emerald-700/50 text-emerald-400 cursor-default'
                                  : 'bg-blue-600 active:bg-blue-500 text-white shadow-md shadow-blue-600/20'
                              }`}
                            >
                              {added ? '✓ Added to Session' : '+ Add to Session'}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* TAB 2: ACTIVE SESSION */}
        {activeTab === 'session' && (
          <div className="space-y-4">
            
            {/* WORKOUT TIMER CARD */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
                  Session Timer
                </span>
                <span className="text-xs text-gray-500 font-medium">
                  Auto-destructs at 00:00
                </span>
              </div>

              {!isTimerRunning ? (
                <div className="flex items-center gap-2">
                  <div className="flex-1 flex items-center bg-gray-950 border border-gray-800 rounded-xl px-3 py-2">
                    <input
                      type="number"
                      min="1"
                      max="180"
                      value={durationMinutes}
                      onChange={(e) => setDurationMinutes(Number(e.target.value))}
                      className="w-full bg-transparent text-white font-bold text-sm focus:outline-none"
                    />
                    <span className="text-xs font-semibold text-gray-500">MINS</span>
                  </div>
                  <button
                    onClick={startTimer}
                    disabled={session.length === 0}
                    className={`px-4 py-2 rounded-xl font-bold text-sm transition-all ${
                      session.length === 0
                        ? 'bg-gray-800 text-gray-600 cursor-not-allowed'
                        : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/20'
                    }`}
                  >
                    Start Workout
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-between bg-gray-950 border border-red-500/30 rounded-xl p-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
                    <span className="text-2xl font-mono font-black text-white">
                      {formatTime(timeLeft)}
                    </span>
                  </div>
                  <button
                    onClick={stopTimer}
                    className="text-xs font-bold text-red-400 hover:text-red-300 bg-red-950/50 border border-red-800/50 px-3 py-1.5 rounded-lg"
                  >
                    Stop / Reset
                  </button>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between py-1">
              <div>
                <h2 className="text-lg font-bold text-white">
                  Today's Workout
                </h2>
                <span className="text-xs text-gray-400">
                  {session.length} {session.length === 1 ? 'exercise' : 'exercises'} ready
                </span>
              </div>

              {session.length > 0 && (
                <button
                  onClick={clearSession}
                  className="text-xs font-bold text-red-400 hover:text-red-300 bg-red-950/30 border border-red-900/40 px-3 py-1.5 rounded-lg"
                >
                  Clear All
                </button>
              )}
            </div>

            {session.length === 0 ? (
              <div className="bg-gray-900 border border-dashed border-gray-800 rounded-2xl p-8 text-center my-6">
                <p className="text-gray-400 font-medium text-sm">
                  Your session is empty.
                </p>
                <button
                  onClick={() => setActiveTab('pool')}
                  className="mt-4 bg-gray-800 hover:bg-gray-700 text-blue-400 text-xs font-bold px-4 py-2 rounded-lg border border-gray-700 transition-colors"
                >
                  Browse Exercises
                </button>
              </div>
            ) : (
              <div className="space-y-2.5">
                {session.map((ex, index) => (
                  <div 
                    key={ex.id} 
                    className="bg-gray-900 border border-gray-800 p-4 rounded-xl flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="w-6 h-6 rounded-full bg-gray-800 border border-gray-700 text-gray-400 text-xs font-bold flex items-center justify-center shrink-0">
                        {index + 1}
                      </span>
                      <div className="truncate">
                        <p className="font-bold text-sm text-white truncate">
                          {ex.name}
                        </p>
                        <p className="text-xs text-blue-400 font-medium">
                          {ex.primaryMuscle} • {ex.equipment}
                        </p>
                      </div>
                    </div>

                    <button 
                      onClick={() => removeFromSession(ex.id)}
                      className="text-red-400 active:text-red-300 text-xs font-bold px-2.5 py-1.5 rounded-lg bg-red-950/40 border border-red-900/40 shrink-0"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </main>
    </div>
  );
}

export default App;
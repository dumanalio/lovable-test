import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar,
  BarChart3,
  Monitor,
  Plus,
  Timer,
  Settings,
  CheckCircle,
  Clock,
  Target,
  TrendingUp,
  Play,
  Pause,
  RotateCcw,
  Edit3,
  Save,
  X,
  ArrowLeft,
  Coffee,
  Zap,
  ChevronUp,
  ChevronDown,
  Volume2,
  VolumeX
} from 'lucide-react';

function Dashboard({ onBackClick }) {
  const [activeTab, setActiveTab] = useState('today');
  const [progress, setProgress] = useState(65);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timerMinutes, setTimerMinutes] = useState(25);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [timerMode, setTimerMode] = useState('work'); // work, shortBreak, longBreak
  const [completedSessions, setCompletedSessions] = useState(0);
  const [showAddModal, setShowAddModal] = useState(false);
  const [notes, setNotes] = useState('Hier können Sie Ihre Notizen eingeben...');
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [timerSettings, setTimerSettings] = useState({
    work: 25,
    shortBreak: 5,
    longBreak: 15
  });

  const timerModes = {
    work: { duration: timerSettings.work, label: 'Arbeitszeit', color: 'from-blue-500 to-purple-600', bgColor: 'bg-blue-50' },
    shortBreak: { duration: timerSettings.shortBreak, label: 'Kurze Pause', color: 'from-green-500 to-emerald-600', bgColor: 'bg-green-50' },
    longBreak: { duration: timerSettings.longBreak, label: 'Lange Pause', color: 'from-orange-500 to-red-600', bgColor: 'bg-orange-50' }
  };

  // Timer logic
  useEffect(() => {
    let interval;
    if (isTimerRunning && (timerMinutes > 0 || timerSeconds > 0)) {
      interval = setInterval(() => {
        if (timerSeconds > 0) {
          setTimerSeconds(timerSeconds - 1);
        } else if (timerMinutes > 0) {
          setTimerMinutes(timerMinutes - 1);
          setTimerSeconds(59);
        }
      }, 1000);
    } else if (timerMinutes === 0 && timerSeconds === 0 && isTimerRunning) {
      // Timer finished
      setIsTimerRunning(false);
      handleTimerComplete();
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerMinutes, timerSeconds]);

  const handleTimerComplete = () => {
    // Play notification sound (if available)
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(`${timerModes[timerMode].label} beendet!`, {
        body: timerMode === 'work' ? 'Zeit für eine Pause!' : 'Zurück zur Arbeit!',
        icon: '/favicon.ico'
      });
    }

    if (timerMode === 'work') {
      setCompletedSessions(prev => prev + 1);
      // Auto-switch to break
      const nextMode = completedSessions % 4 === 3 ? 'longBreak' : 'shortBreak';
      switchTimerMode(nextMode);
    } else {
      // Switch back to work mode
      switchTimerMode('work');
    }
  };

  const switchTimerMode = (mode) => {
    setTimerMode(mode);
    setTimerMinutes(timerModes[mode].duration);
    setTimerSeconds(0);
    setIsTimerRunning(false);
  };

  const resetTimer = () => {
    setTimerMinutes(timerModes[timerMode].duration);
    setTimerSeconds(0);
    setIsTimerRunning(false);
  };

  const adjustTimer = (minutes) => {
    if (!isTimerRunning) {
      const newMinutes = Math.max(1, Math.min(60, timerMinutes + minutes));
      setTimerMinutes(newMinutes);
    }
  };

  // Request notification permission on component mount
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  const formatTime = (minutes, seconds) => {
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const tabs = [
    { id: 'today', label: 'Heute', count: 8 },
    { id: 'week', label: 'Woche', count: 24 },
    { id: 'all', label: 'Alle', count: 156 }
  ];

  const categories = [
    { name: 'Arbeit', color: 'bg-blue-100 text-blue-800', count: 12 },
    { name: 'Persönlich', color: 'bg-purple-100 text-purple-800', count: 5 },
    { name: 'Lernen', color: 'bg-green-100 text-green-800', count: 7 },
    { name: 'Gesundheit', color: 'bg-pink-100 text-pink-800', count: 3 }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white/80 backdrop-blur-lg border-b border-gray-200/50 sticky top-0 z-40"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Back Button */}
            <motion.button
              onClick={onBackClick}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Zurück zur Website</span>
            </motion.button>

            {/* Main Title */}
            <div className="hidden md:block">
              <h1 className="text-lg font-semibold text-gray-900">
                Dashboard
              </h1>
              <p className="text-sm text-gray-500">
                Produktivitäts-Übersicht
              </p>
            </div>

            {/* Spacer */}
            <div className="w-32"></div>
          </div>
        </div>
      </motion.header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Categories & Add Button */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="flex flex-wrap items-center gap-3 mb-8"
        >
          {categories.map((category, index) => (
            <motion.span
              key={category.name}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1 + index * 0.1 }}
              className={`px-3 py-1 rounded-full text-sm font-medium ${category.color} cursor-pointer hover:shadow-md transition-shadow`}
            >
              {category.name} ({category.count})
            </motion.span>
          ))}
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowAddModal(true)}
            className="px-3 py-1 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm font-medium hover:shadow-lg transition-shadow flex items-center space-x-1"
          >
            <Plus className="w-4 h-4" />
            <span>Hinzufügen</span>
          </motion.button>
        </motion.div>

        {/* Navigation Tabs */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8"
        >
          <div className="flex space-x-1 bg-white/60 backdrop-blur-sm p-1 rounded-xl border border-gray-200/50">
            {tabs.map((tab) => (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {tab.label}
                <span className="ml-2 px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs">
                  {tab.count}
                </span>
              </motion.button>
            ))}
          </div>

          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
              <CheckCircle className="w-4 h-4" />
              <span>Aktiv</span>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg transition-shadow"
            >
              <Timer className="w-4 h-4 inline mr-2" />
              Timer
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 bg-white/60 backdrop-blur-sm border border-gray-200/50 text-gray-700 rounded-xl font-medium hover:bg-white/80 transition-colors"
            >
              <Settings className="w-4 h-4 inline mr-2" />
              Verwalten
            </motion.button>
          </div>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Progress Card */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-2"
          >
            <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-gray-200/50">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Tagesfortschritt</h2>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <TrendingUp className="w-4 h-4" />
                  <span>+12% gegenüber gestern</span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-3xl font-bold text-gray-900">{progress}%</span>
                  <span className="text-sm text-gray-500">8 von 12 Aufgaben erledigt</span>
                </div>

                <div className="relative">
                  <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 1, delay: 0.5 }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 pt-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">8</div>
                    <div className="text-sm text-gray-500">Erledigt</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">4</div>
                    <div className="text-sm text-gray-500">Ausstehend</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">2h 30m</div>
                    <div className="text-sm text-gray-500">Zeit heute</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Timer Card */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <div className={`${timerModes[timerMode].bgColor} backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-gray-200/50 transition-all duration-500`}>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Pomodoro Timer</h3>
                  <div className="flex items-center space-x-2 mt-1">
                    <div className="flex space-x-1">
                      {['work', 'shortBreak', 'longBreak'].map((mode) => (
                        <motion.button
                          key={mode}
                          onClick={() => switchTimerMode(mode)}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className={`px-2 py-1 text-xs rounded-lg transition-all ${
                            timerMode === mode 
                              ? 'bg-white shadow-sm text-gray-900' 
                              : 'text-gray-600 hover:bg-white/50'
                          }`}
                        >
                          {mode === 'work' ? (
                            <Zap className="w-3 h-3" />
                          ) : (
                            <Coffee className="w-3 h-3" />
                          )}
                        </motion.button>
                      ))}
                    </div>
                    <span className="text-xs text-gray-500">
                      {completedSessions} Sessions
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <div className="text-right text-xs text-gray-500">
                    <div>{timerModes[timerMode].label}</div>
                    <div className="flex items-center space-x-1 mt-1">
                      {Array.from({ length: 4 }, (_, i) => (
                        <div
                          key={i}
                          className={`w-2 h-2 rounded-full ${
                            i < completedSessions % 4 ? 'bg-green-500' : 'bg-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-center">
                {/* Circular Progress */}
                <div className="relative w-48 h-48 mx-auto mb-6">
                  <svg className="w-48 h-48 transform -rotate-90" viewBox="0 0 100 100">
                    {/* Background Circle */}
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="rgb(229 231 235)"
                      strokeWidth="4"
                    />
                    {/* Progress Circle */}
                    <motion.circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="url(#timerGradient)"
                      strokeWidth="6"
                      strokeLinecap="round"
                      strokeDasharray={`${2 * Math.PI * 45}`}
                      initial={{ strokeDashoffset: 2 * Math.PI * 45 }}
                      animate={{
                        strokeDashoffset: 2 * Math.PI * 45 * (1 - ((timerMinutes * 60 + timerSeconds) / (timerModes[timerMode].duration * 60)))
                      }}
                      transition={{ duration: 0.5 }}
                      className="drop-shadow-sm"
                    />
                    <defs>
                      <linearGradient id="timerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor={timerMode === 'work' ? '#3b82f6' : timerMode === 'shortBreak' ? '#10b981' : '#f59e0b'} />
                        <stop offset="100%" stopColor={timerMode === 'work' ? '#8b5cf6' : timerMode === 'shortBreak' ? '#059669' : '#dc2626'} />
                      </linearGradient>
                    </defs>
                  </svg>
                  
                  {/* Timer Display */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div>
                      <motion.div 
                        className="text-4xl font-bold text-gray-900 mb-1"
                        animate={{ 
                          scale: isTimerRunning && timerSeconds === 0 && timerMinutes > 0 ? [1, 1.1, 1] : 1 
                        }}
                        transition={{ duration: 0.3 }}
                      >
                        {formatTime(timerMinutes, timerSeconds)}
                      </motion.div>
                      <div className="text-sm text-gray-500">
                        {isTimerRunning ? 'Läuft...' : 'Bereit'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Time Adjustment */}
                {!isTimerRunning && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-center space-x-4 mb-4"
                  >
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => adjustTimer(-5)}
                      className="p-1 rounded-lg bg-gray-200 text-gray-600 hover:bg-gray-300"
                    >
                      <ChevronDown className="w-4 h-4" />
                    </motion.button>
                    <span className="text-sm text-gray-500 min-w-16">
                      {timerMinutes}min
                    </span>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => adjustTimer(5)}
                      className="p-1 rounded-lg bg-gray-200 text-gray-600 hover:bg-gray-300"
                    >
                      <ChevronUp className="w-4 h-4" />
                    </motion.button>
                  </motion.div>
                )}

                {/* Control Buttons */}
                <div className="flex items-center justify-center space-x-3">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsTimerRunning(!isTimerRunning)}
                    className={`p-4 rounded-xl shadow-lg transition-all ${
                      isTimerRunning
                        ? 'bg-red-500 hover:bg-red-600 text-white'
                        : `bg-gradient-to-r ${timerModes[timerMode].color} text-white hover:shadow-xl`
                    }`}
                  >
                    {isTimerRunning ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={resetTimer}
                    className="p-3 rounded-xl bg-gray-200 text-gray-600 hover:bg-gray-300 transition-all"
                  >
                    <RotateCcw className="w-5 h-5" />
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-3 rounded-xl bg-gray-200 text-gray-600 hover:bg-gray-300 transition-all"
                  >
                    <Volume2 className="w-5 h-5" />
                  </motion.button>
                </div>

                <div className="mt-4 text-xs text-gray-500">
                  {timerMode === 'work' ? 'Fokussierte Arbeitszeit' : 'Entspannung & Erholung'}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Notes Card */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="lg:col-span-3"
          >
            <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-gray-200/50">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-900">Notizen</h3>
                <div className="flex space-x-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsEditingNotes(!isEditingNotes)}
                    className="p-2 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200"
                  >
                    <Edit3 className="w-4 h-4" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-2 rounded-lg bg-green-100 text-green-600 hover:bg-green-200"
                  >
                    <Save className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>

              {isEditingNotes ? (
                <motion.textarea
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full h-32 p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  placeholder="Schreiben Sie Ihre Notizen hier..."
                />
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="min-h-32 p-4 bg-gray-50 rounded-xl text-gray-700"
                >
                  {notes || 'Keine Notizen vorhanden. Klicken Sie auf Bearbeiten, um Notizen hinzuzufügen.'}
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Add Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowAddModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Neue Aufgabe</h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-2 rounded-lg hover:bg-gray-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Titel
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Aufgabentitel eingeben..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Kategorie
                  </label>
                  <select className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option>Arbeit</option>
                    <option>Persönlich</option>
                    <option>Lernen</option>
                    <option>Gesundheit</option>
                  </select>
                </div>

                <div className="flex space-x-3 pt-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
                  >
                    Abbrechen
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg transition-shadow"
                  >
                    Hinzufügen
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Dashboard;

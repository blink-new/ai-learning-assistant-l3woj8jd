import { useState, useEffect } from 'react'
import { Header } from '@/components/layout/Header'
import { TopicInput } from '@/components/learning/TopicInput'
import { LearningSession } from '@/components/learning/LearningSession'
import { LanguageProvider, useLanguage } from '@/contexts/LanguageContext'
import { blink } from '@/blink/client'

type AppState = 'topic-selection' | 'learning-session'

interface LearningData {
  topic: string
  difficulty: string
}

function AppContent() {
  const { t } = useLanguage()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [appState, setAppState] = useState<AppState>('topic-selection')
  const [learningData, setLearningData] = useState<LearningData | null>(null)

  useEffect(() => {
    const unsubscribe = blink.auth.onAuthStateChanged((state) => {
      setUser(state.user)
      setLoading(state.isLoading)
    })
    return unsubscribe
  }, [])

  const handleStartLearning = (topic: string, difficulty: string) => {
    setLearningData({ topic, difficulty })
    setAppState('learning-session')
  }

  const handleBackToTopics = () => {
    setAppState('topic-selection')
    setLearningData(null)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
          <p className="text-lg text-gray-600">{t('loading.message')}</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="text-center space-y-6 max-w-md mx-auto p-6">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary to-accent rounded-3xl mb-6">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">{t('auth.title')}</h1>
          <p className="text-lg text-gray-600">
            {t('auth.description')}
          </p>
          <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
            <p className="text-sm text-gray-500 mb-4">{t('auth.sign_in_message')}</p>
            <button
              onClick={() => blink.auth.login()}
              className="w-full bg-gradient-to-r from-primary to-accent text-white py-3 px-6 rounded-lg font-medium hover:from-primary/90 hover:to-accent/90 transition-all"
            >
              {t('auth.sign_in_button')}
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <Header />
      
      <main className="py-8">
        {appState === 'topic-selection' && (
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <TopicInput onStartLearning={handleStartLearning} />
          </div>
        )}
        
        {appState === 'learning-session' && learningData && (
          <LearningSession
            topic={learningData.topic}
            difficulty={learningData.difficulty}
            onBack={handleBackToTopics}
          />
        )}
      </main>
    </div>
  )
}

function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  )
}

export default App
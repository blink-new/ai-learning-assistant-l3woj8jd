import React, { createContext, useContext, useState, useEffect } from 'react'

export type Language = 'en' | 'id'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

// eslint-disable-next-line react-refresh/only-export-components
export const useLanguage = () => {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}

interface LanguageProviderProps {
  children: React.ReactNode
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('language')
    return (saved as Language) || 'en'
  })

  useEffect(() => {
    localStorage.setItem('language', language)
  }, [language])

  const t = (key: string): string => {
    return translations[language][key] || key
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

const translations = {
  en: {
    // Header
    'header.title': 'AI Learning Assistant',
    'header.subtitle': 'Master any topic, step by step',
    'header.learning_history': 'Learning History',
    'header.profile': 'Profile',
    'header.settings': 'Settings',
    'header.sign_out': 'Sign Out',

    // Auth/Loading
    'loading.message': 'Loading your learning assistant...',
    'auth.title': 'AI Learning Assistant',
    'auth.description': 'Master any topic through personalized, step-by-step learning paths powered by AI',
    'auth.sign_in_message': 'Please sign in to start your learning journey',
    'auth.sign_in_button': 'Sign In to Continue',

    // Topic Input
    'topic.title': 'What would you like to learn?',
    'topic.description': 'Enter any topic and I\'ll create a personalized learning path just for you',
    'topic.placeholder': 'e.g., Machine Learning, React Hooks, Quantum Physics...',
    'topic.difficulty_label': 'Difficulty Level',
    'topic.difficulty.beginner': 'Beginner',
    'topic.difficulty.intermediate': 'Intermediate',
    'topic.difficulty.advanced': 'Advanced',
    'topic.start_button': 'Start Learning Journey',
    'topic.popular_topics': 'Popular Topics',

    // Learning Session
    'session.back_button': '← Back to Topics',
    'session.level': 'Level',
    'session.learning_steps': 'Learning Steps',
    'session.progress': 'Learning Progress',
    'session.complete': 'Complete',
    'session.learning_path': 'Learning Path',
    'session.step': 'Step',
    'session.of': 'of',
    'session.previous': 'Previous',
    'session.mark_complete': 'Mark Complete',
    'session.next_step': 'Next Step',
    'session.ai_tutor': 'Ask Your AI Tutor',
    'session.ai_tutor_subtitle': 'Get instant help and explanations',
    'session.ai_placeholder': 'Ask a question about this topic...',
    'session.ai_empty_title': 'Ask me anything about',
    'session.ai_empty_subtitle': 'I\'m here to help you understand better',
    'session.ai_thinking': 'AI is thinking...',
    'session.send': 'Send',
    'session.generating_path': 'Creating your personalized learning path...',
    'session.analyzing': 'Analyzing',
    'session.at_level': 'at',

    // Step Types
    'step.concept': 'concept',
    'step.example': 'example',
    'step.practice': 'practice',

    // Language Selector
    'language.english': 'English',
    'language.indonesian': 'Bahasa Indonesia',
    'language.select': 'Language'
  },
  id: {
    // Header
    'header.title': 'Asisten Belajar AI',
    'header.subtitle': 'Kuasai topik apapun, langkah demi langkah',
    'header.learning_history': 'Riwayat Belajar',
    'header.profile': 'Profil',
    'header.settings': 'Pengaturan',
    'header.sign_out': 'Keluar',

    // Auth/Loading
    'loading.message': 'Memuat asisten belajar Anda...',
    'auth.title': 'Asisten Belajar AI',
    'auth.description': 'Kuasai topik apapun melalui jalur pembelajaran yang dipersonalisasi dan bertahap dengan bantuan AI',
    'auth.sign_in_message': 'Silakan masuk untuk memulai perjalanan belajar Anda',
    'auth.sign_in_button': 'Masuk untuk Melanjutkan',

    // Topic Input
    'topic.title': 'Apa yang ingin Anda pelajari?',
    'topic.description': 'Masukkan topik apapun dan saya akan membuat jalur pembelajaran yang dipersonalisasi untuk Anda',
    'topic.placeholder': 'contoh: Machine Learning, React Hooks, Fisika Kuantum...',
    'topic.difficulty_label': 'Tingkat Kesulitan',
    'topic.difficulty.beginner': 'Pemula',
    'topic.difficulty.intermediate': 'Menengah',
    'topic.difficulty.advanced': 'Lanjutan',
    'topic.start_button': 'Mulai Perjalanan Belajar',
    'topic.popular_topics': 'Topik Populer',

    // Learning Session
    'session.back_button': '← Kembali ke Topik',
    'session.level': 'Level',
    'session.learning_steps': 'Langkah Pembelajaran',
    'session.progress': 'Progres Pembelajaran',
    'session.complete': 'Selesai',
    'session.learning_path': 'Jalur Pembelajaran',
    'session.step': 'Langkah',
    'session.of': 'dari',
    'session.previous': 'Sebelumnya',
    'session.mark_complete': 'Tandai Selesai',
    'session.next_step': 'Langkah Selanjutnya',
    'session.ai_tutor': 'Tanya Tutor AI Anda',
    'session.ai_tutor_subtitle': 'Dapatkan bantuan dan penjelasan instan',
    'session.ai_placeholder': 'Ajukan pertanyaan tentang topik ini...',
    'session.ai_empty_title': 'Tanya saya apapun tentang',
    'session.ai_empty_subtitle': 'Saya di sini untuk membantu Anda memahami lebih baik',
    'session.ai_thinking': 'AI sedang berpikir...',
    'session.send': 'Kirim',
    'session.generating_path': 'Membuat jalur pembelajaran yang dipersonalisasi untuk Anda...',
    'session.analyzing': 'Menganalisis',
    'session.at_level': 'pada level',

    // Step Types
    'step.concept': 'konsep',
    'step.example': 'contoh',
    'step.practice': 'latihan',

    // Language Selector
    'language.english': 'English',
    'language.indonesian': 'Bahasa Indonesia',
    'language.select': 'Bahasa'
  }
}
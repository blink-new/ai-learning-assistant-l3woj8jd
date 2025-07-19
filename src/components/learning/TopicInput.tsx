import { useState } from 'react'
import { Search, Sparkles, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useLanguage } from '@/contexts/LanguageContext'

interface TopicInputProps {
  onStartLearning: (topic: string, difficulty: string) => void
}

const suggestedTopics = [
  'Machine Learning Basics',
  'React Hooks',
  'Quantum Physics',
  'Data Structures',
  'Spanish Grammar',
  'Financial Markets'
]

export function TopicInput({ onStartLearning }: TopicInputProps) {
  const { t } = useLanguage()
  const [topic, setTopic] = useState('')
  const [selectedDifficulty, setSelectedDifficulty] = useState('beginner')

  const difficultyLevels = [
    { id: 'beginner', label: t('topic.difficulty.beginner'), color: 'bg-green-100 text-green-800' },
    { id: 'intermediate', label: t('topic.difficulty.intermediate'), color: 'bg-yellow-100 text-yellow-800' },
    { id: 'advanced', label: t('topic.difficulty.advanced'), color: 'bg-red-100 text-red-800' }
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (topic.trim()) {
      onStartLearning(topic.trim(), selectedDifficulty)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-2xl mb-4">
          <Sparkles className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900">{t('topic.title')}</h2>
        <p className="text-lg text-gray-600">
          {t('topic.description')}
        </p>
      </div>

      <Card className="p-6 border-2 border-gray-100 hover:border-primary/20 transition-colors">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder={t('topic.placeholder')}
              className="pl-10 h-12 text-lg border-gray-200 focus:border-primary"
            />
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700">{t('topic.difficulty_label')}</label>
            <div className="flex gap-3">
              {difficultyLevels.map((level) => (
                <button
                  key={level.id}
                  type="button"
                  onClick={() => setSelectedDifficulty(level.id)}
                  className={`px-4 py-2 rounded-lg border-2 transition-all ${
                    selectedDifficulty === level.id
                      ? 'border-primary bg-primary/5 text-primary'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {level.label}
                </button>
              ))}
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full h-12 text-lg bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
            disabled={!topic.trim()}
          >
            {t('topic.start_button')}
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </form>
      </Card>

      <div className="space-y-3">
        <p className="text-sm font-medium text-gray-700 text-center">{t('topic.popular_topics')}</p>
        <div className="flex flex-wrap gap-2 justify-center">
          {suggestedTopics.map((suggestedTopic) => (
            <Badge
              key={suggestedTopic}
              variant="secondary"
              className="cursor-pointer hover:bg-primary hover:text-white transition-colors px-3 py-1"
              onClick={() => setTopic(suggestedTopic)}
            >
              {suggestedTopic}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  )
}
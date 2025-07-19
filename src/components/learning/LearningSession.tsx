import { useState, useEffect, useCallback } from 'react'
import { ChevronRight, CheckCircle, Circle, MessageCircle, BookOpen, Lightbulb } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { useLanguage } from '@/contexts/LanguageContext'
import { blink } from '@/blink/client'
import ReactMarkdown from 'react-markdown'

interface LearningStep {
  id: string
  title: string
  content: string
  completed: boolean
  type: 'concept' | 'example' | 'practice'
}

interface LearningSessionProps {
  topic: string
  difficulty: string
  onBack: () => void
}

export function LearningSession({ topic, difficulty, onBack }: LearningSessionProps) {
  const { t, language } = useLanguage()
  const [steps, setSteps] = useState<LearningStep[]>([])
  const [currentStep, setCurrentStep] = useState(0)
  const [loading, setLoading] = useState(true)
  const [chatMessage, setChatMessage] = useState('')
  const [chatHistory, setChatHistory] = useState<Array<{role: 'user' | 'assistant', content: string}>>([])
  const [chatLoading, setChatLoading] = useState(false)

  const generateLearningPath = useCallback(async () => {
    setLoading(true)
    try {
      const { object } = await blink.ai.generateObject({
        prompt: `Create a comprehensive learning path for "${topic}" at ${difficulty} level. Break it down into 6-8 progressive steps that build upon each other. Each step should be substantial enough to provide real learning value.`,
        schema: {
          type: 'object',
          properties: {
            steps: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  title: { type: 'string' },
                  content: { type: 'string' },
                  type: { type: 'string', enum: ['concept', 'example', 'practice'] }
                },
                required: ['id', 'title', 'content', 'type']
              }
            }
          },
          required: ['steps']
        }
      })

      const learningSteps = object.steps.map((step: any) => ({
        ...step,
        completed: false
      }))

      setSteps(learningSteps)
    } catch (error) {
      console.error('Error generating learning path:', error)
    } finally {
      setLoading(false)
    }
  }, [topic, difficulty])

  useEffect(() => {
    generateLearningPath()
  }, [generateLearningPath])

  const handleStepComplete = () => {
    setSteps(prev => prev.map((step, index) => 
      index === currentStep ? { ...step, completed: true } : step
    ))
    
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1)
    }
  }

  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!chatMessage.trim()) return

    const userMessage = chatMessage
    setChatMessage('')
    setChatHistory(prev => [...prev, { role: 'user', content: userMessage }])
    setChatLoading(true)

    try {
      const { text } = await blink.ai.generateText({
        messages: [
          { role: 'system', content: `You are a helpful AI tutor teaching "${topic}" at ${difficulty} level. The user is currently on step ${currentStep + 1}: "${steps[currentStep]?.title}". Provide clear, encouraging explanations and answer their questions.` },
          ...chatHistory.map(msg => ({ role: msg.role, content: msg.content })),
          { role: 'user', content: userMessage }
        ]
      })

      setChatHistory(prev => [...prev, { role: 'assistant', content: text }])
    } catch (error) {
      console.error('Error in chat:', error)
    } finally {
      setChatLoading(false)
    }
  }

  const completedSteps = steps.filter(step => step.completed).length
  const progress = steps.length > 0 ? (completedSteps / steps.length) * 100 : 0

  const getStepIcon = (type: string) => {
    switch (type) {
      case 'concept': return <BookOpen className="w-5 h-5" />
      case 'example': return <Lightbulb className="w-5 h-5" />
      case 'practice': return <CheckCircle className="w-5 h-5" />
      default: return <Circle className="w-5 h-5" />
    }
  }

  const getStepColor = (type: string) => {
    switch (type) {
      case 'concept': return 'bg-blue-100 text-blue-800'
      case 'example': return 'bg-yellow-100 text-yellow-800'
      case 'practice': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center space-y-6">
          <div className="relative">
            <div className="animate-spin w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full mx-auto"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-6 h-6 bg-gradient-to-br from-primary to-accent rounded-full animate-pulse"></div>
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-xl font-semibold text-gray-900">Creating your personalized learning path...</p>
            <p className="text-gray-600">Analyzing "{topic}" at {difficulty} level</p>
          </div>
          <div className="flex justify-center space-x-2">
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <Button variant="ghost" onClick={onBack} className="mb-6 hover:bg-gray-100 transition-colors">
          ← Back to Topics
        </Button>
        
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
            <div className="mb-4 sm:mb-0">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{topic}</h1>
              <div className="flex items-center space-x-3">
                <Badge variant="outline" className="capitalize font-medium">
                  {difficulty} Level
                </Badge>
                <span className="text-gray-400">•</span>
                <span className="text-sm text-gray-600">{steps.length} Learning Steps</span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600 mb-1">Learning Progress</p>
              <p className="text-2xl font-bold text-primary">{completedSteps}/{steps.length}</p>
              <p className="text-sm text-gray-500">{Math.round(progress)}% Complete</p>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Progress</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-3 bg-gray-100" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Learning Steps Sidebar */}
        <div className="lg:col-span-1">
          <Card className="shadow-sm border-gray-200">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold flex items-center">
                <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                Learning Path
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {steps.map((step, index) => (
                <div
                  key={step.id}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                    index === currentStep
                      ? 'border-primary bg-gradient-to-r from-primary/5 to-accent/5 shadow-sm'
                      : step.completed
                      ? 'border-green-200 bg-green-50 hover:bg-green-100'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                  onClick={() => setCurrentStep(index)}
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-0.5">
                      <div className={`p-2 rounded-lg ${getStepColor(step.type)}`}>
                        {getStepIcon(step.type)}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium text-gray-500">Step {index + 1}</span>
                        {step.completed && <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />}
                      </div>
                      <p className="font-medium text-sm text-gray-900 leading-tight mb-2">{step.title}</p>
                      <Badge variant="secondary" className="text-xs capitalize font-medium">
                        {step.type}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Current Step */}
          {steps[currentStep] && (
            <Card className="shadow-sm border-gray-200">
              <CardHeader className="pb-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <CardTitle className="flex items-center space-x-3">
                    <div className={`p-3 rounded-xl ${getStepColor(steps[currentStep].type)} shadow-sm`}>
                      {getStepIcon(steps[currentStep].type)}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">{steps[currentStep].title}</h3>
                      <p className="text-sm text-gray-500 mt-1 capitalize">{steps[currentStep].type} Step</p>
                    </div>
                  </CardTitle>
                  <Badge variant="outline" className="capitalize font-medium px-3 py-1">
                    Step {currentStep + 1} of {steps.length}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-gray-50 rounded-xl p-6">
                  <div className="prose max-w-none prose-headings:text-gray-900 prose-headings:font-semibold prose-p:text-gray-800 prose-p:my-3 prose-ul:my-3 prose-li:my-1 prose-strong:text-gray-900 prose-strong:font-semibold prose-em:text-gray-700">
                    <ReactMarkdown>{steps[currentStep].content}</ReactMarkdown>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row justify-between gap-3 pt-2">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                    disabled={currentStep === 0}
                    className="order-2 sm:order-1"
                  >
                    <ChevronRight className="w-4 h-4 mr-2 rotate-180" />
                    Previous
                  </Button>
                  
                  {!steps[currentStep].completed ? (
                    <Button 
                      onClick={handleStepComplete} 
                      className="bg-green-600 hover:bg-green-700 text-white shadow-sm order-1 sm:order-2"
                    >
                      Mark Complete
                      <CheckCircle className="w-4 h-4 ml-2" />
                    </Button>
                  ) : (
                    <Button
                      onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}
                      disabled={currentStep === steps.length - 1}
                      className="bg-primary hover:bg-primary/90 text-white shadow-sm order-1 sm:order-2"
                    >
                      Next Step
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* AI Chat Assistant */}
          <Card className="shadow-sm border-gray-200">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-br from-primary to-accent rounded-lg">
                  <MessageCircle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <span className="text-lg font-semibold">Ask Your AI Tutor</span>
                  <p className="text-sm text-gray-500 font-normal">Get instant help and explanations</p>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="max-h-80 overflow-y-auto space-y-4 bg-gradient-to-b from-gray-50 to-white p-4 rounded-xl border">
                {chatHistory.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary/10 to-accent/10 rounded-full flex items-center justify-center mx-auto mb-3">
                      <MessageCircle className="w-6 h-6 text-primary" />
                    </div>
                    <p className="text-gray-600 font-medium">Ask me anything about {topic}!</p>
                    <p className="text-sm text-gray-500 mt-1">I'm here to help you understand better</p>
                  </div>
                ) : (
                  chatHistory.map((message, index) => (
                    <div
                      key={index}
                      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[85%] p-4 rounded-2xl ${
                          message.role === 'user'
                            ? 'bg-gradient-to-r from-primary to-accent text-white shadow-sm'
                            : 'bg-white border border-gray-200 text-gray-800 shadow-sm'
                        }`}
                      >
                        {message.role === 'user' ? (
                          <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
                        ) : (
                          <div className="text-sm leading-relaxed prose prose-sm max-w-none prose-headings:text-gray-900 prose-headings:font-semibold prose-p:text-gray-800 prose-p:my-2 prose-ul:my-2 prose-li:my-1 prose-strong:text-gray-900 prose-strong:font-semibold">
                            <ReactMarkdown>{message.content}</ReactMarkdown>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
                {chatLoading && (
                  <div className="flex justify-start">
                    <div className="bg-white border border-gray-200 p-4 rounded-2xl shadow-sm">
                      <div className="flex items-center space-x-3">
                        <div className="animate-spin w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full"></div>
                        <span className="text-sm text-gray-600">AI is thinking...</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              <form onSubmit={handleChatSubmit} className="flex space-x-3">
                <Textarea
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  placeholder="Ask a question about this topic..."
                  className="flex-1 min-h-[60px] resize-none border-gray-200 focus:border-primary rounded-xl"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault()
                      handleChatSubmit(e)
                    }
                  }}
                />
                <Button 
                  type="submit" 
                  disabled={!chatMessage.trim() || chatLoading}
                  className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white shadow-sm px-6"
                >
                  Send
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
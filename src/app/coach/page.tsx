'use client';
import { useState, useRef, useEffect } from 'react';
import { Button } from '@worldcoin/mini-apps-ui-kit-react';
import { MessageCircle, Clock } from 'lucide-react';
import StepProgress from '@/components/coach/StepProgress';
import ClaritySnapshot from '@/components/coach/ClaritySnapshot';

// Step icons for SIGMA framework
const stepIcons: Record<string, string> = {
  intro: '💬',
  situation: '🔍',
  identify: '🧭',
  gut: '💢',
  mental: '🧠',
  action: '🔄',
  completed: '📸'
};

interface Message {
  role: 'user' | 'assistant';
  content: string;
  step?: string; // Track which SIGMA step this message belongs to
}

interface Snapshot {
  situation: string;
  belief: string;
  feeling: string;
  mental: string;
  action: string;
  mantra: string;
  affirmation: string;
  journal: string;
}

export default function CoachPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState<string>('intro');
  const [sessionTime, setSessionTime] = useState<number>(0);
  const [showEmailInput, setShowEmailInput] = useState<boolean>(false);
  const [isPremiumPrompt, setIsPremiumPrompt] = useState<boolean>(false);
  const [showSnapshot, setShowSnapshot] = useState<boolean>(false);
  const [snapshot, setSnapshot] = useState<Snapshot | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const timerInterval = useRef<NodeJS.Timeout | null>(null);

  const conversationStarters = [
    "I'm facing a situation that I want to understand better. Can you guide me through it with the SIGMA model?",
    "I had an emotional trigger today, and I want clarity. Can we break it down?",
    "I feel like there's a deeper belief or story behind this. Can you help me identify it?",
    "I keep running into the same pattern. How do I finally break it using SIGMA Coaching?"
  ];

  // Initial welcome message from Coach Clarity
  const welcomeMessage: Message = {
    role: 'assistant',
    content: "I'm Clarity, your personal clarity coach. In just 10 minutes, thanks to the SIGMA Coaching model, we'll break through the noise, unravel what's really going on, and find a path forward that feels powerful and aligned.\n\nWhere would you like to begin?",
    step: 'intro'
  };

  // Initialize with welcome message if empty
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([welcomeMessage]);
    }
  }, [messages.length]);

  // Start session timer
  useEffect(() => {
    timerInterval.current = setInterval(() => {
      setSessionTime(prev => prev + 1);
    }, 1000);
    
    return () => {
      if (timerInterval.current) clearInterval(timerInterval.current);
    };
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    // Handle premium subscription prompt
    if (isPremiumPrompt) {
      if (input.toLowerCase().includes('yes')) {
        setMessages(prev => [...prev, 
          { role: 'user', content: input, step: currentStep },
          { role: 'assistant', content: "Great! To upgrade to premium and save all your Clarity Snapshots, please visit our subscription page. With premium, you'll get unlimited access to your personal growth journey and deeper insights.", step: currentStep }
        ]);
        setIsPremiumPrompt(false);
      } else {
        setMessages(prev => [...prev, 
          { role: 'user', content: input, step: currentStep },
          { role: 'assistant', content: "No problem! Your Clarity Snapshot is still available in this session. Would you like to start a new coaching session?", step: currentStep }
        ]);
        setIsPremiumPrompt(false);
      }
      setInput('');
      return;
    }
    
    // Handle email input
    if (showEmailInput) {
      if (input.includes('@')) {
        setMessages(prev => [...prev, 
          { role: 'user', content: input, step: currentStep },
          { role: 'assistant', content: `Perfect! I've sent your Clarity Snapshot to ${input}. Would you like to save this snapshot for future reference? (Premium feature)`, step: currentStep }
        ]);
        setShowEmailInput(false);
        setIsPremiumPrompt(true);
      } else {
        setMessages(prev => [...prev, 
          { role: 'user', content: input, step: currentStep },
          { role: 'assistant', content: "That doesn't appear to be a valid email address. Would you like to try again or continue without sending an email?", step: currentStep }
        ]);
        setShowEmailInput(false);
      }
      setInput('');
      return;
    }

    const userMessage: Message = { role: 'user', content: input, step: currentStep };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...messages, userMessage],
        }),
      });

      const data = await response.json();
      
      // Update current step if provided by the API
      if (data.currentStep) {
        setCurrentStep(data.currentStep);
      } else {
        // Try to detect step from message content
        setCurrentStep(detectStepFromContent(data.message));
      }
      
      // Check if this is a prompt for email
      if (data.message.includes('Would you like a copy sent to your email')) {
        setShowEmailInput(true);
      }
      
      // Check if this is a premium feature prompt
      if (data.message.includes('save this Clarity Snapshot') && 
          data.message.includes('Premium')) {
        setIsPremiumPrompt(true);
      }
      
      // Check if this is a Clarity Snapshot
      if (data.message.includes('Clarity Snapshot') && 
          data.message.includes('The real issue is not') &&
          currentStep === 'completed') {
        // Parse the snapshot from the message
        const snapshotMatch = data.message.match(/Clarity Snapshot:([\s\S]*?)(?=Would you like|$)/);
        if (snapshotMatch) {
          const snapshotText = snapshotMatch[1];
          // Extract snapshot data using regex patterns
          const situation = snapshotText.match(/Situation: (.*?)(?=\n|$)/)?.[1] || '';
          const belief = snapshotText.match(/Belief: (.*?)(?=\n|$)/)?.[1] || '';
          const feeling = snapshotText.match(/Feeling: (.*?)(?=\n|$)/)?.[1] || '';
          const mental = snapshotText.match(/Mental: (.*?)(?=\n|$)/)?.[1] || '';
          const action = snapshotText.match(/Action: (.*?)(?=\n|$)/)?.[1] || '';
          const mantra = snapshotText.match(/Mantra: (.*?)(?=\n|$)/)?.[1] || '';
          const affirmation = snapshotText.match(/Affirmation: (.*?)(?=\n|$)/)?.[1] || '';
          const journal = snapshotText.match(/Journal: (.*?)(?=\n|$)/)?.[1] || '';
          
          setSnapshot({
            situation,
            belief,
            feeling,
            mental,
            action,
            mantra,
            affirmation,
            journal
          });
          setShowSnapshot(true);
        }
      }
      
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: data.message,
        step: data.currentStep || detectStepFromContent(data.message)
      }]);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'I apologize, but I encountered an error. Please try again.',
        step: currentStep
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  // Helper to detect step from message content
  const detectStepFromContent = (content: string): string => {
    if (content.includes('🔍 S – Situation') || content.includes('What triggered you?')) {
      return 'situation';
    } else if (content.includes('🧭 I – Identify') || content.includes('What belief, fear, or inner story')) {
      return 'identify';
    } else if (content.includes('💢 G – Gut Feeling') || content.includes('What is real right now in your body')) {
      return 'gut';
    } else if (content.includes('🧠 M – Mental Response') || content.includes('How is your mind justifying')) {
      return 'mental';
    } else if (content.includes('🔄 A – Aligned Action') || content.includes('What small, empowered action')) {
      return 'action';
    } else if (content.includes('Clarity Snapshot') && content.includes('Would you like a copy')) {
      return 'completed';
    }
    return 'intro';
  };

  // Handle starting new session with a conversation starter
  const handleStarterClick = (starter: string) => {
    setInput(starter);
  };
  
  // Reset conversation
  const handleNewSession = () => {
    setMessages([welcomeMessage]);
    setCurrentStep('intro');
    setSessionTime(0);
    setShowEmailInput(false);
    setIsPremiumPrompt(false);
    setShowSnapshot(false);
  };

  const handleSaveSnapshot = () => {
    // Implement snapshot saving logic
    alert('Snapshot saved! (Premium feature)');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header with step information and timer */}
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-4xl mx-auto py-3 px-4 flex justify-between items-center">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
              <MessageCircle className="text-purple-600" size={20} />
            </div>
            <div className="ml-3">
              <h1 className="text-lg font-medium dark:text-white">Coach Clarity</h1>
              {currentStep !== 'intro' && (
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  <span>{stepIcons[currentStep]} {currentStep.charAt(0).toUpperCase() + currentStep.slice(1)}</span>
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center text-sm font-medium text-gray-500 dark:text-gray-400">
            <Clock size={16} className="mr-1" />
            {formatTime(sessionTime)}
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto p-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            I&apos;m Clarity, Your Clarity Coach
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            Let&apos;s break through what&apos;s holding you back, one clear step at a time.
          </p>
        </div>

        {/* Progress Bar */}
        <StepProgress currentStep={currentStep} sessionTime={sessionTime} />

        {/* Chat Container */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 mb-4 h-[600px] flex flex-col">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto mb-4 space-y-4">
            {messages.length === 0 ? (
              <div className="space-y-4">
                <p className="text-gray-600 dark:text-gray-300 text-center">
                  How would you like to begin your clarity journey?
                </p>
                <div className="grid grid-cols-1 gap-4">
                  {conversationStarters.map((starter, index) => (
                    <button
                      key={index}
                      onClick={() => handleStarterClick(starter)}
                      className="p-4 text-left bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                    >
                      {starter}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-4 ${
                      message.role === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                    }`}
                  >
                    {message.role === 'assistant' && message.step && message.step !== 'intro' && (
                      <div className="text-sm font-medium mb-1 text-purple-600 dark:text-purple-400">
                        {stepIcons[message.step || 'intro']} {message.step.charAt(0).toUpperCase() + message.step.slice(1)}
                      </div>
                    )}
                    <div className="whitespace-pre-wrap">{message.content}</div>
                  </div>
                </div>
              ))
            )}
            {isLoading && (
              <div className="flex justify-start">
                <div className="max-w-[80%] rounded-lg p-4 bg-gray-100 dark:bg-gray-700">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 rounded-full bg-gray-300 dark:bg-gray-500 animate-bounce"></div>
                    <div className="w-2 h-2 rounded-full bg-gray-300 dark:bg-gray-500 animate-bounce delay-75"></div>
                    <div className="w-2 h-2 rounded-full bg-gray-300 dark:bg-gray-500 animate-bounce delay-150"></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="flex gap-2">
            {currentStep === 'intro' && messages.length <= 1 ? (
              // Show conversation starters on small screens
              <div className="md:hidden w-full">
                <select 
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  onChange={(e) => setInput(e.target.value)}
                  value=""
                >
                  <option value="" disabled>Choose a starting point...</option>
                  {conversationStarters.map((starter, index) => (
                    <option key={index} value={starter}>
                      {starter.length > 60 ? starter.substring(0, 57) + '...' : starter}
                    </option>
                  ))}
                </select>
              </div>
            ) : null}
            
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
              placeholder={showEmailInput ? "Enter your email address..." : "Type your message..."}
              className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              disabled={isLoading}
            />
            <Button
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="px-4"
            >
              {isLoading ? 'Sending...' : 'Send'}
            </Button>
          </div>
          
          {currentStep === 'completed' && (
            <div className="mt-4 flex justify-end">
              <Button
                onClick={handleNewSession}
                className="px-4"
              >
                New Session
              </Button>
            </div>
          )}
          
          <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            Clarity AI provides general information only. It is not medical, financial, therapeutic, or professional advice.
          </div>
        </div>
      </div>
      
      {/* Clarity Snapshot Modal */}
      {showSnapshot && snapshot && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <ClaritySnapshot
            snapshot={snapshot}
            onClose={() => setShowSnapshot(false)}
            onSave={handleSaveSnapshot}
          />
        </div>
      )}
    </div>
  );
}
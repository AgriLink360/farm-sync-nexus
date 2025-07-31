
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  MessageCircle, 
  Send, 
  Bot, 
  User, 
  Minimize2, 
  Maximize2,
  X
} from 'lucide-react';

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
}

interface AIChatbotProps {
  userType?: 'farmer' | 'buyer' | 'logistics';
}

const AIChatbot: React.FC<AIChatbotProps> = ({ userType = 'farmer' }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isMinimized, setIsMinimized] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isVisible && messages.length === 0) {
      // Add welcome message based on user type
      const welcomeMessage = getWelcomeMessage(userType);
      setMessages([{
        id: '1',
        type: 'bot',
        content: welcomeMessage,
        timestamp: new Date()
      }]);
    }
  }, [isVisible, userType]);

  const getWelcomeMessage = (type: string) => {
    switch (type) {
      case 'farmer':
        return "Hello! I'm your AgriLink360 farming assistant. I can help you with crop pricing, market trends, connecting with buyers, and agricultural best practices. How can I assist you today?";
      case 'buyer':
        return "Welcome! I'm your AgriLink360 procurement assistant. I can help you find suppliers, analyze market prices, manage contracts, and optimize your supply chain. What would you like to know?";
      case 'logistics':
        return "Hi there! I'm your AgriLink360 logistics assistant. I can help with route optimization, fleet management, delivery scheduling, and connecting with farmers and buyers. How can I help?";
      default:
        return "Hello! I'm your AgriLink360 AI assistant. I can help with agricultural trading, market insights, and connecting stakeholders. What can I do for you?";
    }
  };

  const generateBotResponse = async (userMessage: string): Promise<string> => {
    // Simulate AI responses based on user type and message content
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('price') || lowerMessage.includes('cost')) {
      return "Based on current market data, here are the trending prices:\n\n🌾 Wheat: ₹22/kg (+2% from last week)\n🍚 Rice: ₹28/kg (stable)\n🌽 Maize: ₹19/kg (+5% from last week)\n\nThese are AI-suggested prices based on demand, quality, and market conditions. Would you like specific pricing for your location?";
    }
    
    if (lowerMessage.includes('buyer') || lowerMessage.includes('sell')) {
      return "I found several verified buyers interested in your crops:\n\n🏢 Fresh Foods Co. - Looking for Premium Wheat (500kg)\n🏢 Organic Mart - Needs Quality Rice (300kg)\n🏢 Local Cooperative - Bulk Maize orders\n\nWould you like me to connect you with any of these buyers or show you more options?";
    }
    
    if (lowerMessage.includes('logistics') || lowerMessage.includes('transport')) {
      return "Here are available logistics partners near you:\n\n🚚 Regional Transport - ₹10/km, 4.7★ rating\n🚚 Express Delivery - ₹18/km, 4.8★ rating\n🚚 Farm Fresh Logistics - ₹12/km, 4.6★ rating\n\nAll partners are verified and offer real-time tracking. Which service would you prefer?";
    }
    
    if (lowerMessage.includes('weather') || lowerMessage.includes('climate')) {
      return "🌤️ Weather forecast for your area:\n\nToday: Partly cloudy, 28°C\nTomorrow: Light rain expected (good for irrigation)\nWeek ahead: Moderate temperatures, ideal for crop growth\n\n💡 AI Recommendation: Consider harvesting wheat before expected rain on Thursday.";
    }
    
    if (lowerMessage.includes('contract') || lowerMessage.includes('agreement')) {
      return "I can help you with smart contracts! Here's what I can do:\n\n✅ Draft standardized agreements\n✅ AI risk assessment (currently 96% accuracy)\n✅ Auto-fill based on market rates\n✅ Legal compliance check\n\nWould you like me to prepare a contract template for your current deal?";
    }
    
    return "I understand you're asking about " + userMessage + ". Let me provide you with relevant information based on our AgriLink360 database and market intelligence. Could you be more specific about what aspect you'd like to know more about?";
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const newUserMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newUserMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Simulate API delay
      setTimeout(async () => {
        const botResponse = await generateBotResponse(inputMessage);
        
        const newBotMessage: Message = {
          id: (Date.now() + 1).toString(),
          type: 'bot',
          content: botResponse,
          timestamp: new Date()
        };

        setMessages(prev => [...prev, newBotMessage]);
        setIsLoading(false);
      }, 1500);
    } catch (error) {
      setIsLoading(false);
      toast({
        title: "Error",
        description: "Failed to get AI response. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isVisible) {
    return (
      <Button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-6 right-6 rounded-full w-14 h-14 shadow-lg hover:shadow-xl transition-all duration-300"
        size="lg"
      >
        <MessageCircle className="h-6 w-6" />
      </Button>
    );
  }

  return (
    <div className={`fixed ${isMinimized ? 'bottom-6 right-6' : 'bottom-6 right-6'} z-50 transition-all duration-300`}>
      <Card className={`${isMinimized ? 'w-80 h-14' : 'w-96 h-[600px]'} shadow-xl transition-all duration-300`}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-primary" />
              <div>
                <CardTitle className="text-lg">AI Assistant</CardTitle>
                {!isMinimized && (
                  <CardDescription className="text-xs">
                    <Badge variant="outline" className="text-xs">
                      {userType} support
                    </Badge>
                  </CardDescription>
                )}
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMinimized(!isMinimized)}
                className="h-8 w-8 p-0"
              >
                {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsVisible(false)}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        {!isMinimized && (
          <CardContent className="flex flex-col h-full p-4 pt-0">
            <div className="flex-1 overflow-y-auto space-y-4 mb-4 max-h-[400px]">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[80%] rounded-lg p-3 ${
                    message.type === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  }`}>
                    <div className="flex items-start gap-2">
                      {message.type === 'bot' && <Bot className="h-4 w-4 mt-0.5 flex-shrink-0" />}
                      {message.type === 'user' && <User className="h-4 w-4 mt-0.5 flex-shrink-0" />}
                      <div className="text-sm whitespace-pre-line">{message.content}</div>
                    </div>
                    <div className="text-xs opacity-70 mt-1">
                      {message.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-muted rounded-lg p-3 max-w-[80%]">
                    <div className="flex items-center gap-2">
                      <Bot className="h-4 w-4" />
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-current rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                        <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="flex gap-2">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything about AgriLink360..."
                disabled={isLoading}
                className="flex-1"
              />
              <Button 
                onClick={handleSendMessage}
                disabled={isLoading || !inputMessage.trim()}
                size="sm"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
};

export default AIChatbot;

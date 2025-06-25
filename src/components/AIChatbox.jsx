import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Send, Sparkles, User, ArrowDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAIChatParser } from '@/hooks/useAIChatParser';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

const QuickReply = ({ text, onQuickReply }) => (
  <motion.button
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    onClick={() => onQuickReply(text)}
    className="bg-primary/10 text-primary text-sm font-medium px-3 py-1.5 rounded-full border border-primary/20 hover:bg-primary/20 transition-colors"
  >
    {text}
  </motion.button>
);

export const AIChatbox = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([
    { 
      role: 'ai', 
      content: "Hi! 👋 I’m GoAI. I can help you find a rental in CDO. Just tell me your budget, preferred location, and what type of space you’re looking for!",
      quickReplies: ["Studio under ₱5K", "Near Limketkai", "Female Only"]
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const { parseQuery } = useAIChatParser();
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSendMessage = (text) => {
    const query = text.trim();
    if (query === '') return;

    const userMessage = { role: 'user', content: query };
    setMessages(prev => [...prev, userMessage]);

    const { filters, response } = parseQuery(query);
    
    setTimeout(() => {
      const aiResponse = { role: 'ai', content: response };
      if (Object.keys(filters).length > 0) {
        aiResponse.action = () => navigate('/listings', { state: { filters } });
      }
      setMessages(prev => [...prev, aiResponse]);
    }, 600);

    setInputValue('');
  };

  const handleQuickReply = (text) => {
    handleSendMessage(text);
  };

  return (
    <motion.div 
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, delay: 0.5 }}
      className="bg-card rounded-2xl shadow-2xl border w-full h-[55vh] max-h-[450px] flex flex-col overflow-hidden"
    >
      <div className="p-4 border-b flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
          <Bot className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h3 className="font-semibold text-foreground">GoAI Assistant</h3>
          <p className="text-xs text-muted-foreground">Your friendly rental finder</p>
        </div>
      </div>

      <div className="flex-grow overflow-y-auto p-4 space-y-6 no-scrollbar">
        <AnimatePresence>
          {messages.map((message, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={cn("flex items-end gap-2", message.role === 'user' ? "justify-end" : "justify-start")}
            >
              {message.role === 'ai' && <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center flex-shrink-0"><Bot className="w-4 h-4 text-muted-foreground" /></div>}
              <div className="flex flex-col gap-2 items-start max-w-[85%]">
                <div
                  className={cn(
                    "rounded-2xl px-4 py-2.5 text-sm",
                    message.role === 'user'
                      ? "bg-primary text-primary-foreground rounded-br-none"
                      : "bg-muted text-foreground rounded-bl-none"
                  )}
                >
                  <p>{message.content}</p>
                </div>
                {message.action && (
                  <Button onClick={message.action} size="sm" className="h-8">
                    <Sparkles className="w-3.5 h-3.5 mr-2" /> See Listings
                  </Button>
                )}
                {message.quickReplies && (
                  <div className="flex flex-wrap gap-2 pt-2">
                    {message.quickReplies.map(qr => <QuickReply key={qr} text={qr} onQuickReply={handleQuickReply} />)}
                  </div>
                )}
              </div>
              {message.role === 'user' && <div className="w-6 h-6 rounded-full bg-primary/80 text-primary-foreground flex items-center justify-center flex-shrink-0"><User className="w-4 h-4" /></div>}
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      <div className="p-3 border-t bg-card">
        <div className="flex items-center gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(inputValue)}
            placeholder="e.g., Apartment near Centrio"
            className="flex-grow bg-muted border-transparent focus:border-primary focus:ring-primary"
          />
          <Button onClick={() => handleSendMessage(inputValue)} size="icon" disabled={!inputValue.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
};
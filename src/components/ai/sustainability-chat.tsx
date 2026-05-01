'use client';

import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bot, User, Send, Loader2, AlertCircle } from 'lucide-react';
import { sustainabilityAssistantChat } from '@/ai/flows/sustainability-assistant';
import { cn } from '@/lib/utils';

type Message = {
  role: 'user' | 'model';
  content: string;
  isError?: boolean;
};

export function SustainabilityChat() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', content: "Hi! I'm EcoBot. I can help you find ways to save energy and water at home. Ask me anything!" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const history = messages
        .filter(m => !m.isError)
        .map(m => ({ role: m.role, content: m.content }));
      
      const response = await sustainabilityAssistantChat({
        message: userMessage,
        history: history.slice(-5)
      });

      setMessages((prev) => [...prev, { role: 'model', content: response.reply }]);
    } catch (error: any) {
      console.error('Chat error:', error);
      const errorMessage = error.message?.includes('high demand') 
        ? "I'm currently receiving too many requests. Please wait a moment and try again!" 
        : "Sorry, I'm having trouble connecting right now. Please try again later.";
        
      setMessages((prev) => [...prev, { 
        role: 'model', 
        content: errorMessage,
        isError: true
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="flex flex-col h-[600px] shadow-lg border-primary/20">
      <CardHeader className="flex flex-row items-center gap-2 border-b bg-muted/30">
        <div className="p-2 bg-primary/10 rounded-full">
          <Bot className="h-5 w-5 text-primary" />
        </div>
        <div>
          <CardTitle className="text-lg">EcoBot Assistant</CardTitle>
          <p className="text-xs text-muted-foreground">Ask for sustainability tips</p>
        </div>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden p-0">
        <ScrollArea className="h-full p-4" ref={scrollRef}>
          <div className="space-y-4">
            {messages.map((m, i) => (
              <div key={i} className={cn("flex gap-3", m.role === 'user' ? "justify-end" : "justify-start")}>
                {m.role === 'model' && (
                  <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center shrink-0">
                    <Bot className="h-4 w-4" />
                  </div>
                )}
                <div className={cn(
                  "max-w-[80%] rounded-lg p-3 text-sm flex gap-2 items-start",
                  m.role === 'user' ? "bg-primary text-primary-foreground" : "bg-muted",
                  m.isError && "bg-destructive/10 text-destructive border border-destructive/20"
                )}>
                  {m.isError && <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />}
                  {m.content}
                </div>
                {m.role === 'user' && (
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <User className="h-4 w-4" />
                  </div>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-3 justify-start">
                <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center shrink-0">
                  <Bot className="h-4 w-4" />
                </div>
                <div className="bg-muted rounded-lg p-3 flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-xs">Thinking...</span>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
      <CardFooter className="p-4 border-t bg-muted/10">
        <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex w-full gap-2">
          <Input 
            placeholder="How can I save water?" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
            className="bg-background"
          />
          <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
}

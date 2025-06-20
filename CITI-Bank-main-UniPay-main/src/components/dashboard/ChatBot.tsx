import React, { useEffect, useRef, useState } from 'react';
import { MessageSquare, X, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=';
const API_KEY = 'AIzaSyAFxwIMf9uiXHax67oNyicjHWQk1vG33o8';

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { type: 'bot', text: 'Hi! I’m your assistant. Ask me anything 🔍' },
  ]);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    const userMessage = { type: 'user', text: message };
    setChatMessages((prev) => [...prev, userMessage]);

    try {
      const res = await fetch(`${GEMINI_API_URL}${API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: message }] }],
        }),
      });

      const data = await res.json();
      const botText = data?.candidates?.[0]?.content?.parts?.[0]?.text || 'Sorry, I couldn’t understand that.';

      setChatMessages((prev) => [...prev, { type: 'bot', text: botText }]);
    } catch (error) {
      console.error('Error:', error);
      setChatMessages((prev) => [
        ...prev,
        { type: 'bot', text: 'Something went wrong. Please try again later.' },
      ]);
    }

    setMessage('');
  };

  return (
    <>
      {/* Chat Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          className="rounded-full w-14 h-14 bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl transition-all duration-200"
          title="Chat with Assistant"
        >
          <MessageSquare size={24} />
        </Button>
      </div>

      {/* Chat Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="flex-1 bg-black bg-opacity-50"
            onClick={() => setIsOpen(false)}
          />

          {/* Chat Panel */}
          <div className="w-80 bg-white shadow-xl animate-slide-in-right">
            <Card className="h-full rounded-none border-0 flex flex-col">
              <CardHeader className="border-b">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Virtual Assistant</CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsOpen(false)}
                    className="h-8 w-8 p-0"
                  >
                    <X size={16} />
                  </Button>
                </div>
              </CardHeader>

              <div className="flex flex-col flex-1 overflow-hidden">
                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {chatMessages.map((msg, index) => (
                    <div
                      key={index}
                      className={`flex ${
                        msg.type === 'user' ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      <div
                        className={`max-w-xs px-3 py-2 rounded-lg text-sm ${
                          msg.type === 'user'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {msg.text}
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="border-t p-4">
                  <div className="flex gap-2">
                    <Input
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Type your message..."
                      onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                      className="flex-1"
                    />
                    <Button
                      onClick={handleSendMessage}
                      size="icon"
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <Send size={16} />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBot;

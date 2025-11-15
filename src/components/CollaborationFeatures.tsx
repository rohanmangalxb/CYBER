import React, { useState, useEffect } from 'react';
import { Users, MessageSquare, User, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface Analyst {
  id: string;
  name: string;
  email: string;
  status: 'online' | 'away' | 'offline';
  cursorX?: number;
  cursorY?: number;
  color: string;
}

interface ChatMessage {
  id: string;
  userId: string;
  userName: string;
  message: string;
  timestamp: string;
}

interface Annotation {
  id: string;
  userId: string;
  userName: string;
  text: string;
  x: number;
  y: number;
  timestamp: string;
}

export const CollaborationFeatures: React.FC = () => {
  const { toast } = useToast();
  const [analysts, setAnalysts] = useState<Analyst[]>([
    { id: '1', name: 'John Doe', email: 'john@company.com', status: 'online', color: '#3b82f6' },
    { id: '2', name: 'Jane Smith', email: 'jane@company.com', status: 'online', color: '#10b981' },
    { id: '3', name: 'Bob Wilson', email: 'bob@company.com', status: 'away', color: '#f59e0b' }
  ]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [showChat, setShowChat] = useState(true);

  useEffect(() => {
    // Simulate cursor movement for other analysts
    const interval = setInterval(() => {
      setAnalysts(prev => prev.map(analyst => {
        if (analyst.status === 'online' && Math.random() > 0.7) {
          return {
            ...analyst,
            cursorX: Math.random() * 100,
            cursorY: Math.random() * 100
          };
        }
        return analyst;
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const message: ChatMessage = {
      id: `msg_${Date.now()}`,
      userId: 'current_user',
      userName: 'You',
      message: newMessage,
      timestamp: new Date().toISOString()
    };

    setChatMessages(prev => [...prev, message]);
    setNewMessage('');

    toast({
      title: "Message Sent",
      description: "Your message has been sent to all analysts"
    });
  };

  const handleAddAnnotation = () => {
    const annotation: Annotation = {
      id: `ann_${Date.now()}`,
      userId: 'current_user',
      userName: 'You',
      text: 'Important threat detected',
      x: Math.random() * 80 + 10,
      y: Math.random() * 80 + 10,
      timestamp: new Date().toISOString()
    };

    setAnnotations(prev => [...prev, annotation]);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Team Collaboration</h2>
        <Button
          onClick={() => setShowChat(!showChat)}
          variant="outline"
          className="border-gray-600 text-gray-300"
        >
          <MessageSquare className="w-4 h-4 mr-2" />
          {showChat ? 'Hide' : 'Show'} Chat
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Analysts */}
        <div className="bg-gray-900/50 backdrop-blur rounded-lg p-6 border-2 border-gray-700">
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <Users className="w-5 h-5" />
            Active Analysts ({analysts.filter(a => a.status === 'online').length})
          </h3>
          <div className="space-y-3">
            {analysts.map(analyst => (
              <div key={analyst.id} className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg">
                <div className="relative">
                  <div 
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold"
                    style={{ backgroundColor: analyst.color }}
                  >
                    {analyst.name[0]}
                  </div>
                  <div 
                    className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-gray-800 ${
                      analyst.status === 'online' ? 'bg-green-500' :
                      analyst.status === 'away' ? 'bg-yellow-500' :
                      'bg-gray-500'
                    }`}
                  />
                </div>
                <div className="flex-1">
                  <p className="text-white font-semibold">{analyst.name}</p>
                  <p className="text-xs text-gray-400">{analyst.email}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Live Chat */}
        {showChat && (
          <div className="lg:col-span-2 bg-gray-900/50 backdrop-blur rounded-lg p-6 border-2 border-gray-700 flex flex-col" style={{ height: '500px' }}>
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              Team Chat
            </h3>
            
            <div className="flex-1 overflow-y-auto space-y-3 mb-4">
              {chatMessages.length === 0 ? (
                <p className="text-gray-400 text-center py-8">No messages yet. Start the conversation!</p>
              ) : (
                chatMessages.map(msg => (
                  <div key={msg.id} className={`flex gap-3 ${msg.userId === 'current_user' ? 'justify-end' : ''}`}>
                    <div className={`max-w-[70%] ${msg.userId === 'current_user' ? 'bg-blue-600/20 border-blue-500/50' : 'bg-gray-800/50 border-gray-700'} rounded-lg p-3 border`}>
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-sm font-semibold text-white">{msg.userName}</p>
                        <p className="text-xs text-gray-400">
                          {new Date(msg.timestamp).toLocaleTimeString()}
                        </p>
                      </div>
                      <p className="text-gray-300">{msg.message}</p>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Type a message..."
                className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
              />
              <Button
                onClick={handleSendMessage}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Shared Annotations */}
      <div className="bg-gray-900/50 backdrop-blur rounded-lg p-6 border-2 border-gray-700">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-white">Shared Annotations</h3>
          <Button
            onClick={handleAddAnnotation}
            size="sm"
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            Add Annotation
          </Button>
        </div>

        <div className="relative bg-gray-800/30 rounded-lg" style={{ height: '300px' }}>
          {/* Live Cursors */}
          {analysts
            .filter(a => a.status === 'online' && a.cursorX !== undefined)
            .map(analyst => (
              <div
                key={analyst.id}
                className="absolute pointer-events-none"
                style={{
                  left: `${analyst.cursorX}%`,
                  top: `${analyst.cursorY}%`,
                  transform: 'translate(-50%, -50%)'
                }}
              >
                <User 
                  className="w-6 h-6 drop-shadow-lg"
                  style={{ color: analyst.color }}
                />
                <span 
                  className="text-xs font-semibold px-2 py-1 rounded shadow-lg"
                  style={{ 
                    backgroundColor: analyst.color,
                    color: 'white'
                  }}
                >
                  {analyst.name}
                </span>
              </div>
            ))}

          {/* Annotations */}
          {annotations.map(annotation => (
            <div
              key={annotation.id}
              className="absolute"
              style={{
                left: `${annotation.x}%`,
                top: `${annotation.y}%`,
                transform: 'translate(-50%, -50%)'
              }}
            >
              <div className="bg-yellow-500/90 text-gray-900 px-3 py-2 rounded-lg shadow-lg text-sm max-w-xs">
                <p className="font-semibold">{annotation.userName}</p>
                <p>{annotation.text}</p>
                <p className="text-xs opacity-75 mt-1">
                  {new Date(annotation.timestamp).toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

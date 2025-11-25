import { useState } from 'react';
import { Bot, Send } from 'lucide-react';

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

const MOCK_RESPONSES = [
    "I can help you find books in our library. What are you looking for?",
    "We have a great collection on that topic. Let me search our catalog.",
    "The book you're looking for is available in Section B, Row 3.",
    "Our library is open Monday-Friday, 9 AM - 8 PM, and Saturday 10 AM - 6 PM.",
    "You can borrow up to 3 books as a student, or 10 books as a teacher.",
    "To renew a book, please visit your dashboard or contact the librarian.",
];

export const AILibrarian = () => {
    const [messages, setMessages] = useState<Message[]>([
        { role: 'assistant', content: 'Hello! I\'m your AI Library Assistant. How can I help you today?' }
    ]);
    const [input, setInput] = useState('');
    const [isOpen, setIsOpen] = useState(false);

    const handleSend = () => {
        if (!input.trim()) return;

        const userMessage: Message = { role: 'user', content: input };
        setMessages(prev => [...prev, userMessage]);

        // Mock AI response
        setTimeout(() => {
            const randomResponse = MOCK_RESPONSES[Math.floor(Math.random() * MOCK_RESPONSES.length)];
            const aiMessage: Message = { role: 'assistant', content: randomResponse };
            setMessages(prev => [...prev, aiMessage]);
        }, 1000);

        setInput('');
    };

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-8 right-8 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg flex items-center gap-2 z-50"
            >
                <Bot size={24} />
                <span className="font-bold">AI Librarian</span>
            </button>
        );
    }

    return (
        <div className="fixed bottom-8 right-8 w-96 h-[500px] bg-slate-900 border border-slate-700 rounded-lg shadow-2xl flex flex-col z-50">
            <div className="bg-blue-600 p-4 rounded-t-lg flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Bot size={24} />
                    <span className="font-bold">AI Library Assistant</span>
                </div>
                <button onClick={() => setIsOpen(false)} className="text-white hover:text-slate-200">
                    ✕
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg, idx) => (
                    <div
                        key={idx}
                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div
                            className={`max-w-[80%] p-3 rounded-lg ${msg.role === 'user'
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-slate-800 text-slate-100'
                                }`}
                        >
                            {msg.content}
                        </div>
                    </div>
                ))}
            </div>

            <div className="p-4 border-t border-slate-700">
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Ask me anything..."
                        className="flex-1 bg-slate-800 border border-slate-700 rounded p-2 text-white focus:outline-none focus:border-blue-500"
                    />
                    <button
                        onClick={handleSend}
                        className="bg-blue-600 hover:bg-blue-700 p-2 rounded"
                    >
                        <Send size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
};

import { Book } from 'lucide-react';
import { BorrowButton } from '../circulation/BorrowButton';

interface BookProps {
    bookId: string;
    title: string;
    author: string;
    category: string;
    available: boolean;
    coverUrl?: string;
    onBorrow?: () => void;
}

export const BookCard = ({ bookId, title, author, category, available, coverUrl, onBorrow }: BookProps) => {
    return (
        <div className="bg-slate-800 rounded-lg overflow-hidden border border-slate-700 hover:border-blue-500 transition-all group">
            <div className="h-48 bg-slate-700 relative overflow-hidden">
                {coverUrl ? (
                    <img src={coverUrl} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-500">
                        <Book size={48} />
                    </div>
                )}
                <div className={`absolute top-2 right-2 px-2 py-1 rounded text-xs font-bold ${available ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                    {available ? 'Available' : 'Out of Stock'}
                </div>
            </div>
            <div className="p-4">
                <div className="text-xs text-blue-400 mb-1 uppercase tracking-wider">{category}</div>
                <h3 className="text-lg font-serif font-bold text-white leading-tight mb-1 truncate">{title}</h3>
                <p className="text-slate-400 text-sm mb-3 truncate">{author}</p>
                {available && <BorrowButton bookId={bookId} onSuccess={onBorrow} />}
            </div>
        </div>
    );
};

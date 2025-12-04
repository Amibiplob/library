import { useState, useEffect } from 'react';
import { BookCard } from './BookCard';
import { Search } from 'lucide-react';

interface Book {
    _id: string;
    title: string;
    authors: string[];
    category: string;
    availableCopies: number;
    coverImage?: string;
}

export const CatalogPage = () => {
    const [books, setBooks] = useState<Book[]>([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchBooks();
    }, []);

    const fetchBooks = async (query = '') => {
        setLoading(true);
        try {
            const url = query
                ? `https://libery-server-six.vercel.app//api/v1/books?search=${query}`
                : `https://libery-server-six.vercel.app//api/v1/books`;

            const res = await fetch(url);
            const data = await res.json();
            setBooks(data.books || []);
        } catch (error) {
            console.error('Failed to fetch books', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        fetchBooks(search);
    };

    return (
        <div className="min-h-screen bg-slate-950 text-white p-8">
            <div className="max-w-7xl mx-auto">
                <header className="mb-12 flex justify-between items-center">
                    <div>
                        <h1 className="text-4xl font-serif font-bold mb-2">The Stacks</h1>
                        <p className="text-slate-400">Explore the university's digital collection.</p>
                    </div>
                    <div className="flex items-center gap-4">
                        {/* User Profile / Logout could go here */}
                    </div>
                </header>

                <div className="mb-12">
                    <form onSubmit={handleSearch} className="relative max-w-2xl">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search by title, author, or subject..."
                            className="w-full bg-slate-900 border border-slate-800 rounded-xl py-4 pl-12 pr-4 text-lg focus:outline-none focus:border-blue-500 transition-colors"
                        />
                    </form>
                </div>

                {loading ? (
                    <div className="text-center py-20 text-slate-500">Loading library catalog...</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {books.map((book) => (
                            <BookCard
                                key={book._id}
                                bookId={book._id}
                                title={book.title}
                                author={book.authors.join(', ')}
                                category={book.category}
                                available={book.availableCopies > 0}
                                coverUrl={book.coverImage}
                                onBorrow={() => fetchBooks(search)}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

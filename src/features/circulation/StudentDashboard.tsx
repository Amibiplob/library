import { useState, useEffect } from 'react';
import { useAuthStore } from '../auth/auth.store';
import { BookOpen, Calendar } from 'lucide-react';

interface Loan {
    _id: string;
    book: {
        title: string;
        authors: string[];
        coverImage?: string;
    };
    dueDate: string;
    status: string;
}

export const StudentDashboard = () => {
    const [loans, setLoans] = useState<Loan[]>([]);
    const [loading, setLoading] = useState(true);
    const user = useAuthStore((state) => state.user);

    useEffect(() => {
        if (user) {
            fetchLoans();
        }
    }, [user]);

    const fetchLoans = async () => {
        if (!user) return;

        try {
            const res = await fetch(`https://libery-server-six.vercel.app//api/v1/circulation/my-loans?userId=${user._id}`);
            const data = await res.json();
            setLoans(data || []);
        } catch (error) {
            console.error('Failed to fetch loans', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 text-white p-8">
            <div className="max-w-7xl mx-auto">
                <header className="mb-12">
                    <h1 className="text-4xl font-serif font-bold mb-2">My Library</h1>
                    <p className="text-slate-400">Welcome back, {user?.name}</p>
                </header>

                <div className="mb-8">
                    <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                        <BookOpen size={24} />
                        Active Loans
                    </h2>

                    {loading ? (
                        <div className="text-slate-500">Loading your loans...</div>
                    ) : loans.length === 0 ? (
                        <div className="bg-slate-900 border border-slate-800 rounded-lg p-8 text-center text-slate-500">
                            No active loans. Visit the catalog to borrow books.
                        </div>
                    ) : (
                        <div className="grid gap-4">
                            {loans.map((loan) => (
                                <div key={loan._id} className="bg-slate-900 border border-slate-800 rounded-lg p-6 flex items-center gap-6">
                                    <div className="w-16 h-24 bg-slate-700 rounded flex items-center justify-center text-slate-500">
                                        <BookOpen size={32} />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-xl font-bold mb-1">{loan.book.title}</h3>
                                        <p className="text-slate-400 text-sm mb-2">{loan.book.authors.join(', ')}</p>
                                        <div className="flex items-center gap-2 text-sm text-slate-500">
                                            <Calendar size={16} />
                                            Due: {new Date(loan.dueDate).toLocaleDateString()}
                                        </div>
                                    </div>
                                    <div className={`px-3 py-1 rounded text-sm font-bold ${loan.status === 'ACTIVE' ? 'bg-blue-500/20 text-blue-400' : 'bg-slate-700 text-slate-400'
                                        }`}>
                                        {loan.status}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

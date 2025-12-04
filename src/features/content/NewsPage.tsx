import { useState, useEffect } from 'react';
import { Newspaper, Calendar } from 'lucide-react';

interface NewsItem {
    _id: string;
    title: string;
    content: string;
    category: string;
    publishedAt: string;
    author: {
        profile: {
            name: string;
        };
    };
}

export const NewsPage = () => {
    const [news, setNews] = useState<NewsItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchNews();
    }, []);

    const fetchNews = async () => {
        try {
            const res = await fetch(`${SERVER_API_URL}/api/v1/content/news`);
            const data = await res.json();
            setNews(data.news || []);
        } catch (error) {
            console.error('Failed to fetch news', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 text-white p-8">
            <div className="max-w-4xl mx-auto">
                <header className="mb-12">
                    <h1 className="text-4xl font-serif font-bold mb-2 flex items-center gap-3">
                        <Newspaper size={36} />
                        University News
                    </h1>
                    <p className="text-slate-400">Stay updated with the latest from City University Library</p>
                </header>

                {loading ? (
                    <div className="text-center py-20 text-slate-500">Loading news...</div>
                ) : news.length === 0 ? (
                    <div className="bg-slate-900 border border-slate-800 rounded-lg p-8 text-center text-slate-500">
                        No news available at the moment.
                    </div>
                ) : (
                    <div className="space-y-6">
                        {news.map((item) => (
                            <article key={item._id} className="bg-slate-900 border border-slate-800 rounded-lg p-6 hover:border-blue-500 transition-colors">
                                <div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
                                    <Calendar size={16} />
                                    {new Date(item.publishedAt).toLocaleDateString()}
                                    <span className="mx-2">•</span>
                                    <span className="text-blue-400">{item.category}</span>
                                </div>
                                <h2 className="text-2xl font-bold mb-3">{item.title}</h2>
                                <p className="text-slate-300 leading-relaxed">{item.content}</p>
                                <div className="mt-4 text-sm text-slate-500">
                                    By {item.author?.profile?.name || 'Unknown'}
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

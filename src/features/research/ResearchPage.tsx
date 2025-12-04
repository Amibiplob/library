import { useState, useEffect } from 'react';
import { FileText, Filter } from 'lucide-react';

interface ResearchPaper {
    _id: string;
    title: string;
    abstract: string;
    program: string;
    submittedAt: string;
    authors: Array<{ profile: { name: string } }>;
}

const PROGRAMS = ['All', 'CSE', 'EEE', 'BBA', 'English', 'Law', 'Pharmacy'];

export const ResearchPage = () => {
    const [papers, setPapers] = useState<ResearchPaper[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedProgram, setSelectedProgram] = useState('All');
    const [selectedPaper, setSelectedPaper] = useState<ResearchPaper | null>(null);
    const [citation, setCitation] = useState('');

    useEffect(() => {
        fetchPapers();
    }, [selectedProgram]);

    const fetchPapers = async () => {
        try {
            const url = selectedProgram === 'All'
                ? `https://libery-server-six.vercel.app//api/v1/research`
                : `https://libery-server-six.vercel.app//api/v1/research?program=${selectedProgram}`;

            const res = await fetch(url);
            const data = await res.json();
            setPapers(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Failed to fetch research', error);
        } finally {
            setLoading(false);
        }
    };

    const generateCitation = async (paperId: string, format: string) => {
        try {
            const res = await fetch(`https://libery-server-six.vercel.app//api/v1/research/${paperId}/citation/${format}`);
            const data = await res.json();
            setCitation(data.citation);
        } catch (error) {
            console.error('Failed to generate citation', error);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 text-white p-8">
            <div className="max-w-7xl mx-auto">
                <header className="mb-12">
                    <h1 className="text-4xl font-serif font-bold mb-2">Research Archive</h1>
                    <p className="text-slate-400">Explore academic research from City University</p>
                </header>

                <div className="mb-8 flex items-center gap-4">
                    <Filter size={20} className="text-slate-400" />
                    <div className="flex gap-2 flex-wrap">
                        {PROGRAMS.map((prog) => (
                            <button
                                key={prog}
                                onClick={() => setSelectedProgram(prog)}
                                className={`px-4 py-2 rounded transition-colors ${selectedProgram === prog
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                                    }`}
                            >
                                {prog}
                            </button>
                        ))}
                    </div>
                </div>

                {loading ? (
                    <div className="text-center py-20 text-slate-500">Loading research papers...</div>
                ) : papers.length === 0 ? (
                    <div className="bg-slate-900 border border-slate-800 rounded-lg p-8 text-center text-slate-500">
                        No research papers found for {selectedProgram}.
                    </div>
                ) : (
                    <div className="grid gap-6">
                        {papers.map((paper) => (
                            <div key={paper._id} className="bg-slate-900 border border-slate-800 rounded-lg p-6">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <FileText size={20} className="text-blue-400" />
                                            <span className="text-sm font-bold text-blue-400">{paper.program}</span>
                                        </div>
                                        <h2 className="text-2xl font-bold mb-3">{paper.title}</h2>
                                        <p className="text-slate-300 mb-4">{paper.abstract}</p>
                                        <div className="text-sm text-slate-500">
                                            Authors: {paper.authors.map(a => a.profile.name).join(', ')}
                                        </div>
                                        <div className="text-sm text-slate-500">
                                            Submitted: {new Date(paper.submittedAt).toLocaleDateString()}
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-4 pt-4 border-t border-slate-800 flex gap-2">
                                    <button
                                        onClick={() => {
                                            setSelectedPaper(paper);
                                            generateCitation(paper._id, 'apa');
                                        }}
                                        className="text-sm bg-slate-800 hover:bg-slate-700 px-3 py-1 rounded"
                                    >
                                        Cite (APA)
                                    </button>
                                    <button
                                        onClick={() => generateCitation(paper._id, 'mla')}
                                        className="text-sm bg-slate-800 hover:bg-slate-700 px-3 py-1 rounded"
                                    >
                                        Cite (MLA)
                                    </button>
                                    <button
                                        onClick={() => generateCitation(paper._id, 'chicago')}
                                        className="text-sm bg-slate-800 hover:bg-slate-700 px-3 py-1 rounded"
                                    >
                                        Cite (Chicago)
                                    </button>
                                </div>

                                {selectedPaper?._id === paper._id && citation && (
                                    <div className="mt-4 p-4 bg-slate-800 rounded border border-slate-700">
                                        <div className="text-sm text-slate-400 mb-1">Citation:</div>
                                        <div className="text-sm font-mono">{citation}</div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

import { Link, useLocation } from 'react-router-dom';
import { Home, BookOpen, Newspaper, FileText, Users, LogOut } from 'lucide-react';
import { useAuthStore } from '../features/auth/auth.store';

export const Navigation = () => {
    const location = useLocation();
    const { user, logout } = useAuthStore();

    if (!user || location.pathname === '/login') return null;

    const isActive = (path: string) => location.pathname === path;

    const navItems = [
        { path: '/dashboard', icon: Home, label: 'Dashboard' },
        { path: '/catalog', icon: BookOpen, label: 'Catalog' },
        { path: '/news', icon: Newspaper, label: 'News' },
        { path: '/research', icon: FileText, label: 'Research' },
    ];

    if (user.role === 'ADMIN') {
        navItems.push({ path: '/admin', icon: Users, label: 'Admin' });
    }

    return (
        <nav className="bg-slate-900 border-b border-slate-800 px-8 py-4">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                <div className="flex items-center gap-8">
                    <Link to="/dashboard" className="text-xl font-serif font-bold text-white">
                        City University Library
                    </Link>
                    <div className="flex gap-4">
                        {navItems.map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center gap-2 px-4 py-2 rounded transition-colors ${isActive(item.path)
                                        ? 'bg-blue-600 text-white'
                                        : 'text-slate-400 hover:text-white hover:bg-slate-800'
                                    }`}
                            >
                                <item.icon size={18} />
                                {item.label}
                            </Link>
                        ))}
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <span className="text-slate-400 text-sm">{user.name}</span>
                    <button
                        onClick={() => {
                            logout();
                            window.location.href = '/login';
                        }}
                        className="flex items-center gap-2 text-slate-400 hover:text-white"
                    >
                        <LogOut size={18} />
                        Logout
                    </button>
                </div>
            </div>
        </nav>
    );
};

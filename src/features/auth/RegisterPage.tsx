import { useState } from 'react';
import { useAuthStore } from './auth.store';
import { useNavigate } from 'react-router-dom';

export const RegisterPage = () => {
    const [universityId, setUniversityId] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const register = useAuthStore((state) => state.register); // Optional if you auto-login
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            const response = await fetch(`https://libery-server-six.vercel.app//api/v1/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ universityId, name, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Registration failed');
            }

            // Optional: auto-login after registration
            register?.({
                _id: data._id,
                universityId: data.universityId,
                role: data.role,
                name: data.name
            }, data.token);

            navigate('/dashboard'); // Redirect after successful registration
        } catch (err) {
            setError((err as Error).message);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-950">
            <div className="bg-slate-900 p-8 rounded-lg shadow-xl w-96 border border-slate-800">
                <h2 className="text-3xl font-bold text-white mb-6 text-center font-serif">Register Account</h2>
                {error && <div className="bg-red-500/10 text-red-400 p-3 rounded mb-4 text-sm">{error}</div>}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-slate-400 mb-1 text-sm">University ID</label>
                        <input
                            type="text"
                            value={universityId}
                            onChange={(e) => setUniversityId(e.target.value)}
                            className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white focus:outline-none focus:border-blue-500"
                            placeholder="e.g. 2023-10-55"
                        />
                    </div>
                    <div>
                        <label className="block text-slate-400 mb-1 text-sm">Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white focus:outline-none focus:border-blue-500"
                            placeholder="Your full name"
                        />
                    </div>
                    <div>
                        <label className="block text-slate-400 mb-1 text-sm">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white focus:outline-none focus:border-blue-500"
                            placeholder="••••••••"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition-colors"
                    >
                        Register
                    </button>
                    <p className="block text-slate-400 mb-1 text-sm">Already have an account?
				<a rel="noopener noreferrer" href="/login" className="hover:underline ml-4 text-slate-400">Sign In</a>.
			</p>
                </form>
            </div>
        </div>
    );
};

import { useState, useEffect } from 'react';
import { Users, Plus, Trash2 } from 'lucide-react';

interface User {
    _id: string;
    universityId: string;
    role: string;
    profile: {
        name: string;
        department?: string;
        email?: string;
    };
}

export const AdminDashboard = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [formData, setFormData] = useState({
        universityId: '',
        password: '',
        name: '',
        role: 'STUDENT',
        department: '',
        email: '',
    });

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await fetch('http://localhost:5000/api/v1/admin/users');
            const data = await res.json();
            setUsers(data.users || []);
        } catch (error) {
            console.error('Failed to fetch users', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch('http://localhost:5000/api/v1/admin/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                alert('User created successfully!');
                setShowCreateForm(false);
                setFormData({ universityId: '', password: '', name: '', role: 'STUDENT', department: '', email: '' });
                fetchUsers();
            } else {
                const data = await res.json();
                alert(data.message || 'Failed to create user');
            }
        } catch (error) {
            alert('Error creating user');
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this user?')) return;

        try {
            const res = await fetch(`http://localhost:5000/api/v1/admin/users/${id}`, {
                method: 'DELETE',
            });

            if (res.ok) {
                alert('User deleted successfully!');
                fetchUsers();
            }
        } catch (error) {
            alert('Error deleting user');
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 text-white p-8">
            <div className="max-w-7xl mx-auto">
                <header className="mb-12 flex justify-between items-center">
                    <div>
                        <h1 className="text-4xl font-serif font-bold mb-2">Admin Dashboard</h1>
                        <p className="text-slate-400">Manage users and system configuration</p>
                    </div>
                    <button
                        onClick={() => setShowCreateForm(!showCreateForm)}
                        className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded flex items-center gap-2"
                    >
                        <Plus size={20} />
                        Create User
                    </button>
                </header>

                {showCreateForm && (
                    <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 mb-8">
                        <h2 className="text-2xl font-bold mb-4">Create New User</h2>
                        <form onSubmit={handleCreate} className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-slate-400 mb-1 text-sm">University ID</label>
                                <input
                                    type="text"
                                    value={formData.universityId}
                                    onChange={(e) => setFormData({ ...formData, universityId: e.target.value })}
                                    className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-slate-400 mb-1 text-sm">Password</label>
                                <input
                                    type="password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-slate-400 mb-1 text-sm">Name</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-slate-400 mb-1 text-sm">Role</label>
                                <select
                                    value={formData.role}
                                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                    className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white"
                                >
                                    <option value="STUDENT">Student</option>
                                    <option value="TEACHER">Teacher</option>
                                    <option value="LIBRARIAN">Librarian</option>
                                    <option value="ADMIN">Admin</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-slate-400 mb-1 text-sm">Department</label>
                                <input
                                    type="text"
                                    value={formData.department}
                                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                                    className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white"
                                />
                            </div>
                            <div>
                                <label className="block text-slate-400 mb-1 text-sm">Email</label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white"
                                />
                            </div>
                            <div className="col-span-2 flex gap-2">
                                <button type="submit" className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded">
                                    Create
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowCreateForm(false)}
                                    className="bg-slate-700 hover:bg-slate-600 px-6 py-2 rounded"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                <div className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden">
                    <div className="p-6 border-b border-slate-800">
                        <h2 className="text-2xl font-bold flex items-center gap-2">
                            <Users size={24} />
                            All Users
                        </h2>
                    </div>

                    {loading ? (
                        <div className="p-8 text-center text-slate-500">Loading users...</div>
                    ) : (
                        <table className="w-full">
                            <thead className="bg-slate-800">
                                <tr>
                                    <th className="text-left p-4 text-slate-400 font-medium">University ID</th>
                                    <th className="text-left p-4 text-slate-400 font-medium">Name</th>
                                    <th className="text-left p-4 text-slate-400 font-medium">Role</th>
                                    <th className="text-left p-4 text-slate-400 font-medium">Department</th>
                                    <th className="text-left p-4 text-slate-400 font-medium">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((user) => (
                                    <tr key={user._id} className="border-t border-slate-800 hover:bg-slate-800/50">
                                        <td className="p-4">{user.universityId}</td>
                                        <td className="p-4">{user.profile.name}</td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 rounded text-xs font-bold ${user.role === 'ADMIN' ? 'bg-red-500/20 text-red-400' :
                                                    user.role === 'LIBRARIAN' ? 'bg-purple-500/20 text-purple-400' :
                                                        user.role === 'TEACHER' ? 'bg-blue-500/20 text-blue-400' :
                                                            'bg-green-500/20 text-green-400'
                                                }`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="p-4 text-slate-400">{user.profile.department || '-'}</td>
                                        <td className="p-4">
                                            <button
                                                onClick={() => handleDelete(user._id)}
                                                className="text-red-400 hover:text-red-300"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
};

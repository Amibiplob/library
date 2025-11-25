import { useState } from 'react';
import { useAuthStore } from '../auth/auth.store';

interface BorrowButtonProps {
    bookId: string;
    onSuccess?: () => void;
}

export const BorrowButton = ({ bookId, onSuccess }: BorrowButtonProps) => {
    const [loading, setLoading] = useState(false);
    const user = useAuthStore((state) => state.user);

    const handleBorrow = async () => {
        if (!user) return;

        setLoading(true);

        try {
            const response = await fetch('http://localhost:5000/api/v1/circulation/borrow', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    bookId,
                    userId: user._id,
                    role: user.role
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to borrow');
            }

            alert('Book borrowed successfully!');
            onSuccess?.();
        } catch (err) {
            alert((err as Error).message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handleBorrow}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 text-white font-bold py-2 px-4 rounded transition-colors"
        >
            {loading ? 'Borrowing...' : 'Borrow'}
        </button>
    );
};

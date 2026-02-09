
import React, { useState } from 'react';
import { useAppStore } from './store';
import { api } from './api';
import { Button, Input, Card } from './commonComponents';
import { NotificationType } from './types';

const LoginPage: React.FC = () => {
    const { login, addNotification, setPage } = useAppStore();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !password) {
            addNotification('Please enter email and password.', NotificationType.ERROR);
            return;
        }
        setIsLoading(true);
        const response = await api.login(email, password);
        setIsLoading(false);
        if (response.success && response.user) {
            login(response.user);
            addNotification(response.message, NotificationType.SUCCESS);
        } else {
            addNotification(response.message, NotificationType.ERROR);
        }
    };

    return (
        <div className="flex items-center justify-center w-full py-12">
            <Card className="w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-white">BK Academy</h1>
                    <p className="text-slate-400">Login to access your dashboard</p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <Input
                        id="email"
                        label="Email or Username"
                        type="text"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email or username"
                        required
                    />
                    <Input
                        id="password"
                        label="Password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        required
                    />
                    <Button type="submit" className="w-full" isLoading={isLoading}>
                        Login
                    </Button>
                </form>
                <p className="text-center text-slate-400 mt-6">
                    Don't have an account?{' '}
                    <button onClick={() => setPage('register')} className="font-semibold text-sky-500 hover:text-sky-400">
                        Register here
                    </button>
                </p>
            </Card>
        </div>
    );
};

export default LoginPage;

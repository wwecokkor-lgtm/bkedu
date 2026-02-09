
import type { User } from './types';
import { Role } from './types';
import { mockUsers, simulateDelay } from './db';

export const authApi = {
    login: async (email: string, password_unused: string): Promise<{ success: boolean; user?: User; message: string }> => {
        await simulateDelay(500);
        const user = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
        if (!user) return { success: false, message: 'Invalid credentials.' };
        if (user.status === 'Banned' || user.status === 'Suspended') {
            return { success: false, message: `Your account is currently ${user.status}. Please contact support.` };
        }
        if (user.status === 'Pending') {
            return { success: false, message: `Your account is pending approval.` };
        }
        user.role = user.email.toLowerCase() === 'fffgamer066@gmail.com' ? Role.SUPER_ADMIN : user.role;
        user.lastLoginAt = new Date();
        return { success: true, user: { ...user, isFirstVisit: false }, message: 'Login successful!' };
    },
    register: async (formData: any): Promise<{ success: boolean; user?: User; message: string }> => {
        await simulateDelay(1000);
        if (mockUsers.some(u => u.email.toLowerCase() === formData.email.toLowerCase())) {
            return { success: false, message: 'An account with this email already exists.' };
        }
        // FIX: Added missing 'coins' and 'coinTransactions' properties to match the User type.
        const newUser: User = {
            id: String(mockUsers.length + 1),
            username: formData.fullName,
            email: formData.email,
            role: Role.USER,
            avatarUrl: formData.avatarUrl || 'https://picsum.photos/seed/newuser/200',
            createdAt: new Date(),
            enrolledCourseIds: [],
            wishlistCourseIds: [],
            status: 'Active',
            agreementStatus: 'Not Agreed',
            isFirstVisit: true,
            phone: formData.phone,
            dob: formData.dob,
            gender: formData.gender,
            grade: formData.grade,
            school: formData.school,
            medium: formData.medium,
            address: formData.address,
            coins: 0,
            coinTransactions: [],
            badges: [],
        };
        mockUsers.push(newUser);
        return { success: true, user: newUser, message: 'Registration successful! Welcome to BK Academy.' };
    },
};

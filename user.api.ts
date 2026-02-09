
import type { User, UserStatus, ExamAttempt, UserActivity } from './types';
import { Role } from './types';
import { mockUsers, simulateDelay, logAdminAction, mockExamAttempts, mockUserActivities } from './db';

export const userApi = {
    getUsers: async (): Promise<User[]> => {
        await simulateDelay(300);
        return [...mockUsers];
    },
    updateUserStatus: async (adminId: string, userId: string, status: UserStatus, reason?: string): Promise<{ success: boolean; message: string }> => {
        await simulateDelay(500);
        const user = mockUsers.find(u => u.id === userId);
        if (!user) return { success: false, message: 'User not found.' };
        if (user.role === Role.SUPER_ADMIN) return { success: false, message: 'Cannot change the status of a Super Admin.' };
        user.status = status;
        user.statusReason = reason;
        logAdminAction(adminId, `Updated status of ${user.username} to ${status}`, 'User', userId);
        return { success: true, message: `User status updated to ${status}.` };
    },
    updateUserRole: async (adminId: string, userId: string, role: Role): Promise<{ success: boolean; message: string }> => {
        await simulateDelay(500);
        const adminUser = mockUsers.find(u => u.id === adminId);
        const targetUser = mockUsers.find(u => u.id === userId);

        if (!adminUser || !targetUser) return { success: false, message: 'User not found.' };
        
        // Security: Only Super Admin can change roles to/from Super Admin. No one can demote a Super Admin.
        if (targetUser.role === Role.SUPER_ADMIN && adminUser.role !== Role.SUPER_ADMIN) {
             return { success: false, message: 'Only a Super Admin can modify another Super Admin.' };
        }
        if (role === Role.SUPER_ADMIN && adminUser.role !== Role.SUPER_ADMIN) {
            return { success: false, message: 'You do not have permission to assign Super Admin role.'};
        }

        targetUser.role = role;
        logAdminAction(adminId, `Updated role of ${targetUser.username} to ${role}`, 'User', userId);
        return { success: true, message: `User role updated to ${role}.` };
    },
    updateUserAgreement: async (userId: string, version: string): Promise<{ success: boolean; user?: User; message: string }> => {
        await simulateDelay(500);
        const user = mockUsers.find(u => u.id === userId);
        if (!user) return { success: false, message: 'User not found.' };
        user.agreementStatus = 'Agreed';
        user.agreementTimestamp = new Date();
        user.agreedInstructionVersion = version;
        user.isFirstVisit = false; // Mark first visit flow as complete
        return { success: true, user, message: 'Agreement accepted.' };
    },
    toggleWishlist: async (userId: string, courseId: string): Promise<{ success: boolean; user?: User; message: string }> => {
        await simulateDelay(300);
        const user = mockUsers.find(u => u.id === userId);
        if(!user) return { success: false, message: 'User not found.' };
        const index = user.wishlistCourseIds.indexOf(courseId);
        if (index > -1) {
            user.wishlistCourseIds.splice(index, 1);
            return { success: true, user, message: 'Removed from wishlist.' };
        }  else {
            user.wishlistCourseIds.push(courseId);
            return { success: true, user, message: 'Added to wishlist!' };
        }
    },
    toggleBookmarkPost: async (userId: string, postId: string): Promise<{ success: boolean; user?: User; message: string }> => {
        await simulateDelay(200);
        const user = mockUsers.find(u => u.id === userId);
        if (!user) return { success: false, message: 'User not found.' };
        user.bookmarkedPostIds = user.bookmarkedPostIds || [];
        const bookmarkIndex = user.bookmarkedPostIds.indexOf(postId);
        let message;
        if (bookmarkIndex > -1) {
            user.bookmarkedPostIds.splice(bookmarkIndex, 1);
            message = 'Post removed from bookmarks.';
        } else {
            user.bookmarkedPostIds.push(postId);
            message = 'Post bookmarked!';
        }
        return { success: true, user: {...user}, message };
    },
    getExamAttemptsForUser: async (userId: string): Promise<ExamAttempt[]> => {
        await simulateDelay(400);
        return mockExamAttempts.filter(att => att.userId === userId).sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
    },
    getUserActivity: async (userId: string): Promise<UserActivity[]> => {
        await simulateDelay(300);
        // In a real app, this would be a specific query. Here we just return all for demo.
        return [...mockUserActivities].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    },
    updateUserProfile: async (userId: string, data: Partial<User>): Promise<{ success: boolean; user?: User; message: string }> => {
        await simulateDelay(600);
        const userIndex = mockUsers.findIndex(u => u.id === userId);
        if (userIndex === -1) return { success: false, message: "User not found." };
        
        // Security: Prevent Super Admin's core details from being changed via this generic endpoint
        if(mockUsers[userIndex].role === Role.SUPER_ADMIN) {
            if (data.email && data.email !== mockUsers[userIndex].email) {
                return { success: false, message: "Super Admin email cannot be changed." };
            }
            if(data.role && data.role !== Role.SUPER_ADMIN) {
                return { success: false, message: "Super Admin role cannot be changed." };
            }
        }
        
        mockUsers[userIndex] = { ...mockUsers[userIndex], ...data };
        return { success: true, user: mockUsers[userIndex], message: "Profile updated successfully!" };
    },
    changePassword: async (userId: string, oldPass: string, newPass: string): Promise<{ success: boolean; message: string }> => {
        await simulateDelay(1000);
        const user = mockUsers.find(u => u.id === userId);
        if (!user) return { success: false, message: 'User not found.' };
        
        // Security: Prevent Super Admin password change from UI
        if(user.role === Role.SUPER_ADMIN) {
            return { success: false, message: 'Super Admin password cannot be changed from the user interface for security reasons.' };
        }

        // Simulate password check
        if (oldPass === "password123") {
            return { success: true, message: "Password changed successfully!" };
        }
        return { success: false, message: "Incorrect old password." };
    },
    requestAccountDeletion: async (userId: string): Promise<{ success: boolean; message: string }> => {
        await simulateDelay(1500);
        const user = mockUsers.find(u => u.id === userId);
        if (user) {
            if (user.role === Role.SUPER_ADMIN) {
                return { success: false, message: "Super Admin account cannot be deleted." };
            }
            // In a real app, you'd flag this for admin review.
            console.log(`Deletion request for user: ${user.email}`);
            return { success: true, message: "Account deletion request submitted. An admin will review it." };
        }
        return { success: false, message: "User not found." };
    },
};

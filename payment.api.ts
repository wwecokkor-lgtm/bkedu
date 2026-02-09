
import type { Order, PaymentMethod, User } from './types';
import { mockOrders, mockPaymentMethods, mockUsers, simulateDelay, logAdminAction } from './db';

export const paymentApi = {
    getOrders: async (): Promise<Order[]> => {
        await simulateDelay(300);
        return [...mockOrders];
    },
    getPaymentMethods: async (): Promise<PaymentMethod[]> => {
        await simulateDelay(200);
        return [...mockPaymentMethods];
    },
    createPaymentMethod: async (adminId: string, methodData: Omit<PaymentMethod, 'id'>): Promise<{ success: boolean; method?: PaymentMethod; message: string }> => {
        await simulateDelay(500);
        const newMethod: PaymentMethod = { ...methodData, id: `pm${mockPaymentMethods.length + 1}` };
        mockPaymentMethods.push(newMethod);
        logAdminAction(adminId, `Created payment method: ${newMethod.name}`, 'PaymentMethod', newMethod.id);
        return { success: true, method: newMethod, message: 'Payment method created.' };
    },
    updatePaymentMethod: async (adminId: string, methodId: string, methodData: Partial<PaymentMethod>): Promise<{ success: boolean; method?: PaymentMethod; message: string }> => {
        await simulateDelay(500);
        const methodIndex = mockPaymentMethods.findIndex(m => m.id === methodId);
        if (methodIndex === -1) return { success: false, message: 'Payment method not found.' };
        mockPaymentMethods[methodIndex] = { ...mockPaymentMethods[methodIndex], ...methodData };
        logAdminAction(adminId, `Updated payment method: ${mockPaymentMethods[methodIndex].name}`, 'PaymentMethod', methodId);
        return { success: true, method: mockPaymentMethods[methodIndex], message: 'Payment method updated.' };
    },
    deletePaymentMethod: async (adminId: string, methodId: string): Promise<{ success: boolean; message: string }> => {
        await simulateDelay(500);
        const methodIndex = mockPaymentMethods.findIndex(m => m.id === methodId);
        if (methodIndex === -1) return { success: false, message: 'Payment method not found.' };

        const method = mockPaymentMethods[methodIndex];
        // FIX: Mutate the array in place using splice instead of reassigning the imported variable.
        mockPaymentMethods.splice(methodIndex, 1);

        logAdminAction(adminId, `Deleted payment method: ${method.name}`, 'PaymentMethod', methodId);
        return { success: true, message: 'Payment method deleted.' };
    },
    submitManualPayment: async (orderData: Omit<Order, 'id' | 'createdAt' | 'status'>): Promise<{ success: boolean; message: string }> => {
        await simulateDelay(1000);
        const newOrder: Order = { ...orderData, id: `o${mockOrders.length + 1}`, createdAt: new Date(), status: 'Pending' };
        mockOrders.push(newOrder);
        return { success: true, message: 'Payment request submitted! It will be verified shortly.' };
    },
    approvePayment: async (adminId: string, orderId: string): Promise<{ success: boolean; message: string }> => {
        await simulateDelay(1000);
        const order = mockOrders.find(o => o.id === orderId);
        const user = mockUsers.find(u => u.id === order?.userId);
        if (!order || !user) return { success: false, message: 'Order or user not found.' };
        order.status = 'Completed';
        if (!user.enrolledCourseIds.includes(order.courseId)) {
            user.enrolledCourseIds.push(order.courseId);
        }
        logAdminAction(adminId, `Approved payment for order ${orderId}`, 'Order', orderId);
        return { success: true, message: 'Payment approved and course access granted.' };
    },
    rejectPayment: async (adminId: string, orderId: string, reason: string): Promise<{ success: boolean; message: string }> => {
        await simulateDelay(500);
        const order = mockOrders.find(o => o.id === orderId);
        if (!order) return { success: false, message: 'Order not found.' };
        order.status = 'Rejected';
        order.rejectionReason = reason;
        logAdminAction(adminId, `Rejected payment for order ${orderId}`, 'Order', orderId);
        return { success: true, message: 'Payment has been rejected.' };
    },
    purchaseWithCoins: async (userId: string, courseId: string, coinsUsed: number): Promise<{ success: boolean; user?: User; message: string }> => {
        await simulateDelay(800);
        const user = mockUsers.find(u => u.id === userId);
        if (!user) return { success: false, message: 'User not found.' };
        if (user.coins < coinsUsed) return { success: false, message: 'Not enough coins.' };
        
        user.coins -= coinsUsed;
        user.enrolledCourseIds.push(courseId);
        user.coinTransactions.push({
            id: `ctx-${Date.now()}`,
            type: 'Spent',
            amount: coinsUsed,
            description: `Enrolled in course ${courseId}`,
            timestamp: new Date()
        });

        // Create a completed order for record keeping
        const newOrder: Order = {
            id: `o${mockOrders.length + 1}`,
            userId: user.id,
            courseId: courseId,
            courseTitle: 'Course purchased with coins', // Simplified for now
            amount: coinsUsed,
            finalAmount: coinsUsed,
            status: 'Completed',
            createdAt: new Date(),
            paymentMethod: 'Coins',
        };
        mockOrders.push(newOrder);
        
        return { success: true, user: {...user}, message: `Successfully enrolled using ${coinsUsed} coins!` };
    },
};

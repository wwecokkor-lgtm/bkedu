
import type { Course, User } from './types';
import { mockCourses, mockUsers, simulateDelay, logAdminAction } from './db';

export const courseApi = {
    getCourses: async (isPreview: boolean = false): Promise<Course[]> => {
        await simulateDelay(300);
        if (isPreview) {
            return [...mockCourses];
        }
        return [...mockCourses.filter(c => c.publishStatus === 'Published')];
    },
    getCourseById: async (id: string): Promise<Course | undefined> => {
        await simulateDelay(200);
        return mockCourses.find(c => c.id === id);
    },
    createCourse: async (adminId: string, courseData: Omit<Course, 'id' | 'createdAt' | 'updatedAt'>): Promise<{ success: boolean; course?: Course; message: string }> => {
        await simulateDelay(1000);
        const newCourse: Course = { ...courseData, id: `c${mockCourses.length + 1}`, createdAt: new Date(), updatedAt: new Date() };
        mockCourses.push(newCourse);
        logAdminAction(adminId, `Created course: ${newCourse.title}`, 'Course', newCourse.id);
        return { success: true, course: newCourse, message: 'Course created successfully!' };
    },
    updateCourse: async (adminId: string, courseId: string, courseData: Partial<Course>): Promise<{ success: boolean; course?: Course; message: string }> => {
        await simulateDelay(1000);
        const courseIndex = mockCourses.findIndex(c => c.id === courseId);
        if (courseIndex === -1) return { success: false, message: 'Course not found.' };
        mockCourses[courseIndex] = { ...mockCourses[courseIndex], ...courseData, updatedAt: new Date() };
        logAdminAction(adminId, `Updated course: ${mockCourses[courseIndex].title}`, 'Course', courseId);
        return { success: true, course: mockCourses[courseIndex], message: 'Course updated successfully!' };
    },
    deleteCourse: async (adminId: string, courseId: string): Promise<{ success: boolean; message: string }> => {
        await simulateDelay(500);
        const courseIndex = mockCourses.findIndex(c => c.id === courseId);
        if (courseIndex === -1) return { success: false, message: 'Course not found.' };
        
        const course = mockCourses[courseIndex];
        // FIX: Mutate the array in place using splice instead of reassigning the imported variable.
        mockCourses.splice(courseIndex, 1);
        
        mockUsers.forEach(u => {
            u.enrolledCourseIds = u.enrolledCourseIds.filter(id => id !== courseId);
        });
        logAdminAction(adminId, `Deleted course: ${course.title}`, 'Course', courseId);
        return { success: true, message: 'Course deleted successfully.' };
    },
    enrollInCourse: async (userId: string, courseId: string): Promise<{ success: boolean; message: string; user?: User }> => {
        await simulateDelay(1500);
        const user = mockUsers.find(u => u.id === userId);
        const course = mockCourses.find(c => c.id === courseId);
        if (!user || !course) return { success: false, message: 'User or Course not found.' };
        if (user.enrolledCourseIds.includes(courseId)) return { success: false, message: 'You are already enrolled.' };
        if (course.price > 0) return { success: false, message: 'This course requires payment.' };
        user.enrolledCourseIds.push(courseId);
        return { success: true, message: `Successfully enrolled in ${course.title}!`, user };
    },
};

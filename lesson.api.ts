
import type { User, Lesson, Course, Comment } from './types';
import { mockUsers, mockCourses, simulateDelay } from './db';

const findLesson = (lessonId: string): { course: Course | undefined; lesson: Lesson | undefined } => {
    for (const course of mockCourses) {
        const lesson = course.lessons.find(l => l.id === lessonId);
        if (lesson) return { course, lesson };
    }
    return { course: undefined, lesson: undefined };
};

export const lessonApi = {
    updateLessonProgress: async (userId: string, lessonId: string, progress: number): Promise<{ success: boolean; user?: User }> => {
        await simulateDelay(100); // quick, frequent updates
        const user = mockUsers.find(u => u.id === userId);
        if (!user) return { success: false };
        if (!user.lessonProgress) user.lessonProgress = {};
        user.lessonProgress[lessonId] = { ...(user.lessonProgress[lessonId] || { completed: false }), progress };
        return { success: true, user: { ...user } };
    },

    markLessonAsComplete: async (userId: string, lessonId: string): Promise<{ success: boolean; user?: User }> => {
        await simulateDelay(200);
        const user = mockUsers.find(u => u.id === userId);
        if (!user) return { success: false };
        if (!user.lessonProgress) user.lessonProgress = {};
        user.lessonProgress[lessonId] = { ...(user.lessonProgress[lessonId] || { progress: 100 }), completed: true };
        return { success: true, user: { ...user } };
    },
    
    toggleLikeLesson: async (userId: string, lessonId: string): Promise<{ success: boolean; lesson?: Lesson }> => {
        await simulateDelay(300);
        const { lesson } = findLesson(lessonId);
        if (!lesson) return { success: false };
        
        const likeIndex = lesson.likes.indexOf(userId);
        if (likeIndex > -1) {
            lesson.likes.splice(likeIndex, 1);
        } else {
            lesson.likes.push(userId);
        }
        return { success: true, lesson: { ...lesson } };
    },

    addCommentToLesson: async (lessonId: string, commentData: Omit<Comment, 'id' | 'createdAt'>): Promise<{ success: boolean; lesson?: Lesson; message: string }> => {
        await simulateDelay(500);
        const { lesson } = findLesson(lessonId);
        if (!lesson) return { success: false, message: 'Lesson not found.' };

        const newComment: Comment = {
            ...commentData,
            id: `lcom-${Date.now()}`,
            createdAt: new Date(),
        };
        lesson.comments.push(newComment);
        return { success: true, lesson: { ...lesson }, message: 'Comment posted.' };
    },
};

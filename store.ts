
import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import type { User, Page, NotificationMessage, NotificationType, Course, Exam } from './types';

interface AppState {
    isAuthenticated: boolean;
    user: User | null;
    page: Page;
    notifications: NotificationMessage[];
    selectedCourseId: string | null;
    selectedLessonId: string | null;
    selectedExamId: string | null;
    selectedNewsPostId: string | null;
    isPaymentModalOpen: boolean;
    courseForPayment: Course | null;
    searchTerm: string;
    fontPreference: string;
    isPreviewMode: boolean;
    setIsPreviewMode: (isPreview: boolean) => void;
    startPreviewSession: (previewUser: User) => void;
    setFontPreference: (fontClass: string) => void;
    setSearchTerm: (term: string) => void;
    login: (user: User) => void;
    logout: () => void;
    setPage: (page: Page) => void;
    selectCourse: (courseId: string) => void;
    selectNewsPost: (postId: string) => void;
    startExam: (examId: string) => void;
    startLesson: (courseId: string, lessonId: string) => void;
    addNotification: (message: string, type: NotificationType) => void;
    removeNotification: (id: number) => void;
    updateUser: (updatedUser: Partial<User>) => void;
    openPaymentModal: (course: Course) => void;
    closePaymentModal: () => void;
}

const AppContext = createContext<AppState | undefined>(undefined);

export const AppStoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const [page, setPage] = useState<Page>('login');
    const [notifications, setNotifications] = useState<NotificationMessage[]>([]);
    const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
    const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null);
    const [selectedExamId, setSelectedExamId] = useState<string | null>(null);
    const [selectedNewsPostId, setSelectedNewsPostId] = useState<string | null>(null);
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [courseForPayment, setCourseForPayment] = useState<Course | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [fontPreference, setFontPreference] = useState('font-noto-bengali');
    const [isPreviewMode, setIsPreviewMode] = useState(false);

    const login = useCallback((userData: User) => { setIsAuthenticated(true); setUser(userData); setPage('dashboard'); }, []);
    const logout = useCallback(() => { 
        setIsAuthenticated(false); 
        setUser(null); 
        setPage('login');
        if (isPreviewMode) {
            window.location.replace('/'); // Exit preview mode fully on logout
        }
    }, [isPreviewMode]);
    const updateUser = useCallback((updatedUser: Partial<User>) => { setUser(prevUser => prevUser ? { ...prevUser, ...updatedUser } : null); }, []);
    const addNotification = useCallback((message: string, type: NotificationType) => { const id = Date.now(); setNotifications(prev => [...prev, { id, message, type }]); setTimeout(() => removeNotification(id), 5000); }, []);
    const removeNotification = useCallback((id: number) => { setNotifications(prev => prev.filter(n => n.id !== id)); }, []);
    const selectCourse = useCallback((courseId: string) => { setSelectedCourseId(courseId); setPage('courseDetail'); }, []);
    const selectNewsPost = useCallback((postId: string) => { setSelectedNewsPostId(postId); setPage('newsDetail'); }, []);
    const startExam = useCallback((examId: string) => { setSelectedExamId(examId); setPage('examAttempt'); }, []);
    const startLesson = useCallback((courseId: string, lessonId: string) => { setSelectedCourseId(courseId); setSelectedLessonId(lessonId); setPage('lessonWatch'); }, []);
    const openPaymentModal = useCallback((course: Course) => { setCourseForPayment(course); setIsPaymentModalOpen(true); }, []);
    const closePaymentModal = useCallback(() => { setIsPaymentModalOpen(false); setCourseForPayment(null); }, []);
    
    const startPreviewSession = useCallback((previewUser: User) => {
        setIsAuthenticated(true);
        setUser(previewUser);
        setIsPreviewMode(true);
        setPage('dashboard');
    }, []);

    const value = {
        isAuthenticated, user, page, notifications, selectedCourseId, selectedLessonId, selectedExamId, selectedNewsPostId, isPaymentModalOpen, courseForPayment,
        searchTerm, setSearchTerm, login, logout, setPage, selectCourse, selectNewsPost, startExam, startLesson, addNotification, removeNotification,
        updateUser, openPaymentModal, closePaymentModal, fontPreference, setFontPreference, isPreviewMode, setIsPreviewMode, startPreviewSession,
    };

    return React.createElement(AppContext.Provider, { value: value }, children);
};

export const useAppStore = () => {
    const context = useContext(AppContext);
    if (context === undefined) throw new Error('useAppStore must be used within an AppStoreProvider');
    return context;
};

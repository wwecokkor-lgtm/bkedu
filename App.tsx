
import React, { useEffect, useState } from 'react';
import { useAppStore, AppStoreProvider } from './store';
import { api } from './api';

import Header from './Header';
import Footer from './Footer';
import LoginPage from './LoginPage';
import RegistrationPage from './RegistrationPage';
import DashboardPage from './DashboardPage';
import AdminPage from './AdminPage';
import CoursesPage from './CoursesPage';
import CourseDetailPage from './CourseDetailPage';
import ProfilePage from './ProfilePage';
import NotificationsPage from './NotificationsPage';
import ExamAttemptPage from './ExamAttemptPage';
import NewsPage from './NewsPage';
import NewsPostDetailPage from './NewsPostDetailPage';
import Notification from './Notification';
import PaymentModal from './PaymentModal';
import PromotionPopup from './PromotionPopup';
import InstructionPopup from './InstructionPopup';
import LessonWatchingPage from './LessonWatchingPage';
import ExamsPage from './ExamsPage';
import LeaderboardPage from './LeaderboardPage';

import type { Page, SystemSettings, InstructionContent, User } from './types';
import { Role } from './types';

const AppContent: React.FC = () => {
    const { isAuthenticated, user, page, setPage, fontPreference, updateUser, isPreviewMode, setIsPreviewMode, startPreviewSession } = useAppStore();
    
    const [systemSettings, setSystemSettings] = useState<SystemSettings | null>(null);
    const [instructionContent, setInstructionContent] = useState<InstructionContent | null>(null);
    const [showPromotionPopup, setShowPromotionPopup] = useState(false);
    const [showInstructionPopup, setShowInstructionPopup] = useState(false);

    useEffect(() => {
        // Check for preview mode on initial load
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('preview') === 'true') {
            const asRole = urlParams.get('as') || 'student';
            setIsPreviewMode(true);
            if (asRole !== 'guest') {
                // FIX: Added missing 'badges' property to conform to the User type.
                const previewUser: User = {
                    id: 'preview-user',
                    username: 'Preview Student',
                    email: 'preview@bk.academy',
                    role: Role.USER,
                    avatarUrl: 'https://picsum.photos/seed/preview/200',
                    createdAt: new Date(),
                    enrolledCourseIds: asRole === 'enrolled_student' ? ['c1', 'c2'] : [],
                    wishlistCourseIds: ['c3'],
                    status: 'Active',
                    agreementStatus: 'Agreed',
                    coins: 150,
                    coinTransactions: [],
                    badges: [],
                };
                startPreviewSession(previewUser);
            } else {
                 setPage('courses');
            }
        }
    }, []);


    useEffect(() => {
        api.getSystemSettings().then(setSystemSettings);
        api.getInstructionContent().then(setInstructionContent);
    }, []);

    useEffect(() => {
        if (!isPreviewMode && !isAuthenticated && !['login', 'register'].includes(page)) {
            setPage('login');
        } else if (!isPreviewMode && isAuthenticated && (page === 'login' || page === 'register')) {
            setPage('dashboard');
        }
    }, [isAuthenticated, page, setPage, isPreviewMode]);
    
    useEffect(() => {
        document.body.className = `bg-slate-900 text-slate-200 ${fontPreference}`;
    }, [fontPreference]);

    useEffect(() => {
        if (isAuthenticated && user && systemSettings && !isPreviewMode) {
            // Check for first visit promotion popup
            if (user.isFirstVisit && systemSettings.isCoursePopupEnabled) {
                setShowPromotionPopup(true);
            } 
            // If no promotion popup, check for instructions
            else if (user.agreementStatus !== 'Agreed' && systemSettings.isInstructionPopupEnabled) {
                setShowInstructionPopup(true);
            }
        }
    }, [isAuthenticated, user, systemSettings, isPreviewMode]);

    const handlePromotionClose = () => {
        setShowPromotionPopup(false);
        // After closing promotion, check if instructions need to be shown
        if (user?.agreementStatus !== 'Agreed' && systemSettings?.isInstructionPopupEnabled) {
            setShowInstructionPopup(true);
        }
    };

    const handleInstructionAgree = async () => {
        if (user && instructionContent) {
            const res = await api.updateUserAgreement(user.id, instructionContent.version);
            if (res.success && res.user) {
                updateUser(res.user);
                setShowInstructionPopup(false);
            }
        }
    };
    
    const hasAgreed = user?.agreementStatus === 'Agreed';
    const isCorePage = ['dashboard', 'profile', 'admin', 'login', 'register'].includes(page);
    const needsToAgree = !isPreviewMode && !hasAgreed && !isCorePage;

    // Force instruction popup if trying to access a locked page
    useEffect(() => {
        if (needsToAgree && !showInstructionPopup) {
            setShowInstructionPopup(true);
        }
    }, [page, needsToAgree, showInstructionPopup]);

    const renderPage = () => {
        if (page === 'lessonWatch') return <LessonWatchingPage />;
        
        if (!isAuthenticated && !isPreviewMode) {
            if (page === 'register') return <RegistrationPage />;
            return <LoginPage />;
        }
        
        // Gate feature access if user hasn't agreed to instructions
        if (needsToAgree) {
            return <DashboardPage />; // Render a safe page while the instruction popup is forced
        }

        switch (page) {
            case 'dashboard': return <DashboardPage />;
            case 'courses': return <CoursesPage />;
            case 'courseDetail': return <CourseDetailPage />;
            case 'profile': return <ProfilePage />;
            case 'notifications': return <NotificationsPage />;
            case 'examAttempt': return <ExamAttemptPage />;
            case 'news': return <NewsPage />;
            case 'newsDetail': return <NewsPostDetailPage />;
            case 'exams': return <ExamsPage />;
            case 'leaderboard': return <LeaderboardPage />;
            default: return isPreviewMode ? <CoursesPage /> : <DashboardPage />;
        }
    };
    
    const renderPopups = () => (
        <>
            {showPromotionPopup && <PromotionPopup onClose={handlePromotionClose} />}
            {showInstructionPopup && instructionContent && <InstructionPopup content={instructionContent} onAgree={handleInstructionAgree} />}
        </>
    );
    
    if (isAuthenticated && (user?.role === Role.ADMIN || user?.role === Role.SUPER_ADMIN) && page === 'admin' && !isPreviewMode) {
        return (
            <>
                <AdminPage />
                <Notification />
                <PaymentModal />
                {renderPopups()}
            </>
        );
    }
    
    if (page === 'lessonWatch' || page === 'examAttempt') {
        return <>{renderPage()}</>
    }

    return (
        <div className="min-h-screen flex flex-col bg-slate-900 font-sans">
            {isPreviewMode && (
                <div className="bg-yellow-500 text-slate-900 text-center py-1 font-bold text-sm sticky top-0 z-50">
                    PREVIEW MODE
                </div>
            )}
            <Header logoUrl={systemSettings?.logoUrl} />
            <main className="flex-grow container mx-auto px-4 py-8">
                {renderPage()}
            </main>
            <Footer />
            <Notification />
            <PaymentModal />
            {renderPopups()}
        </div>
    );
};

const App: React.FC = () => {
    return (
        <AppStoreProvider>
            <AppContent />
        </AppStoreProvider>
    );
};

export default App;

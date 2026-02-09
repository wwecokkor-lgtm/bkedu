
// FIX: Replaced non-existent Quiz/QuizAttempt types with Exam/ExamAttempt.
import type { User, Course, Order, Lesson, PaymentMethod, AdminLog, Exam, Notice, NewsPost, Media, YouTubeVideo, ExamAttempt, Comment, UserStatus, VersionInfo, SystemSettings, InstructionContent, Backup, Badge, UserActivity } from './types';
import { Role, QuestionType, PostCategory } from './types';

// --- MOCK DATABASE & SHARED STATE ---

export const mockBadges: Badge[] = [
    { id: 'b1', name: 'Course Pioneer', icon: '🚀', description: 'Completed your first course!', earnedAt: new Date() },
    { id: 'b2', name: 'Exam Master', icon: '🏆', description: 'Scored 100% on an exam!', earnedAt: new Date() },
];

export const mockUserActivities: UserActivity[] = [
    { id: 'ua1', type: 'Login', description: 'Logged in from a new device.', timestamp: new Date(Date.now() - 3600000) },
    { id: 'ua2', type: 'Lesson Complete', description: 'Completed "Chapter 1: Motion" in Physics.', timestamp: new Date(Date.now() - 86400000) },
    { id: 'ua3', type: 'Exam Attempt', description: 'Attempted "Physics Chapter 1 Quiz".', timestamp: new Date(Date.now() - 172800000) },
    { id: 'ua4', type: 'Course Enrollment', description: 'Enrolled in "Physics for Class 10".', timestamp: new Date(Date.now() - 259200000) },
];

// FIX: Added missing 'coins' and 'coinTransactions' properties to all user objects to match the User type.
export let mockUsers: User[] = [ { id: '1', username: 'Bayzid', email: 'fffgamer066@gmail.com', role: Role.SUPER_ADMIN, status: 'Active', avatarUrl: 'https://picsum.photos/seed/admin/200', createdAt: new Date(), enrolledCourseIds: ['c1', 'c2', 'c3'], wishlistCourseIds: [], lastLoginAt: new Date(), agreementStatus: 'Agreed', bookmarkedPostIds: ['np1'], phone: '01711111111', grade: 'N/A', school: 'BK Academy Admin', coins: 500, coinTransactions: [], badges: [] }, { id: '2', username: 'Student1', email: 'student1@bk.academy', role: Role.USER, status: 'Active', avatarUrl: 'httpsum.photos/seed/student1/200', createdAt: new Date(), enrolledCourseIds: ['c1'], wishlistCourseIds: ['c2'], lastLoginAt: new Date(Date.now() - 86400000), agreementStatus: 'Agreed', bookmarkedPostIds: [], phone: '01822222222', grade: '10', school: 'Dhaka Residential Model College', medium: 'Bangla', lessonProgress: { 'l1-1': { progress: 100, completed: true }, 'l1-2': {progress: 20, completed: false} }, coins: 150, coinTransactions: [{id: 'tx1', type: 'Earned', amount: 150, description: 'Welcome bonus', timestamp: new Date()}], badges: [mockBadges[0]] }, { id: '3', username: 'Student2', email: 'student2@bk.academy', role: Role.USER, status: 'Pending', avatarUrl: 'https://picsum.photos/seed/student2/200', createdAt: new Date(), enrolledCourseIds: ['c2'], wishlistCourseIds: [], agreementStatus: 'Not Agreed', bookmarkedPostIds: [], phone: '01933333333', grade: '12', school: 'Ideal School and College', medium: 'English', coins: 0, coinTransactions: [], badges: [] }, { id: '4', username: 'SuspendedUser', email: 'suspended@bk.academy', role: Role.USER, status: 'Suspended', statusReason: 'Violation of terms of service.', avatarUrl: 'https://picsum.photos/seed/suspended/200', createdAt: new Date(), enrolledCourseIds: [], wishlistCourseIds: [], agreementStatus: 'Agreed', bookmarkedPostIds: [], coins: 0, coinTransactions: [], badges: [] }, { id: '5', username: 'BannedUser', email: 'banned@bk.academy', role: Role.USER, status: 'Banned', statusReason: 'Multiple violations.', avatarUrl: 'https://picsum.photos/seed/banned/200', createdAt: new Date(), enrolledCourseIds: [], wishlistCourseIds: [], agreementStatus: 'Agreed', bookmarkedPostIds: [], coins: 0, coinTransactions: [], badges: [] }, ];
export const mockLessons: { [key: string]: Lesson[] } = { c1: [ {id: 'l1-1', title: 'Chapter 1: Motion', contentUrl: 'mock_url', type: 'Video', duration: '08:45', isFree: true, likes: ['2', '3'], comments: [], resources: [{id: 'r1', title: 'Chapter 1 Notes', url: '#', type: 'PDF'}]}, {id: 'l1-2', title: 'Chapter 2: Forces', contentUrl: 'mock_url', type: 'Video', duration: '12:30', likes: [], comments: [], resources: []}, {id: 'l1-3', title: 'Chapter 3: Work, Power, Energy', contentUrl: 'mock_url', type: 'Video', duration: '15:10', likes: [], comments: [], resources: []}, ], c2: [ {id: 'l2-1', title: 'Chapter 1: Matrices', contentUrl: 'mock_url', type: 'Video', duration: '14:55', isFree: true, likes: [], comments: [], resources: []}, {id: 'l2-2', title: 'Chapter 2: Vectors', contentUrl: 'mock_url', type: 'Video', duration: '18:20', likes: [], comments: [], resources: []}, {id: 'l2-3', title: 'Chapter 3: Straight Lines', contentUrl: 'mock_url', type: 'Video', duration: '22:05', likes: [], comments: [], resources: []}, ], c3: [ {id: 'l3-1', title: 'Chapter 1: Chemical Reactions', contentUrl: 'mock_url', type: 'Video', duration: '10:00', likes: [], comments: [], resources: []}, {id: 'l3-2', title: 'Chapter 2: The Periodic Table', contentUrl: 'mock_url', type: 'Video', duration: '13:40', likes: [], comments: [], resources: []}, ], c4: [ {id: 'l4-1', title: 'Intro to Programming', contentUrl: 'mock_url', type: 'Video', duration: '05:00', isFree: true, likes: [], comments: [], resources: []}, {id: 'l4-2', title: 'Variables and Data Types', contentUrl: 'mock_url', type: 'Video', duration: '07:30', isFree: true, likes: [], comments: [], resources: []}, ], };
export let mockCourses: Course[] = [ { id: 'c1', title: 'Physics for Class 10', description: 'Complete course covering the SSC physics syllabus.', author: 'Dr. Alam', price: 1500, thumbnailUrl: 'https://picsum.photos/seed/physics/400/225', lessons: mockLessons.c1, category: 'SSC', publishStatus: 'Published', resources: [], createdAt: new Date(), updatedAt: new Date() }, { id: 'c2', title: 'Higher Math for Class 12', description: 'Advanced topics in mathematics for HSC students.', author: 'Prof. Kabir', price: 2000, discount: 1800, thumbnailUrl: 'https://picsum.photos/seed/math/400/225', lessons: mockLessons.c2, category: 'HSC', publishStatus: 'Published', resources: [], createdAt: new Date(), updatedAt: new Date() }, { id: 'c3', title: 'Chemistry for Class 9', description: 'Fundamental concepts of chemistry.', author: 'Mrs. Sultana', price: 1200, thumbnailUrl: 'https://picsum.photos/seed/chemistry/400/225', lessons: mockLessons.c3, category: 'JSC', publishStatus: 'Draft', resources: [], createdAt: new Date(), updatedAt: new Date() }, { id: 'c4', title: 'Introduction to Logic', description: 'A free course on the basics of logical thinking and problem-solving.', author: 'BK Academy', price: 0, thumbnailUrl: 'https://picsum.photos/seed/logic/400/225', lessons: mockLessons.c4, category: 'General', publishStatus: 'Published', resources: [], createdAt: new Date(), updatedAt: new Date() }, ];
export let mockOrders: Order[] = [ { id: 'o1', userId: '2', courseId: 'c1', courseTitle: 'Physics for Class 10', amount: 1500, finalAmount: 1500, status: 'Completed', createdAt: new Date(), paymentMethod: 'bKash', transactionId: 'BK12345XYZ' }, { id: 'o2', userId: '3', courseId: 'c2', courseTitle: 'Higher Math for Class 12', amount: 2000, finalAmount: 1800, status: 'Completed', createdAt: new Date(), paymentMethod: 'Nagad', transactionId: 'NG67890ABC' }, { id: 'o3', userId: '2', courseId: 'c3', courseTitle: 'Chemistry for Class 9', amount: 1200, finalAmount: 1200, status: 'Pending', createdAt: new Date(), paymentMethod: 'bKash', transactionId: 'BK55566XYZ' }, ];
export let mockPaymentMethods: PaymentMethod[] = [ { id: 'pm1', name: 'bKash', type: 'Manual', iconUrl: 'https://www.logo.wine/a/logo/BKash/BKash-Icon-Logo.wine.svg', status: 'Active', accountNumber: '01700000000' }, { id: 'pm2', name: 'Nagad', type: 'Manual', iconUrl: 'https://media.licdn.com/dms/image/D560BAQEg2I27732sVg/company-logo_200_200/0/1687873324158/nagad_logo?e=2147483647&v=beta&t=M8Xq0iWso6s33H520o3p_22j5825J3G9WX0a2CWh3-A', status: 'Active', accountNumber: '01800000000' }, { id: 'pm3', name: 'Card', type: 'Gateway', iconUrl: 'https://static-00.iconduck.com/assets.00/credit-card-icon-2048x1582-7p62x3f2.png', status: 'Inactive', credentials: 'API_KEY_PLACEHOLDER' }, ];
// FIX: Renamed mockQuizzes to mockExams, updated type to Exam[], and added missing properties to match the type.
export let mockExams: Exam[] = [ { id: 'q1', title: 'Physics Chapter 1 Quiz', description: 'A quick quiz on the first chapter of physics.', courseId: 'c1', duration: 10, totalMarks: 10, passMarks: 5, status: 'Published', createdAt: new Date(), questions: [ { id: 'q1-1', questionText: 'What is the unit of force?', questionType: QuestionType.MCQ, options: ['Joule', 'Watt', 'Newton', 'Pascal'], correctAnswer: 'Newton', marks: 5}, { id: 'q1-2', questionText: 'Velocity is a vector quantity.', questionType: QuestionType.TrueFalse, correctAnswer: 'True', marks: 5}, ], coinReward: 10, fullMarksBonus: 5, attemptLimit: 1}, ];
export let mockNotices: Notice[] = [ { id: 'n1', title: 'Welcome to BK Academy!', content: 'We are excited to have you here. Explore our courses and start learning today.', createdAt: new Date() }, { id: 'n2', title: 'HSC 2025 Crash Course', content: 'Our new crash course for HSC 2025 candidates is starting soon. Enroll now!', createdAt: new Date(Date.now() - 86400000) }, ];
export let mockNewsPosts: NewsPost[] = [ { id: 'np1', title: 'New Physics Batch Starting Soon!', subtitle: 'Get a head start on your SSC preparations.', slug: 'new-physics-batch-soon', shortDescription: 'Enroll in our new batch for Class 10 Physics to get a head start. We will cover the entire syllabus with special care.', longDescription: 'Detailed description about the new physics batch, curriculum, and schedule. This course is designed to build a strong foundation in physics concepts for SSC candidates.', category: PostCategory.ANNOUNCEMENT, tags: ['Physics', 'SSC', 'New Batch'], status: 'Published', isPinned: true, isFeatured: true, priority: 'Top', authorId: '1', attachments: [], createdAt: new Date(), viewCount: 152, readTime: 3, comments: [{id: 'c1', userId: '2', username: 'Student1', avatarUrl: 'https://picsum.photos/seed/student1/200', content: 'Very excited for this!', createdAt: new Date()}], likes: ['2'] }, { id: 'np2', title: 'Platform Maintenance on Sunday', subtitle: 'Scheduled downtime for upgrades.', slug: 'platform-maintenance-sunday', shortDescription: 'The platform will be down for scheduled maintenance to improve performance and add new features.', longDescription: 'We will be performing server maintenance this Sunday from 2 AM to 4 AM. We apologize for any inconvenience this may cause.', category: PostCategory.UPDATE, tags: ['Maintenance', 'Update'], status: 'Published', isPinned: false, priority: 'Normal', authorId: '1', attachments: [], createdAt: new Date(Date.now() - 172800000), viewCount: 89, readTime: 1, comments: [], likes: [] }, { id: 'np3', title: 'Tips for Higher Math Exam', subtitle: 'Strategies to score better.', slug: 'tips-for-higher-math-exam', shortDescription: 'Learn effective strategies and tips from our expert instructors to ace your upcoming Higher Math exam.', longDescription: 'This post covers key topics, time management techniques, and common mistakes to avoid in your Higher Math exam. A must-read for all HSC candidates.', category: PostCategory.TIPS, tags: ['HSC', 'Math', 'Exam Tips'], status: 'Published', isPinned: false, isFeatured: true, priority: 'Normal', authorId: '1', attachments: [], createdAt: new Date(Date.now() - 345600000), viewCount: 250, readTime: 5, comments: [], likes: ['1', '2', '3'] }, { id: 'np4', title: 'Upcoming Chemistry Course', subtitle: 'For class 9.', slug: 'upcoming-chemistry-course', shortDescription: 'A new comprehensive course on Chemistry for Class 9 is in the works and will be published soon.', longDescription: 'Stay tuned for more details.', category: PostCategory.ACADEMIC, tags: ['Chemistry', 'JSC'], status: 'Draft', isPinned: false, priority: 'Normal', authorId: '1', attachments: [], createdAt: new Date(), viewCount: 0, readTime: 1, comments: [], likes: [] }, { id: 'np5', title: 'Secret Post (Soft Deleted)', subtitle: 'This is a deleted post.', slug: 'secret-post', shortDescription: 'This post has been soft-deleted.', longDescription: 'This should not be visible to normal users, only in the admin trash view.', category: PostCategory.GENERAL, tags: [], status: 'Archived', isPinned: false, priority: 'Normal', authorId: '1', attachments: [], createdAt: new Date(Date.now() - 864000000), viewCount: 10, readTime: 1, comments: [], likes: [], deletedAt: new Date() }, ];
export let mockMedia: Media[] = [];
// FIX: Renamed mockQuizAttempts to mockExamAttempts and updated its type.
export let mockExamAttempts: ExamAttempt[] = [];
export let mockAdminLogs: AdminLog[] = [];
export let mockBackups: Backup[] = [];
export let currentVersion: VersionInfo = { version: '1.2.0', releaseDate: '2024-07-29', changelog: [ 'Added professional user management system with roles and statuses.', 'Integrated comprehensive Bangla font support.', 'Implemented a new website version control system.' ] };
export let systemSettings: SystemSettings = { isCoursePopupEnabled: true, isInstructionPopupEnabled: true, logoUrl: '', contactInfo: [] };
export let instructionContent: InstructionContent = { version: '1.0', title: 'Welcome & Important Instructions', content: 'Welcome to BK Academy! Before you begin, please read and agree to our terms of use. All educational content is for personal use only and cannot be redistributed. Please maintain a respectful environment in all community interactions.', lastUpdatedAt: new Date() };

// --- HELPER FUNCTIONS ---

export const simulateDelay = (ms: number) => new Promise(res => setTimeout(res, ms));

const getDummyIp = () => `103.12.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}`;

export const logAdminAction = (adminId: string, action: string, entity: string, entityId: string) => { 
    const admin = mockUsers.find(u => u.id === adminId); 
    if (admin) {
        mockAdminLogs.unshift({ 
            id: `log${mockAdminLogs.length + 1}`, 
            adminId, 
            adminName: admin.username, 
            action, 
            entity, 
            entityId, 
            timestamp: new Date(),
            ipAddress: getDummyIp(),
        }); 
    }
};

// --- DATA SAFETY & BACKUP ---

export const getDatabaseState = () => {
    // Deep copy to prevent reference issues
    return JSON.parse(JSON.stringify({
        mockUsers, mockCourses, mockOrders, mockPaymentMethods, mockExams, mockNewsPosts, mockMedia, systemSettings
    }));
};

export const setDatabaseState = (newState: any) => {
    // This is the crucial part for restoring. It mutates the exported arrays.
    const parseDates = (data: any[]) => data.map(item => ({ ...item, createdAt: new Date(item.createdAt), updatedAt: item.updatedAt ? new Date(item.updatedAt) : undefined, lastLoginAt: item.lastLoginAt ? new Date(item.lastLoginAt) : undefined, timestamp: item.timestamp ? new Date(item.timestamp) : undefined, deletedAt: item.deletedAt ? new Date(item.deletedAt) : undefined, scheduledAt: item.scheduledAt ? new Date(item.scheduledAt) : undefined, expiresAt: item.expiresAt ? new Date(item.expiresAt) : undefined }));
    
    mockUsers.length = 0;
    mockUsers.push(...parseDates(newState.mockUsers));
    
    mockCourses.length = 0;
    mockCourses.push(...parseDates(newState.mockCourses));
    
    mockOrders.length = 0;
    mockOrders.push(...parseDates(newState.mockOrders));
    
    mockPaymentMethods.length = 0;
    mockPaymentMethods.push(...newState.mockPaymentMethods);
    
    mockExams.length = 0;
    mockExams.push(...parseDates(newState.mockExams));
    
    mockNewsPosts.length = 0;
    mockNewsPosts.push(...parseDates(newState.mockNewsPosts));
    
    mockMedia.length = 0;
    mockMedia.push(...parseDates(newState.mockMedia));

    if (newState.systemSettings) {
        Object.assign(systemSettings, newState.systemSettings);
    }
};

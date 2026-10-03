import type {
  Student,
  Homework,
  Lesson,
  MissedLesson,
  AppNotification,
  Message,
  ClassActivity,
  ParentAccount,
  TeacherAccount,
  AttendanceRecord,
} from '@/types';

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function genMonthly(base: number, variance: number) {
  return months.slice(0, 8).map((m) => ({
    month: m,
    value: Math.max(40, Math.min(100, Math.round(base + (Math.random() - 0.5) * variance))),
  }));
}

const studentNames = [
  { id: 'STU001', name: 'Aarav Kumar', parent: 'Rajesh Kumar', contact: '+91 98480 22001', email: 'rajesh.k@parent.com' },
  { id: 'STU002', name: 'Ananya Reddy', parent: 'Suresh Reddy', contact: '+91 98480 22002', email: 'suresh.r@parent.com' },
  { id: 'STU003', name: 'Rahul Sharma', parent: 'Mohan Sharma', contact: '+91 98480 22003', email: 'mohan.s@parent.com' },
  { id: 'STU004', name: 'Priya Singh', parent: 'Deepak Singh', contact: '+91 98480 22004', email: 'deepak.s@parent.com' },
  { id: 'STU005', name: 'Karthik Rao', parent: 'Venkat Rao', contact: '+91 98480 22005', email: 'venkat.r@parent.com' },
  { id: 'STU006', name: 'Sneha Patel', parent: 'Nilesh Patel', contact: '+91 98480 22006', email: 'nilesh.p@parent.com' },
  { id: 'STU007', name: 'Arjun Kumar', parent: 'Sandeep Kumar', contact: '+91 98480 22007', email: 'sandeep.k@parent.com' },
  { id: 'STU008', name: 'Diya Reddy', parent: 'Krishna Reddy', contact: '+91 98480 22008', email: 'krishna.r@parent.com' },
  { id: 'STU009', name: 'Vivek Sharma', parent: 'Anil Sharma', contact: '+91 98480 22009', email: 'anil.s@parent.com' },
  { id: 'STU010', name: 'Meera Rao', parent: 'Gopal Rao', contact: '+91 98480 22010', email: 'gopal.r@parent.com' },
  { id: 'STU011', name: 'Aditya Singh', parent: 'Manoj Singh', contact: '+91 98480 22011', email: 'manoj.s@parent.com' },
  { id: 'STU012', name: 'Ishita Kumar', parent: 'Praveen Kumar', contact: '+91 98480 22012', email: 'praveen.k@parent.com' },
  { id: 'STU013', name: 'Rohit Reddy', parent: 'Naresh Reddy', contact: '+91 98480 22013', email: 'naresh.r@parent.com' },
  { id: 'STU014', name: 'Nisha Patel', parent: 'Harish Patel', contact: '+91 98480 22014', email: 'harish.p@parent.com' },
  { id: 'STU015', name: 'Varun Rao', parent: 'Mahesh Rao', contact: '+91 98480 22015', email: 'mahesh.r@parent.com' },
];

const activities = [
  'Science lesson completed',
  'Mathematics quiz completed',
  'English homework submitted',
  'Social Studies lesson viewed',
  'Mathematics assignment submitted',
  'Science quiz started',
  'English reading completed',
  'Class attendance marked',
];

const subjects = ['Mathematics', 'Science', 'English', 'Social Studies'];

function genSubjects(base: number) {
  return subjects.map((s) => ({
    subject: s,
    score: Math.max(50, Math.min(98, Math.round(base + (Math.random() - 0.4) * 20))),
  }));
}

function genActivity() {
  return Array.from({ length: 5 }, (_, i) => ({
    time: `${9 + i}:${i % 2 === 0 ? '00' : '30'}`,
    activity: activities[i % activities.length],
    type: i % 3 === 0 ? 'lesson' : i % 3 === 1 ? 'quiz' : 'homework',
  }));
}

export const students: Student[] = studentNames.map((s, i) => {
  const attendance = Math.round(82 + Math.random() * 16);
  const homework = Math.round(75 + Math.random() * 22);
  const performance = Math.round(70 + Math.random() * 25);
  return {
    id: s.id,
    name: s.name,
    class: '8-A',
    attendance,
    homework,
    performance,
    status: i < 12 ? 'active' : 'inactive',
    parentId: `PAR${String(i + 1).padStart(3, '0')}`,
    parentName: s.parent,
    parentContact: s.contact,
    parentEmail: s.email,
    subjects: genSubjects(performance),
    recentActivity: genActivity(),
    monthlyAttendance: genMonthly(attendance, 10),
    monthlyPerformance: genMonthly(performance, 12),
    notifications: [
      {
        id: `n-${s.id}-1`,
        title: 'Attendance Alert',
        message: `${s.name} was marked absent on 28 Sep 2026`,
        date: '2026-09-28',
        type: 'attendance',
        read: false,
      },
      {
        id: `n-${s.id}-2`,
        title: 'Homework Update',
        message: `${s.name} submitted the Mathematics assignment`,
        date: '2026-09-29',
        type: 'homework',
        read: true,
      },
    ],
  };
});

export const teacherAccount: TeacherAccount = {
  id: 'TCH001',
  email: 'teacher@msedu.demo',
  password: 'teacher123',
  name: 'Ms. Lakshmi Iyer',
};

export const parentAccounts: ParentAccount[] = studentNames.slice(0, 8).map((s, i) => ({
  id: `PAR${String(i + 1).padStart(3, '0')}`,
  email: i === 0 ? 'parent@msedu.demo' : `parent${i + 1}@msedu.demo`,
  password: i === 0 ? 'parent123' : `parent${i + 1}123`,
  name: s.parent,
  childId: s.id,
  childName: s.name,
}));

export const homeworks: Homework[] = [
  {
    id: 'HW001',
    title: 'Algebraic Expressions Worksheet',
    subject: 'Mathematics',
    description: 'Solve problems 1-15 from Chapter 7. Focus on simplifying expressions with variables.',
    dueDate: '2026-10-03',
    class: '8-A',
    completion: 73,
    completedStudents: students.slice(0, 11).map((s) => s.id),
    pendingStudents: students.slice(11).map((s) => s.id),
    status: 'active',
    createdAt: '2026-09-28',
  },
  {
    id: 'HW002',
    title: 'Human Digestive System Diagram',
    subject: 'Science',
    description: 'Draw and label the human digestive system. Write a short summary of each organ function.',
    dueDate: '2026-10-05',
    class: '8-A',
    completion: 60,
    completedStudents: students.slice(0, 9).map((s) => s.id),
    pendingStudents: students.slice(9).map((s) => s.id),
    status: 'active',
    createdAt: '2026-09-29',
  },
  {
    id: 'HW003',
    title: 'Essay: My Favorite Festival',
    subject: 'English',
    description: 'Write a 300-word essay about your favorite festival. Include cultural significance.',
    dueDate: '2026-09-30',
    class: '8-A',
    completion: 87,
    completedStudents: students.slice(0, 13).map((s) => s.id),
    pendingStudents: students.slice(13).map((s) => s.id),
    status: 'active',
    createdAt: '2026-09-25',
  },
  {
    id: 'HW004',
    title: 'Indian Independence Timeline',
    subject: 'Social Studies',
    description: 'Create a timeline of key events from 1857 to 1947.',
    dueDate: '2026-09-28',
    class: '8-A',
    completion: 100,
    completedStudents: students.map((s) => s.id),
    pendingStudents: [],
    status: 'completed',
    createdAt: '2026-09-20',
  },
  {
    id: 'HW005',
    title: 'Geometry Practice Problems',
    subject: 'Mathematics',
    description: 'Solve all problems from Exercise 5.2.',
    dueDate: '2026-09-27',
    class: '8-A',
    completion: 80,
    completedStudents: students.slice(0, 12).map((s) => s.id),
    pendingStudents: students.slice(12).map((s) => s.id),
    status: 'overdue',
    createdAt: '2026-09-22',
  },
];

export const lessons: Lesson[] = [
  {
    id: 'LES001',
    subject: 'Mathematics',
    title: 'Quadratic Equations',
    date: '2026-10-01',
    duration: '45 min',
    status: 'completed',
  },
  {
    id: 'LES002',
    subject: 'Science',
    title: 'Human Digestive System',
    date: '2026-09-28',
    duration: '50 min',
    status: 'completed',
    notes: 'The human digestive system breaks down food into nutrients. It includes the mouth, esophagus, stomach, small intestine, and large intestine. Each organ plays a specific role in digestion.',
    notesLanguage: 'English',
  },
  {
    id: 'LES003',
    subject: 'English',
    title: 'Grammar Basics',
    date: '2026-10-02',
    duration: '40 min',
    status: 'scheduled',
  },
  {
    id: 'LES004',
    subject: 'Social Studies',
    title: 'Indian Freedom Struggle',
    date: '2026-09-30',
    duration: '45 min',
    status: 'completed',
    notes: 'The Indian freedom struggle spanned from 1857 to 1947. Key figures include Mahatma Gandhi, Subhas Chandra Bose, and Jawaharlal Nehru.',
    notesLanguage: 'English',
  },
  {
    id: 'LES005',
    subject: 'Mathematics',
    title: 'Linear Equations',
    date: '2026-09-29',
    duration: '45 min',
    status: 'completed',
  },
  {
    id: 'LES006',
    subject: 'Science',
    title: 'Photosynthesis',
    date: '2026-10-03',
    duration: '50 min',
    status: 'scheduled',
  },
];

export const missedLessons: MissedLesson[] = [
  {
    id: 'ML001',
    studentId: 'STU003',
    studentName: 'Rahul Sharma',
    lessonTitle: 'Human Digestive System',
    subject: 'Science',
    date: '2026-09-28',
    status: 'notes-available',
    notes: 'The human digestive system breaks down food into nutrients. It includes the mouth, esophagus, stomach, small intestine, and large intestine. Each organ plays a specific role in digestion.',
    language: 'English',
  },
  {
    id: 'ML002',
    studentId: 'STU007',
    studentName: 'Arjun Kumar',
    lessonTitle: 'Linear Equations',
    subject: 'Mathematics',
    date: '2026-09-29',
    status: 'notes-available',
    notes: 'A linear equation is an equation of the form ax + b = 0, where a and b are constants. The solution is x = -b/a.',
    language: 'English',
  },
  {
    id: 'ML003',
    studentId: 'STU014',
    studentName: 'Nisha Patel',
    lessonTitle: 'Indian Freedom Struggle',
    subject: 'Social Studies',
    date: '2026-09-30',
    status: 'pending',
  },
];

export const notifications: AppNotification[] = [
  { id: 'N001', title: 'Attendance Alert', message: 'Rahul Sharma was marked absent today', date: '2026-10-01', type: 'attendance', read: false, forRole: 'teacher', studentId: 'STU003' },
  { id: 'N002', title: 'Homework Overdue', message: 'Geometry Practice Problems is overdue for 3 students', date: '2026-10-01', type: 'homework', read: false, forRole: 'teacher' },
  { id: 'N003', title: 'Low Performance', message: 'Varun Rao scored below 60% in Science quiz', date: '2026-09-30', type: 'performance', read: false, forRole: 'teacher', studentId: 'STU015' },
  { id: 'N004', title: 'Absent Student', message: 'Nisha Patel was absent - lesson notes pending', date: '2026-09-30', type: 'absent', read: true, forRole: 'teacher', studentId: 'STU014' },
  { id: 'N005', title: 'Parent Message', message: 'Rajesh Kumar asked about homework schedule', date: '2026-09-29', type: 'parent-message', read: true, forRole: 'teacher' },
  { id: 'N006', title: 'System Update', message: 'Ms.Edu classroom sync completed successfully', date: '2026-09-29', type: 'system', read: true, forRole: 'teacher' },
  // Parent notifications for STU001 (Aarav)
  { id: 'PN001', title: 'Attendance Update', message: 'Your child Aarav Kumar was present today', date: '2026-10-01', type: 'attendance', read: false, forRole: 'parent', studentId: 'STU001' },
  { id: 'PN002', title: 'Homework Due', message: 'Mathematics homework is due tomorrow', date: '2026-10-01', type: 'homework', read: false, forRole: 'parent', studentId: 'STU001' },
  { id: 'PN003', title: 'Lesson Completed', message: 'Aarav completed the Science lesson on Photosynthesis', date: '2026-09-30', type: 'system', read: true, forRole: 'parent', studentId: 'STU001' },
  { id: 'PN004', title: 'New Lesson Notes', message: 'New lesson notes available for Quadratic Equations', date: '2026-09-30', type: 'system', read: true, forRole: 'parent', studentId: 'STU001' },
  { id: 'PN005', title: 'Teacher Message', message: 'Ms. Lakshmi sent you a message about Aarav\'s progress', date: '2026-09-29', type: 'parent-message', read: false, forRole: 'parent', studentId: 'STU001' },
];

export const messages: Message[] = [
  {
    id: 'M001',
    from: 'Ms. Lakshmi Iyer',
    to: 'Rajesh Kumar',
    fromRole: 'teacher',
    toRole: 'parent',
    content: 'Please ensure that the Mathematics assignment is completed by Friday. Aarav is doing well in class!',
    date: '2026-09-29',
    studentId: 'STU001',
  },
  {
    id: 'M002',
    from: 'Rajesh Kumar',
    to: 'Ms. Lakshmi Iyer',
    fromRole: 'parent',
    toRole: 'teacher',
    content: 'Thank you, Ms. Lakshmi. I will make sure Aarav completes it on time.',
    date: '2026-09-29',
    studentId: 'STU001',
  },
];

export const classActivities: ClassActivity[] = [
  { studentId: 'STU001', studentName: 'Aarav Kumar', activity: 'Viewing Science Lesson', activityType: 'viewing-lesson', timestamp: '09:45 AM' },
  { studentId: 'STU002', studentName: 'Ananya Reddy', activity: 'Completing Homework', activityType: 'completing-homework', timestamp: '09:45 AM' },
  { studentId: 'STU003', studentName: 'Rahul Sharma', activity: 'Taking Quiz', activityType: 'taking-quiz', timestamp: '09:45 AM' },
  { studentId: 'STU004', studentName: 'Priya Singh', activity: 'Viewing Mathematics Lesson', activityType: 'viewing-lesson', timestamp: '09:45 AM' },
  { studentId: 'STU005', studentName: 'Karthik Rao', activity: 'Completing Homework', activityType: 'completing-homework', timestamp: '09:45 AM' },
  { studentId: 'STU006', studentName: 'Sneha Patel', activity: 'Taking Quiz', activityType: 'taking-quiz', timestamp: '09:45 AM' },
  { studentId: 'STU007', studentName: 'Arjun Kumar', activity: 'Inactive', activityType: 'inactive', timestamp: '09:45 AM' },
  { studentId: 'STU008', studentName: 'Diya Reddy', activity: 'Viewing English Lesson', activityType: 'viewing-lesson', timestamp: '09:45 AM' },
  { studentId: 'STU009', studentName: 'Vivek Sharma', activity: 'Completing Homework', activityType: 'completing-homework', timestamp: '09:45 AM' },
  { studentId: 'STU010', studentName: 'Meera Rao', activity: 'Inactive', activityType: 'inactive', timestamp: '09:45 AM' },
  { studentId: 'STU011', studentName: 'Aditya Singh', activity: 'Taking Quiz', activityType: 'taking-quiz', timestamp: '09:45 AM' },
  { studentId: 'STU012', studentName: 'Ishita Kumar', activity: 'Viewing Social Studies Lesson', activityType: 'viewing-lesson', timestamp: '09:45 AM' },
];

export const attendanceRecords: AttendanceRecord[] = students.map((s, i) => ({
  studentId: s.id,
  date: '2026-10-01',
  status: i < 12 ? 'present' : i < 14 ? 'absent' : 'late',
  time: i < 12 ? '08:55 AM' : i < 14 ? '--' : '09:10 AM',
  remarks: i < 12 ? 'On time' : i < 14 ? 'Not arrived' : 'Late arrival',
}));

export const monthlyAttendanceData = months.slice(0, 8).map((m) => ({
  month: m,
  present: Math.round(22 + Math.random() * 6),
  absent: Math.round(1 + Math.random() * 4),
  late: Math.round(Math.random() * 3),
}));

export const subjectPerformanceData = [
  { subject: 'Mathematics', avg: 82 },
  { subject: 'Science', avg: 78 },
  { subject: 'English', avg: 85 },
  { subject: 'Social Studies', avg: 81 },
];

export const homeworkTrendData = months.slice(0, 8).map((m) => ({
  month: m,
  completion: Math.round(70 + Math.random() * 25),
}));

export const attendanceVsPerformance = months.slice(0, 8).map((m, i) => ({
  month: m,
  attendance: Math.round(85 + Math.random() * 12),
  performance: Math.round(75 + Math.random() * 18),
}));

export const performanceDistribution = [
  { range: '90-100%', count: 6 },
  { range: '80-89%', count: 9 },
  { range: '70-79%', count: 7 },
  { range: '60-69%', count: 2 },
  { range: 'Below 60%', count: 1 },
];

export const classActivityData = [
  { name: 'Viewing Lesson', value: 5, color: '#2563eb' },
  { name: 'Completing Homework', value: 4, color: '#16a34a' },
  { name: 'Taking Quiz', value: 3, color: '#06b6d4' },
  { name: 'Inactive', value: 2, color: '#94a3b8' },
];

export const parentChildPerformance = [
  { subject: 'Mathematics', score: 85 },
  { subject: 'Science', score: 78 },
  { subject: 'English', score: 88 },
  { subject: 'Social Studies', score: 81 },
];

export const parentMonthlyTrend = months.slice(0, 8).map((m) => ({
  month: m,
  performance: Math.round(72 + Math.random() * 15),
  homework: Math.round(78 + Math.random() * 15),
}));

export const parentAttendanceTrend = months.slice(0, 8).map((m) => ({
  month: m,
  attendance: Math.round(88 + Math.random() * 10),
}));

export const parentHomeworkCompletion = months.slice(0, 8).map((m) => ({
  month: m,
  completion: Math.round(80 + Math.random() * 15),
}));

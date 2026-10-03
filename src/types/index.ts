export type UserRole = 'teacher' | 'parent' | 'student';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  childId?: string;
  studentId?: string;
}

export type AttendanceStatus = 'present' | 'absent' | 'late';

export interface AttendanceRecord {
  studentId: string;
  date: string;
  status: AttendanceStatus;
  time?: string;
  remarks?: string;
}

export interface SubjectScore {
  subject: string;
  score: number;
}

export interface Student {
  id: string;
  name: string;
  class: string;
  attendance: number;
  homework: number;
  performance: number;
  status: 'active' | 'inactive';
  parentId: string;
  parentName: string;
  parentContact: string;
  parentEmail: string;
  subjects: SubjectScore[];
  recentActivity: { time: string; activity: string; type: string }[];
  monthlyAttendance: { month: string; value: number }[];
  monthlyPerformance: { month: string; value: number }[];
  notifications: { id: string; title: string; message: string; date: string; type: string; read: boolean }[];
}

export interface Homework {
  id: string;
  title: string;
  subject: string;
  description: string;
  dueDate: string;
  class: string;
  completion: number;
  completedStudents: string[];
  pendingStudents: string[];
  status: 'active' | 'completed' | 'overdue';
  createdAt: string;
}

export interface Lesson {
  id: string;
  subject: string;
  title: string;
  date: string;
  duration: string;
  status: 'scheduled' | 'completed' | 'draft';
  notes?: string;
  notesLanguage?: string;
  absentStudentId?: string;
}

export interface MissedLesson {
  id: string;
  studentId: string;
  studentName: string;
  lessonTitle: string;
  subject: string;
  date: string;
  status: 'notes-available' | 'pending';
  notes?: string;
  language?: string;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  date: string;
  type: 'attendance' | 'homework' | 'performance' | 'absent' | 'parent-message' | 'system' | 'recycling' | 'collection' | 'eco-points';
  read: boolean;
  forRole: UserRole;
  studentId?: string;
}

export interface Message {
  id: string;
  from: string;
  to: string;
  fromRole: UserRole;
  toRole: UserRole;
  content: string;
  date: string;
  studentId?: string;
}

export interface ClassActivity {
  studentId: string;
  studentName: string;
  activity: string;
  activityType: 'viewing-lesson' | 'completing-homework' | 'taking-quiz' | 'inactive';
  timestamp: string;
}

export interface ParentAccount {
  id: string;
  email: string;
  password: string;
  name: string;
  childId: string;
  childName: string;
}

export interface TeacherAccount {
  id: string;
  email: string;
  password: string;
  name: string;
}

export interface StudentAccount {
  id: string;
  email: string;
  password: string;
  name: string;
  studentId: string;
  class: string;
}

export type WasteCategory = 'plastic-bottle' | 'plastic-container' | 'paper' | 'cardboard' | 'glass' | 'metal-can' | 'organic' | 'non-recyclable';

export interface WasteItem {
  id: string;
  category: WasteCategory;
  item: string;
  material: string;
  recyclable: boolean;
  confidence: number;
  instruction: string;
  recyclingInfo: string;
  points: number;
  icon: string;
  color: string;
}

export type CollectionStatus = 'requested' | 'assigned' | 'collected' | 'recycled';

export interface CollectionRequest {
  id: string;
  studentId: string;
  studentName: string;
  studentClass: string;
  wasteCategory: WasteCategory;
  wasteType: string;
  quantity: number;
  unit: string;
  estimatedWeight: number;
  weightUnit: string;
  collectionLocation: string;
  preferredDate: string;
  status: CollectionStatus;
  createdAt: string;
  pointsAwarded: boolean;
}

export interface RecyclingHistory {
  id: string;
  studentId: string;
  date: string;
  wasteType: string;
  category: WasteCategory;
  quantity: number;
  points: number;
}

export interface Badge {
  id: string;
  name: string;
  icon: string;
  description: string;
  threshold: number;
  type: 'scan' | 'collection' | 'items' | 'points';
}

export interface RecyclingArticle {
  id: string;
  title: string;
  icon: string;
  color: string;
  content: string;
  readTime: string;
}

export interface RecyclingQuiz {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  points: number;
}

export interface ScanRecord {
  id: string;
  studentId: string;
  date: string;
  imageDataUrl: string;
  identified: boolean;
  wasteType: string;
  category: WasteCategory;
  material: string;
  recyclable: boolean;
  instruction: string;
  points: number;
  confirmed: boolean;
}

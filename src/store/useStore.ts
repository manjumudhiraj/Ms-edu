import { useEffect, useState, useCallback } from 'react';
import type {
  Student,
  Homework,
  Lesson,
  MissedLesson,
  AppNotification,
  Message,
  ClassActivity,
  AttendanceRecord,
  CollectionRequest,
  RecyclingHistory,
  ScanRecord,
} from '@/types';
import * as demo from '@/data/demoData';
import * as recycling from '@/data/recyclingData';

const STORAGE_KEY = 'msedu_data_v3';

interface StoreData {
  students: Student[];
  homeworks: Homework[];
  lessons: Lesson[];
  missedLessons: MissedLesson[];
  notifications: AppNotification[];
  messages: Message[];
  classActivities: ClassActivity[];
  attendanceRecords: AttendanceRecord[];
  collectionRequests: CollectionRequest[];
  recyclingHistory: RecyclingHistory[];
  studentEcoPoints: Record<string, number>;
  studentItemsRecycled: Record<string, number>;
  studentScanCount: Record<string, number>;
  scanRecords: ScanRecord[];
}

function loadData(): StoreData {
  if (typeof window === 'undefined') return getDemoData();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      const defaults = getDemoData();
      return {
        ...defaults,
        ...parsed,
        scanRecords: parsed.scanRecords ?? defaults.scanRecords,
        studentEcoPoints: parsed.studentEcoPoints ?? defaults.studentEcoPoints,
        studentItemsRecycled: parsed.studentItemsRecycled ?? defaults.studentItemsRecycled,
        studentScanCount: parsed.studentScanCount ?? defaults.studentScanCount,
      };
    }
  } catch {
    // fall through
  }
  const data = getDemoData();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  return data;
}

function getDemoData(): StoreData {
  const pointsMap: Record<string, number> = {};
  const itemsMap: Record<string, number> = {};
  const scanMap: Record<string, number> = {};
  recycling.leaderboardData.forEach((s) => { pointsMap[s.studentId] = s.points; itemsMap[s.studentId] = s.items; });
  scanMap['STU005'] = 5;
  return {
    students: structuredClone(demo.students),
    homeworks: structuredClone(demo.homeworks),
    lessons: structuredClone(demo.lessons),
    missedLessons: structuredClone(demo.missedLessons),
    notifications: structuredClone(demo.notifications),
    messages: structuredClone(demo.messages),
    classActivities: structuredClone(demo.classActivities),
    attendanceRecords: structuredClone(demo.attendanceRecords),
    collectionRequests: structuredClone(recycling.collectionRequests),
    recyclingHistory: structuredClone(recycling.recyclingHistory),
    studentEcoPoints: pointsMap,
    studentItemsRecycled: itemsMap,
    studentScanCount: scanMap,
    scanRecords: [],
  };
}

function saveData(data: StoreData) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

let listeners: (() => void)[] = [];
let currentData: StoreData = loadData();

function notify() {
  listeners.forEach((l) => l());
}

export function useStore() {
  const [, setTick] = useState(0);

  useEffect(() => {
    const listener = () => setTick((t) => t + 1);
    listeners.push(listener);
    return () => {
      listeners = listeners.filter((l) => l !== listener);
    };
  }, []);

  const update = useCallback((updater: (data: StoreData) => void) => {
    const draft = { ...currentData };
    updater(draft);
    currentData = draft;
    saveData(draft);
    notify();
  }, []);

  return { data: currentData, update };
}

export function resetStore() {
  currentData = getDemoData();
  saveData(currentData);
  notify();
}

export function getStore() {
  return currentData;
}

export function updateStore(updater: (data: StoreData) => void) {
  const draft = { ...currentData };
  updater(draft);
  currentData = draft;
  saveData(draft);
  notify();
}

export type { StoreData };

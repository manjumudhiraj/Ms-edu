export interface AdminScanRow {
  id: string;
  timestamp: string;
  userId: string;
  detectedItem: string;
  confidence: number;
  assignedBin: 'Recycling' | 'Organic' | 'General Waste' | 'Hazardous';
}

export interface AdminAlert {
  id: string;
  title: string;
  message: string;
  severity: 'critical' | 'warning' | 'info';
  time: string;
}

export interface TruckRoute {
  id: string;
  routeName: string;
  driver: string;
  status: 'En Route' | 'Collecting' | 'Returning to Facility';
  binsCollected: number;
  totalBins: number;
  capacity: number;
  zone: string;
  eta: string;
}

export interface BinCapacity {
  id: string;
  zone: string;
  location: string;
  fillLevel: number;
  type: 'Recycling' | 'Organic' | 'General';
}

export interface LeaderboardEntry {
  rank: number;
  name: string;
  type: 'Hostel' | 'Block' | 'Ward';
  ecoPoints: number;
  segregationAccuracy: number;
  scans: number;
  trend: 'up' | 'down' | 'stable';
}

export interface WasteVolumePoint {
  day: string;
  recycling: number;
  organic: number;
  general: number;
}

export const wasteVolumeData: WasteVolumePoint[] = [
  { day: 'Thu', recycling: 420, organic: 310, general: 180 },
  { day: 'Fri', recycling: 480, organic: 340, general: 210 },
  { day: 'Sat', recycling: 380, organic: 280, general: 160 },
  { day: 'Sun', recycling: 290, organic: 220, general: 130 },
  { day: 'Mon', recycling: 510, organic: 390, general: 240 },
  { day: 'Tue', recycling: 560, organic: 410, general: 200 },
  { day: 'Wed', recycling: 600, organic: 430, general: 220 },
];

export const recentAlerts: AdminAlert[] = [
  { id: 'AL-001', title: 'High Contamination Detected', message: 'Hostel Block B — Recycling bin contains 34% organic waste contamination', severity: 'critical', time: '2 min ago' },
  { id: 'AL-002', title: 'Smart Bin #4 Full', message: 'Library Plaza recycling bin at 96% capacity — needs immediate collection', severity: 'warning', time: '8 min ago' },
  { id: 'AL-003', title: 'Truck Route 2 Delayed', message: 'Route 2 (North Campus) running 15 minutes behind schedule due to traffic', severity: 'warning', time: '22 min ago' },
  { id: 'AL-004', title: 'New Zone Activated', message: 'Ward 7 smart bins are now online and reporting data', severity: 'info', time: '1 hr ago' },
  { id: 'AL-005', title: 'Segregation Accuracy Milestone', message: 'Engineering Block C achieved 98% segregation accuracy for 7 consecutive days', severity: 'info', time: '2 hr ago' },
];

export const liveScans: AdminScanRow[] = [
  { id: 'S-2401', timestamp: '10:42:15 AM', userId: 'STU-0342', detectedItem: 'Plastic Bottle', confidence: 98, assignedBin: 'Recycling' },
  { id: 'S-2400', timestamp: '10:41:48 AM', userId: 'STU-0517', detectedItem: 'Food Waste', confidence: 95, assignedBin: 'Organic' },
  { id: 'S-2399', timestamp: '10:41:22 AM', userId: 'STU-0208', detectedItem: 'Cardboard Box', confidence: 96, assignedBin: 'Recycling' },
  { id: 'S-2398', timestamp: '10:40:55 AM', userId: 'STU-0441', detectedItem: 'Aluminum Can', confidence: 99, assignedBin: 'Recycling' },
  { id: 'S-2397', timestamp: '10:40:31 AM', userId: 'STU-0163', detectedItem: 'Glass Bottle', confidence: 93, assignedBin: 'Recycling' },
  { id: 'S-2396', timestamp: '10:39:58 AM', userId: 'STU-0299', detectedItem: 'Banana Peel', confidence: 91, assignedBin: 'Organic' },
  { id: 'S-2395', timestamp: '10:39:12 AM', userId: 'STU-0087', detectedItem: 'Mixed Wrapper', confidence: 64, assignedBin: 'General Waste' },
  { id: 'S-2394', timestamp: '10:38:44 AM', userId: 'STU-0356', detectedItem: 'Paper Cup', confidence: 89, assignedBin: 'Recycling' },
  { id: 'S-2393', timestamp: '10:38:10 AM', userId: 'STU-0124', detectedItem: 'Battery', confidence: 87, assignedBin: 'Hazardous' },
  { id: 'S-2392', timestamp: '10:37:33 AM', userId: 'STU-0478', detectedItem: 'Plastic Container', confidence: 94, assignedBin: 'Recycling' },
  { id: 'S-2391', timestamp: '10:37:05 AM', userId: 'STU-0019', detectedItem: 'Tea Bag', confidence: 86, assignedBin: 'Organic' },
  { id: 'S-2390', timestamp: '10:36:28 AM', userId: 'STU-0233', detectedItem: 'Newspaper', confidence: 97, assignedBin: 'Recycling' },
];

export const truckRoutes: TruckRoute[] = [
  { id: 'TR-01', routeName: 'Route 1 — South Campus', driver: 'Rajesh Kumar', status: 'En Route', binsCollected: 0, totalBins: 14, capacity: 22, zone: 'South Campus', eta: '11:15 AM' },
  { id: 'TR-02', routeName: 'Route 2 — North Campus', driver: 'Mohan Singh', status: 'Collecting', binsCollected: 8, totalBins: 12, capacity: 67, zone: 'North Campus', eta: '11:45 AM' },
  { id: 'TR-03', routeName: 'Route 3 — Hostel Blocks', driver: 'Anil Patel', status: 'Returning to Facility', binsCollected: 18, totalBins: 18, capacity: 91, zone: 'Hostel Zone', eta: '12:00 PM' },
];

export const binCapacities: BinCapacity[] = [
  { id: 'BIN-01', zone: 'South Campus', location: 'Library Plaza', fillLevel: 96, type: 'Recycling' },
  { id: 'BIN-02', zone: 'South Campus', location: 'Cafeteria East', fillLevel: 42, type: 'Organic' },
  { id: 'BIN-03', zone: 'North Campus', location: 'Engineering Block', fillLevel: 68, type: 'Recycling' },
  { id: 'BIN-04', zone: 'North Campus', location: 'Science Block', fillLevel: 35, type: 'General' },
  { id: 'BIN-05', zone: 'Hostel Zone', location: 'Hostel Block A', fillLevel: 78, type: 'Recycling' },
  { id: 'BIN-06', zone: 'Hostel Zone', location: 'Hostel Block B', fillLevel: 88, type: 'Organic' },
  { id: 'BIN-07', zone: 'Hostel Zone', location: 'Hostel Block C', fillLevel: 15, type: 'General' },
  { id: 'BIN-08', zone: 'Sports Complex', location: 'Gym Entrance', fillLevel: 53, type: 'Recycling' },
  { id: 'BIN-09', zone: 'Sports Complex', location: 'Stadium Gate', fillLevel: 27, type: 'General' },
  { id: 'BIN-10', zone: 'Ward 7', location: 'Market Square', fillLevel: 61, type: 'Organic' },
  { id: 'BIN-11', zone: 'Ward 7', location: 'Bus Terminal', fillLevel: 44, type: 'Recycling' },
  { id: 'BIN-12', zone: 'Ward 7', location: 'Park Entrance', fillLevel: 72, type: 'General' },
];

export interface SchoolRecycling {
  id: string;
  name: string;
  students: number;
  wasteCollected: number;
  recyclableKg: number;
  recyclingRate: number;
  ecoPoints: number;
  participation: number;
}

export interface CollectionRequestRow {
  id: string;
  school: string;
  wasteType: string;
  amount: string;
  status: 'Pending' | 'Scheduled' | 'Collected' | 'Processing';
  date: string;
}

export interface RecyclableMaterial {
  material: string;
  collected: number;
  recycled: number;
  color: string;
}

export interface StudentWasteReport {
  id: string;
  student: string;
  school: string;
  item: string;
  category: string;
  points: number;
  date: string;
}

export const schoolRecyclingData: SchoolRecycling[] = [
  { id: 'SCH-01', name: 'Greenwood High School', students: 320, wasteCollected: 480, recyclableKg: 396, recyclingRate: 83, ecoPoints: 4820, participation: 94 },
  { id: 'SCH-02', name: 'Sunrise Public School', students: 280, wasteCollected: 410, recyclableKg: 303, recyclingRate: 74, ecoPoints: 3640, participation: 88 },
  { id: 'SCH-03', name: 'St. Mary\'s Academy', students: 350, wasteCollected: 520, recyclableKg: 442, recyclingRate: 85, ecoPoints: 5120, participation: 91 },
  { id: 'SCH-04', name: 'Jawahar Vidyalaya', students: 240, wasteCollected: 310, recyclableKg: 223, recyclingRate: 72, ecoPoints: 2980, participation: 82 },
  { id: 'SCH-05', name: 'Modern International School', students: 410, wasteCollected: 610, recyclableKg: 531, recyclingRate: 87, ecoPoints: 5680, participation: 95 },
  { id: 'SCH-06', name: 'Govt. Primary School Ward 7', students: 180, wasteCollected: 190, recyclableKg: 125, recyclingRate: 66, ecoPoints: 1860, participation: 75 },
];

export const collectionRequests: CollectionRequestRow[] = [
  { id: 'REQ-1042', school: 'Greenwood High School', wasteType: 'Paper & Cardboard', amount: '45 kg', status: 'Pending', date: 'Oct 3, 10:30 AM' },
  { id: 'REQ-1041', school: 'St. Mary\'s Academy', wasteType: 'Plastic Bottles', amount: '28 kg', status: 'Scheduled', date: 'Oct 3, 09:15 AM' },
  { id: 'REQ-1040', school: 'Modern International School', wasteType: 'E-Waste (Devices)', amount: '12 kg', status: 'Processing', date: 'Oct 2, 04:00 PM' },
  { id: 'REQ-1039', school: 'Sunrise Public School', wasteType: 'Metal Cans', amount: '18 kg', status: 'Collected', date: 'Oct 2, 02:30 PM' },
  { id: 'REQ-1038', school: 'Jawahar Vidyalaya', wasteType: 'Mixed Recyclables', amount: '33 kg', status: 'Scheduled', date: 'Oct 2, 11:00 AM' },
  { id: 'REQ-1037', school: 'Govt. Primary School Ward 7', wasteType: 'Organic Waste', amount: '52 kg', status: 'Collected', date: 'Oct 1, 03:45 PM' },
];

export const recyclableMaterials: RecyclableMaterial[] = [
  { material: 'Paper', collected: 1240, recycled: 1080, color: '#3b82f6' },
  { material: 'Plastic', collected: 860, recycled: 690, color: '#06b6d4' },
  { material: 'Metal', collected: 420, recycled: 380, color: '#f59e0b' },
  { material: 'E-Waste', collected: 95, recycled: 72, color: '#ef4444' },
  { material: 'Glass', collected: 310, recycled: 280, color: '#10b981' },
];

export const studentWasteReports: StudentWasteReport[] = [
  { id: 'WR-0312', student: 'Aarav Sharma', school: 'Greenwood High School', item: 'Plastic Bottle', category: 'Plastic', points: 10, date: 'Oct 3, 10:42 AM' },
  { id: 'WR-0311', student: 'Diya Patel', school: 'St. Mary\'s Academy', item: 'Cardboard Box', category: 'Paper', points: 15, date: 'Oct 3, 10:38 AM' },
  { id: 'WR-0310', student: 'Kabir Singh', school: 'Modern International School', item: 'Aluminum Can', category: 'Metal', points: 12, date: 'Oct 3, 10:31 AM' },
  { id: 'WR-0309', student: 'Ananya Rao', school: 'Sunrise Public School', item: 'Old Notebook', category: 'Paper', points: 8, date: 'Oct 3, 10:25 AM' },
  { id: 'WR-0308', student: 'Vihaan Gupta', school: 'Greenwood High School', item: 'Broken Headphones', category: 'E-Waste', points: 25, date: 'Oct 3, 10:18 AM' },
  { id: 'WR-0307', student: 'Saanvi Reddy', school: 'Jawahar Vidyalaya', item: 'Glass Bottle', category: 'Glass', points: 10, date: 'Oct 3, 10:05 AM' },
];

export const campusLeaderboard: LeaderboardEntry[] = [
  { rank: 1, name: 'Engineering Block C', type: 'Block', ecoPoints: 4820, segregationAccuracy: 98, scans: 1240, trend: 'up' },
  { rank: 2, name: 'Hostel Block A', type: 'Hostel', ecoPoints: 4350, segregationAccuracy: 95, scans: 1080, trend: 'up' },
  { rank: 3, name: 'Science Block', type: 'Block', ecoPoints: 3920, segregationAccuracy: 93, scans: 960, trend: 'stable' },
  { rank: 4, name: 'Hostel Block B', type: 'Hostel', ecoPoints: 3480, segregationAccuracy: 87, scans: 820, trend: 'down' },
  { rank: 5, name: 'Library Plaza', type: 'Block', ecoPoints: 3100, segregationAccuracy: 91, scans: 740, trend: 'up' },
  { rank: 6, name: 'Hostel Block C', type: 'Hostel', ecoPoints: 2760, segregationAccuracy: 89, scans: 650, trend: 'stable' },
  { rank: 7, name: 'Sports Complex', type: 'Block', ecoPoints: 2340, segregationAccuracy: 84, scans: 580, trend: 'up' },
  { rank: 8, name: 'Ward 7 — Market', type: 'Ward', ecoPoints: 1980, segregationAccuracy: 81, scans: 490, trend: 'down' },
  { rank: 9, name: 'Cafeteria Zone', type: 'Block', ecoPoints: 1670, segregationAccuracy: 78, scans: 410, trend: 'stable' },
  { rank: 10, name: 'Ward 7 — Terminal', type: 'Ward', ecoPoints: 1340, segregationAccuracy: 75, scans: 320, trend: 'up' },
];

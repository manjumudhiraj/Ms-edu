import { useState, useRef, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useStore, updateStore } from '@/store/useStore';
import { PageHeader, StatusBadge, SectionCard } from '@/components/ui';
import {
  Camera, Upload, Recycle, Loader2, CheckCircle, X, Package, Leaf,
  RefreshCw, ImageIcon, AlertCircle, Search,
} from 'lucide-react';
import { wasteItems } from '@/data/recyclingData';
import type { WasteCategory, CollectionRequest, ScanRecord } from '@/types';

type ScanState = 'idle' | 'image-selected' | 'analyzing' | 'result' | 'unavailable';

export default function ScanWaste() {
  const { user } = useAuth();
  const { data } = useStore();
  const sid = user?.studentId || 'STU005';

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const [scanState, setScanState] = useState<ScanState>('idle');
  const [imageDataUrl, setImageDataUrl] = useState<string>('');
  const [identifiedCategory, setIdentifiedCategory] = useState<WasteCategory | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const [showCollection, setShowCollection] = useState(false);
  const [collectionForm, setCollectionForm] = useState({
    quantity: 1,
    unit: 'bottles',
    weight: 50,
    weightUnit: 'g',
    location: 'School Recycling Station',
    preferredDate: '',
  });

  const myScans = data.scanRecords.filter((s) => s.studentId === sid);

  const handleFileSelected = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const url = e.target?.result as string;
      if (url) {
        setImageDataUrl(url);
        setScanState('image-selected');
        setIdentifiedCategory(null);
        setConfirmed(false);
      }
    };
    reader.readAsDataURL(file);
  }, []);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileSelected(file);
    e.target.value = '';
  };

  const analyzeImage = () => {
    setScanState('analyzing');
    setTimeout(() => {
      const identificationServiceAvailable = false;

      if (!identificationServiceAvailable) {
        setScanState('unavailable');
        return;
      }

      // This branch is where a real image-classification API result would arrive.
      // It is intentionally unreachable until an actual API is connected.
      const category = identifyFromImage(imageDataUrl);
      if (category) {
        setIdentifiedCategory(category);
        setScanState('result');
      } else {
        setScanState('unavailable');
      }
    }, 2500);
  };

  // Placeholder for real image classification API integration.
  // Returns null because no real recognition service is connected.
  function identifyFromImage(_imageDataUrl: string): WasteCategory | null {
    return null;
  }

  const handleConfirm = () => {
    if (!identifiedCategory) return;
    const item = wasteItems[identifiedCategory];
    const scanId = `SCAN-${Date.now()}`;

    const record: ScanRecord = {
      id: scanId,
      studentId: sid,
      date: new Date().toISOString().split('T')[0],
      imageDataUrl,
      identified: true,
      wasteType: item.item,
      category: identifiedCategory,
      material: item.material,
      recyclable: item.recyclable,
      instruction: item.instruction,
      points: item.points,
      confirmed: true,
    };

    updateStore((d) => {
      d.scanRecords.unshift(record);
      d.studentScanCount[sid] = (d.studentScanCount[sid] || 0) + 1;
    });

    setConfirmed(true);
  };

  const handleSubmitCollection = () => {
    if (!identifiedCategory) return;
    const item = wasteItems[identifiedCategory];
    const reqId = `REC-${1025 + data.collectionRequests.length}`;
    const newReq: CollectionRequest = {
      id: reqId,
      studentId: sid,
      studentName: user?.name || 'Student',
      studentClass: '8-A',
      wasteCategory: identifiedCategory,
      wasteType: item.item,
      quantity: collectionForm.quantity,
      unit: collectionForm.unit,
      estimatedWeight: collectionForm.weight,
      weightUnit: collectionForm.weightUnit,
      collectionLocation: collectionForm.location,
      preferredDate: collectionForm.preferredDate || new Date().toISOString().split('T')[0],
      status: 'requested',
      createdAt: new Date().toISOString().split('T')[0],
      pointsAwarded: false,
    };

    updateStore((d) => {
      d.collectionRequests.unshift(newReq);
      d.notifications.unshift({
        id: `N${Date.now()}`,
        title: 'Collection Request Created',
        message: `Request ${reqId} for ${item.item} has been submitted. Status: Pending Collection.`,
        date: new Date().toISOString().split('T')[0],
        type: 'collection',
        read: false,
        forRole: 'student',
        studentId: sid,
      });
      d.notifications.unshift({
        id: `NT${Date.now()}`,
        title: 'New Collection Request',
        message: `${user?.name} submitted a collection request for ${item.item}.`,
        date: new Date().toISOString().split('T')[0],
        type: 'recycling',
        read: false,
        forRole: 'teacher',
        studentId: sid,
      });
    });

    setShowCollection(false);
    resetScanner();
  };

  const resetScanner = () => {
    setScanState('idle');
    setImageDataUrl('');
    setIdentifiedCategory(null);
    setConfirmed(false);
  };

  const result = identifiedCategory ? wasteItems[identifiedCategory] : null;

  return (
    <div className="animate-fade-in pb-16 lg:pb-0">
      <PageHeader title="Scan Waste" subtitle="Identify waste items and learn how to recycle them" />

      {/* Hidden file inputs */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={onFileChange}
      />
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={onFileChange}
      />

      {/* IDLE STATE — no image yet */}
      {scanState === 'idle' && (
        <div className="space-y-4">
          <div className="card p-8">
            <div className="text-center mb-6">
              <div className="w-16 h-16 rounded-3xl bg-gray-50 flex items-center justify-center mx-auto mb-3">
                <ImageIcon className="w-8 h-8 text-gray-300" />
              </div>
              <p className="text-sm text-gray-500">No waste scanned yet. Please scan or upload an image.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                onClick={() => cameraInputRef.current?.click()}
                className="flex flex-col items-center justify-center gap-3 p-6 rounded-2xl border-2 border-edu-blue/20 bg-blue-50/50 hover:bg-blue-50 hover:border-edu-blue transition-all"
              >
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-edu-blue to-edu-cyan flex items-center justify-center shadow-lg">
                  <Camera className="w-8 h-8 text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-navy-800">Scan with Camera</p>
                  <p className="text-xs text-gray-500 mt-0.5">Open your device camera</p>
                </div>
              </button>

              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex flex-col items-center justify-center gap-3 p-6 rounded-2xl border-2 border-edu-green/20 bg-green-50/50 hover:bg-green-50 hover:border-edu-green transition-all"
              >
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-edu-green to-edu-lightgreen flex items-center justify-center shadow-lg">
                  <Upload className="w-8 h-8 text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-navy-800">Upload Image</p>
                  <p className="text-xs text-gray-500 mt-0.5">Choose a photo from your device</p>
                </div>
              </button>
            </div>
          </div>

          {/* Recent scans */}
          {myScans.length > 0 && (
            <SectionCard title="Your Recent Scans" subtitle="Confirmed waste identifications">
              <div className="space-y-2">
                {myScans.slice(0, 5).map((scan) => {
                  const item = wasteItems[scan.category];
                  return (
                    <div key={scan.id} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50">
                      <img src={scan.imageDataUrl} alt="scanned waste" className="w-12 h-12 rounded-lg object-cover shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-navy-800">{scan.wasteType}</p>
                        <p className="text-xs text-gray-400">{scan.material} · {scan.date}</p>
                      </div>
                      <div className="text-right shrink-0">
                        {scan.recyclable ? (
                          <StatusBadge variant="green"><Recycle className="w-3 h-3" /> Recyclable</StatusBadge>
                        ) : (
                          <StatusBadge variant="red">Non-Recyclable</StatusBadge>
                        )}
                        <p className="text-xs text-edu-amber font-semibold mt-1">+{scan.points} pts</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </SectionCard>
          )}
        </div>
      )}

      {/* IMAGE SELECTED — waiting for user to analyze */}
      {scanState === 'image-selected' && (
        <div className="card p-6">
          <div className="flex items-start justify-between mb-4">
            <h3 className="text-sm font-semibold text-navy-800">Image Selected</h3>
            <button onClick={resetScanner} className="p-2 rounded-lg hover:bg-gray-100">
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          <div className="rounded-2xl overflow-hidden mb-4 bg-gray-100 flex items-center justify-center max-h-[400px]">
            <img src={imageDataUrl} alt="selected waste" className="w-full max-h-[400px] object-contain" />
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button onClick={analyzeImage} className="btn-primary flex-1 py-3">
              <Search className="w-4 h-4" /> Identify Waste
            </button>
            <button onClick={() => fileInputRef.current?.click()} className="btn-secondary py-3">
              <RefreshCw className="w-4 h-4" /> Choose Different Image
            </button>
          </div>
        </div>
      )}

      {/* ANALYZING */}
      {scanState === 'analyzing' && (
        <div className="card p-8">
          <div className="rounded-2xl overflow-hidden mb-6 bg-gray-100 flex items-center justify-center max-h-[300px]">
            <img src={imageDataUrl} alt="analyzing waste" className="w-full max-h-[300px] object-contain opacity-70" />
          </div>
          <div className="flex flex-col items-center">
            <Loader2 className="w-10 h-10 text-edu-blue animate-spin mb-3" />
            <p className="text-base font-semibold text-navy-800">Analyzing waste...</p>
            <p className="text-xs text-gray-400 mt-1">Running waste classification</p>
          </div>
        </div>
      )}

      {/* UNAVAILABLE — identification service not connected */}
      {scanState === 'unavailable' && (
        <div className="card p-6">
          <div className="rounded-2xl overflow-hidden mb-4 bg-gray-100 flex items-center justify-center max-h-[300px]">
            <img src={imageDataUrl} alt="submitted waste" className="w-full max-h-[300px] object-contain" />
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-4">
            <div className="flex items-center gap-2 mb-1">
              <AlertCircle className="w-5 h-5 text-edu-amber" />
              <p className="text-sm font-semibold text-amber-700">Image received. Waste identification service is currently unavailable.</p>
            </div>
            <p className="text-xs text-amber-600 mt-1">
              The image was received successfully, but no image-classification API is connected. Please retry or connect a waste identification service.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button onClick={analyzeImage} className="btn-primary flex-1 py-3">
              <RefreshCw className="w-4 h-4" /> Retry Identification
            </button>
            <button onClick={resetScanner} className="btn-secondary py-3">
              <X className="w-4 h-4" /> Cancel
            </button>
          </div>
        </div>
      )}

      {/* RESULT — identification complete */}
      {scanState === 'result' && result && (
        <div className="space-y-4">
          <div className="card p-6 animate-slide-up">
            <div className="rounded-2xl overflow-hidden mb-4 bg-gray-100 flex items-center justify-center max-h-[250px]">
              <img src={imageDataUrl} alt="scanned waste" className="w-full max-h-[250px] object-contain" />
            </div>

            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center text-2xl">
                  {result.icon}
                </div>
                <div>
                  <h2 className="text-lg font-bold text-navy-800">{result.item}</h2>
                  <div className="flex items-center gap-2 mt-1">
                    {result.recyclable ? (
                      <StatusBadge variant="green"><Recycle className="w-3 h-3" /> Recyclable</StatusBadge>
                    ) : (
                      <StatusBadge variant="red">Non-Recyclable</StatusBadge>
                    )}
                  </div>
                </div>
              </div>
              <button onClick={resetScanner} className="p-2 rounded-lg hover:bg-gray-100">
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
              <div className="bg-gray-50 rounded-xl p-3">
                <p className="text-xs text-gray-400 uppercase">Category</p>
                <p className="text-sm font-semibold text-navy-800 mt-0.5">{result.item}</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-3">
                <p className="text-xs text-gray-400 uppercase">Material</p>
                <p className="text-sm font-semibold text-navy-800 mt-0.5">{result.material}</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-3">
                <p className="text-xs text-gray-400 uppercase">Eco Points</p>
                <p className="text-sm font-semibold text-edu-green mt-0.5">+{result.points} pts</p>
              </div>
            </div>

            <div className="bg-blue-50 rounded-xl p-3 mb-3">
              <p className="text-xs font-semibold text-edu-blue mb-1">Suggested Disposal Method</p>
              <p className="text-sm text-navy-700">{result.instruction}</p>
            </div>

            <div className="bg-green-50 rounded-xl p-3 mb-4">
              <p className="text-xs font-semibold text-edu-green mb-1 flex items-center gap-1"><Leaf className="w-3 h-3" /> Recycling Information</p>
              <p className="text-sm text-navy-700">{result.recyclingInfo}</p>
            </div>

            {/* Confirm / action buttons */}
            {!confirmed ? (
              <div className="flex flex-col sm:flex-row gap-3">
                <button onClick={handleConfirm} className="btn-success flex-1 py-3">
                  <CheckCircle className="w-4 h-4" /> Confirm Identification
                </button>
                <button onClick={resetScanner} className="btn-secondary py-3">
                  <X className="w-4 h-4" /> Incorrect — Rescan
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="bg-green-50 border border-green-200 rounded-xl p-3 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-edu-green shrink-0" />
                  <p className="text-sm font-medium text-edu-green">Scan confirmed and saved to your history.</p>
                </div>
                {result.recyclable && (
                  <button onClick={() => setShowCollection(true)} className="btn-success w-full py-3">
                    <Package className="w-4 h-4" /> Submit for Collection
                  </button>
                )}
                <button onClick={resetScanner} className="btn-secondary w-full py-3">
                  <Camera className="w-4 h-4" /> Scan Another Item
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Collection request modal */}
      {showCollection && result && identifiedCategory && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 animate-fade-in" onClick={() => setShowCollection(false)}>
          <div className="bg-white rounded-2xl shadow-edu-lg max-w-lg w-full p-6 animate-slide-up max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-navy-800">Collection Request</h2>
              <button onClick={() => setShowCollection(false)} className="p-1.5 rounded-lg hover:bg-gray-100"><X className="w-5 h-5 text-gray-500" /></button>
            </div>

            <div className="bg-gray-50 rounded-xl p-3 mb-4 flex items-center gap-3">
              <span className="text-2xl">{result.icon}</span>
              <div>
                <p className="text-sm font-semibold text-navy-800">{result.item}</p>
                <p className="text-xs text-gray-400">{result.material} · {result.recyclable ? 'Recyclable' : 'Non-Recyclable'}</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-gray-600 mb-1.5 block">Quantity</label>
                  <input type="number" min="1" value={collectionForm.quantity} onChange={(e) => setCollectionForm({ ...collectionForm, quantity: parseInt(e.target.value) || 1 })} className="input-field" />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600 mb-1.5 block">Unit</label>
                  <input type="text" value={collectionForm.unit} onChange={(e) => setCollectionForm({ ...collectionForm, unit: e.target.value })} className="input-field" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-gray-600 mb-1.5 block">Approximate Weight</label>
                  <input type="number" min="1" value={collectionForm.weight} onChange={(e) => setCollectionForm({ ...collectionForm, weight: parseInt(e.target.value) || 0 })} className="input-field" />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600 mb-1.5 block">Weight Unit</label>
                  <select value={collectionForm.weightUnit} onChange={(e) => setCollectionForm({ ...collectionForm, weightUnit: e.target.value })} className="input-field">
                    <option>g</option><option>kg</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1.5 block">Pickup Location</label>
                <select value={collectionForm.location} onChange={(e) => setCollectionForm({ ...collectionForm, location: e.target.value })} className="input-field">
                  <option>School Recycling Station</option>
                  <option>Classroom Recycling Bin</option>
                  <option>Main Gate Collection Point</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1.5 block">Preferred Collection Date</label>
                <input type="date" value={collectionForm.preferredDate} onChange={(e) => setCollectionForm({ ...collectionForm, preferredDate: e.target.value })} className="input-field" />
              </div>
              <button onClick={handleSubmitCollection} className="btn-success w-full py-3">
                <CheckCircle className="w-4 h-4" /> Request Collection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

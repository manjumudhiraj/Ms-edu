import { useState } from 'react';
import { useStore, updateStore } from '@/store/useStore';
import { PageHeader, StatusBadge, SectionCard } from '@/components/ui';
import {
  FileText, Plus, X, Eye, Edit, Send, Mic, MicOff, Globe,
  CheckCircle, Calendar, Clock, BookOpen, Volume2,
} from 'lucide-react';
import type { Lesson } from '@/types';

const languages = [
  { code: 'English', label: 'English', flag: 'EN' },
  { code: 'Telugu', label: 'Telugu', flag: 'TE' },
  { code: 'Hindi', label: 'Hindi', flag: 'HI' },
];

export default function Lessons() {
  const { data } = useStore();
  const [showForm, setShowForm] = useState(false);
  const [showVoice, setShowVoice] = useState(false);
  const [viewLesson, setViewLesson] = useState<Lesson | null>(null);
  const [form, setForm] = useState({ subject: 'Mathematics', title: '', date: '', duration: '45 min' });

  const [isRecording, setIsRecording] = useState(false);
  const [voiceText, setVoiceText] = useState('');
  const [voiceLang, setVoiceLang] = useState('English');
  const [voiceStep, setVoiceStep] = useState(0);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const newLesson: Lesson = {
      id: `LES${Date.now()}`,
      subject: form.subject,
      title: form.title,
      date: form.date,
      duration: form.duration,
      status: 'scheduled',
    };
    updateStore((d) => { d.lessons.unshift(newLesson); });
    setShowForm(false);
    setForm({ subject: 'Mathematics', title: '', date: '', duration: '45 min' });
  };

  const startRecording = () => {
    setIsRecording(true);
    setVoiceStep(1);
    setVoiceText('');
    const demoText = 'Today we learned about quadratic equations. A quadratic equation has the form ax squared plus bx plus c equals zero. The discriminant is b squared minus 4ac. If the discriminant is positive, there are two real roots. If zero, one repeated root. If negative, two complex roots.';
    let i = 0;
    const interval = setInterval(() => {
      if (i <= demoText.length) {
        setVoiceText(demoText.slice(0, i));
        i += 3;
      } else {
        clearInterval(interval);
      }
    }, 30);
    setTimeout(() => {
      setIsRecording(false);
      setVoiceStep(2);
    }, 3500);
  };

  const saveVoiceNotes = () => {
    setVoiceStep(3);
    const newLesson: Lesson = {
      id: `LES${Date.now()}`,
      subject: 'Science',
      title: 'Voice-Generated Lesson Notes',
      date: new Date().toISOString().split('T')[0],
      duration: '50 min',
      status: 'completed',
      notes: voiceText,
      notesLanguage: voiceLang,
    };
    updateStore((d) => {
      d.lessons.unshift(newLesson);
      d.missedLessons.unshift({
        id: `ML${Date.now()}`,
        studentId: 'STU003',
        studentName: 'Rahul Sharma',
        lessonTitle: 'Voice-Generated Lesson Notes',
        subject: 'Science',
        date: new Date().toISOString().split('T')[0],
        status: 'notes-available',
        notes: voiceText,
        language: voiceLang,
      });
      d.notifications.unshift({
        id: `N${Date.now()}`,
        title: 'New Lesson Notes Available',
        message: `Lesson notes for "${newLesson.title}" are now available in ${voiceLang}`,
        date: new Date().toISOString().split('T')[0],
        type: 'system',
        read: false,
        forRole: 'parent',
        studentId: 'STU003',
      });
    });
    setTimeout(() => {
      setShowVoice(false);
      setVoiceStep(0);
      setVoiceText('');
    }, 1500);
  };

  const sendToClassroom = (lesson: Lesson) => {
    updateStore((d) => {
      const l = d.lessons.find((x) => x.id === lesson.id);
      if (l) l.status = 'completed';
      d.notifications.unshift({
        id: `N${Date.now()}`,
        title: 'Lesson Sent to Classroom',
        message: `${lesson.title} has been sent to the Ms.Edu smart classroom`,
        date: new Date().toISOString().split('T')[0],
        type: 'system',
        read: false,
        forRole: 'teacher',
      });
    });
  };

  return (
    <div className="animate-fade-in pb-16 lg:pb-0">
      <PageHeader
        title="Lessons"
        subtitle="Manage and upload lessons to the Ms.Edu classroom"
        action={
          <div className="flex gap-2">
            <button onClick={() => setShowVoice(true)} className="btn-secondary">
              <Mic className="w-4 h-4 text-edu-red" /> Voice to Notes
            </button>
            <button onClick={() => setShowForm(true)} className="btn-primary">
              <Plus className="w-4 h-4" /> Create Lesson
            </button>
          </div>
        }
      />

      {/* Lessons list */}
      <div className="space-y-3">
        {data.lessons.map((lesson) => (
          <div key={lesson.id} className="card p-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="flex items-start gap-3 flex-1">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                  lesson.subject === 'Mathematics' ? 'bg-blue-50' :
                  lesson.subject === 'Science' ? 'bg-green-50' :
                  lesson.subject === 'English' ? 'bg-cyan-50' : 'bg-amber-50'
                }`}>
                  <BookOpen className={`w-5 h-5 ${
                    lesson.subject === 'Mathematics' ? 'text-edu-blue' :
                    lesson.subject === 'Science' ? 'text-edu-green' :
                    lesson.subject === 'English' ? 'text-edu-cyan' : 'text-edu-amber'
                  }`} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-0.5">
                    <h3 className="text-sm font-semibold text-navy-800">{lesson.title}</h3>
                    {lesson.status === 'completed' && <StatusBadge variant="green">Completed</StatusBadge>}
                    {lesson.status === 'scheduled' && <StatusBadge variant="blue">Scheduled</StatusBadge>}
                    {lesson.status === 'draft' && <StatusBadge variant="gray">Draft</StatusBadge>}
                  </div>
                  <div className="flex flex-wrap gap-3 text-xs text-gray-500">
                    <span className="flex items-center gap-1"><BookOpen className="w-3 h-3" /> {lesson.subject}</span>
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {lesson.date}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {lesson.duration}</span>
                    {lesson.notes && <span className="flex items-center gap-1 text-edu-green"><CheckCircle className="w-3 h-3" /> Notes: {lesson.notesLanguage}</span>}
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                {lesson.notes && (
                  <button onClick={() => setViewLesson(lesson)} className="p-2 rounded-lg bg-gray-50 text-gray-600 hover:bg-gray-100" title="View">
                    <Eye className="w-4 h-4" />
                  </button>
                )}
                <button className="p-2 rounded-lg bg-gray-50 text-gray-600 hover:bg-gray-100" title="Edit">
                  <Edit className="w-4 h-4" />
                </button>
                <button onClick={() => sendToClassroom(lesson)} className="px-3 py-2 rounded-lg bg-edu-blue/10 text-edu-blue text-xs font-medium hover:bg-edu-blue/20 flex items-center gap-1.5" title="Send to Classroom">
                  <Send className="w-3.5 h-3.5" /> Send
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create lesson modal */}
      {showForm && (
        <Modal onClose={() => setShowForm(false)} title="Create Lesson">
          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="text-xs font-medium text-gray-600 mb-1.5 block">Lesson Title</label>
              <input type="text" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="input-field" placeholder="e.g. Photosynthesis" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1.5 block">Subject</label>
                <select value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} className="input-field">
                  <option>Mathematics</option><option>Science</option><option>English</option><option>Social Studies</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1.5 block">Duration</label>
                <select value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} className="input-field">
                  <option>30 min</option><option>45 min</option><option>50 min</option><option>60 min</option>
                </select>
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600 mb-1.5 block">Date</label>
              <input type="date" required value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="input-field" />
            </div>
            <button type="submit" className="btn-primary w-full py-3">Create Lesson</button>
          </form>
        </Modal>
      )}

      {/* Voice to Notes modal */}
      {showVoice && (
        <Modal onClose={() => { setShowVoice(false); setVoiceStep(0); setVoiceText(''); }} title="Voice to Lesson Notes (Prototype)">
          <div className="space-y-4">
            {/* Pipeline visualization */}
            <div className="flex items-center justify-between text-xs">
              {['Teacher Voice', 'Speech-to-Text', 'Lesson Notes', 'Language', 'Saved'].map((step, i) => (
                <div key={i} className="flex flex-col items-center gap-1.5 flex-1">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold ${i <= voiceStep ? 'bg-edu-blue text-white' : 'bg-gray-100 text-gray-400'}`}>
                    {i + 1}
                  </div>
                  <span className={`text-center ${i <= voiceStep ? 'text-edu-blue' : 'text-gray-400'}`}>{step}</span>
                </div>
              ))}
            </div>

            {/* Record button */}
            <div className="flex flex-col items-center py-4">
              <button
                onClick={startRecording}
                disabled={isRecording || voiceStep >= 2}
                className={`w-20 h-20 rounded-full flex items-center justify-center transition-all ${isRecording ? 'bg-red-500 animate-pulse-soft' : 'bg-edu-blue hover:bg-blue-700'} disabled:opacity-50 disabled:cursor-not-allowed text-white shadow-lg`}
              >
                {isRecording ? <MicOff className="w-8 h-8" /> : <Mic className="w-8 h-8" />}
              </button>
              <p className="text-xs text-gray-500 mt-3">
                {isRecording ? 'Recording... (Demo simulation)' : voiceStep === 0 ? 'Tap to start recording' : voiceStep >= 2 ? 'Transcription complete' : 'Processing...'}
              </p>
            </div>

            {/* Transcription */}
            {voiceText && (
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1.5 block flex items-center gap-1.5">
                  <Volume2 className="w-3.5 h-3.5" /> Transcribed Text
                </label>
                <div className="bg-gray-50 rounded-xl p-3 text-sm text-navy-800 min-h-[80px] max-h-[120px] overflow-y-auto">
                  {voiceText}
                  {isRecording && <span className="inline-block w-0.5 h-4 bg-edu-blue ml-0.5 animate-pulse" />}
                </div>
              </div>
            )}

            {/* Language selection */}
            {voiceStep >= 2 && (
              <div className="animate-fade-in">
                <label className="text-xs font-medium text-gray-600 mb-1.5 block flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5" /> Select Language
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => setVoiceLang(lang.code)}
                      className={`p-2.5 rounded-xl border-2 text-center transition-all ${voiceLang === lang.code ? 'border-edu-blue bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}
                    >
                      <p className="text-xs font-bold text-navy-800">{lang.flag}</p>
                      <p className="text-xs text-gray-500">{lang.label}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {voiceStep >= 2 && (
              <button onClick={saveVoiceNotes} className="btn-success w-full py-3 animate-fade-in">
                <CheckCircle className="w-4 h-4" /> Save Lesson Notes
              </button>
            )}

            <p className="text-xs text-gray-400 text-center bg-amber-50 rounded-lg p-2">
              Prototype Feature: Speech-to-text is simulated for demo purposes. In production, this would use a real speech processing API.
            </p>
          </div>
        </Modal>
      )}

      {/* View lesson notes */}
      {viewLesson && (
        <Modal onClose={() => setViewLesson(null)} title={`Lesson Notes · ${viewLesson.title}`}>
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
              <StatusBadge variant="blue">{viewLesson.subject}</StatusBadge>
              <StatusBadge variant="gray">{viewLesson.notesLanguage}</StatusBadge>
              <StatusBadge variant="green">Notes Available</StatusBadge>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 text-sm text-navy-800 leading-relaxed">
              {viewLesson.notes}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

function Modal({ children, onClose, title }: { children: React.ReactNode; onClose: () => void; title: string }) {
  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 animate-fade-in" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-edu-lg max-w-lg w-full p-6 animate-slide-up max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-navy-800">{title}</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100"><X className="w-5 h-5 text-gray-500" /></button>
        </div>
        {children}
      </div>
    </div>
  );
}

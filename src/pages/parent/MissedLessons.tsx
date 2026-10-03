import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useStore } from '@/store/useStore';
import { PageHeader, StatusBadge, SectionCard } from '@/components/ui';
import {
  FileText, Download, Eye, X, Globe, BookOpen, Calendar, Volume2, CheckCircle,
} from 'lucide-react';
import type { MissedLesson } from '@/types';

const languages = [
  { code: 'English', label: 'English', flag: 'EN' },
  { code: 'Telugu', label: 'Telugu', flag: 'TE' },
  { code: 'Hindi', label: 'Hindi', flag: 'HI' },
];

// Simple demo translations for the notes
const translations: Record<string, string> = {
  English: 'The human digestive system breaks down food into nutrients. It includes the mouth, esophagus, stomach, small intestine, and large intestine. Each organ plays a specific role in digestion.',
  Telugu: 'మానవ జీర్ణక్రియ వ్యవస్థ ఆహారాన్ని పోషకాలుగా విభజిస్తుంది. ఇందులో నోరు, అన్ననాళం, కడుపు, చిన్న ప్రేగు, పెద్ద ప్రేగు ఉన్నాయి. ప్రతి అవయవం జీర్ణక్రియలో నిర్దిష్ట పాత్ర పోషిస్తుంది.',
  Hindi: 'मानव पाचन तंत्र भोजन को पोषक तत्वों में तोड़ता है। इसमें मुंह, ग्रासनली, पेट, छोटी आंत और बड़ी आंत शामिल हैं। प्रत्येक अंग पाचन में विशिष्ट भूमिका निभाता है।',
};

export default function ParentMissedLessons() {
  const { user } = useAuth();
  const { data } = useStore();
  const child = data.students.find((s) => s.id === user?.childId) || data.students[0];

  const childMissed = data.missedLessons.filter((ml) => ml.studentId === child.id);
  // Also include any missed lessons that are generally available
  const allMissed = childMissed.length > 0 ? childMissed : data.missedLessons.slice(0, 2);

  const [viewing, setViewing] = useState<MissedLesson | null>(null);
  const [lang, setLang] = useState('English');

  const getNotes = (lesson: MissedLesson) => {
    if (!lesson.notes) return 'Lesson notes are being prepared by the teacher.';
    return translations[lang] || lesson.notes;
  };

  return (
    <div className="animate-fade-in pb-16 lg:pb-0">
      <PageHeader title="Missed Lessons" subtitle={`${child.name} · Lessons missed due to absence`} />

      {allMissed.length === 0 ? (
        <div className="card p-12 text-center">
          <CheckCircle className="w-10 h-10 text-edu-green mx-auto mb-3" />
          <p className="text-sm font-medium text-navy-800">No missed lessons!</p>
          <p className="text-xs text-gray-400 mt-1">Your child has attended all lessons.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {allMissed.map((ml) => (
            <div key={ml.id} className="card p-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="flex items-start gap-3 flex-1">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5 text-edu-amber" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-navy-800">{ml.lessonTitle}</h3>
                    <div className="flex flex-wrap gap-3 mt-1 text-xs text-gray-500">
                      <span className="flex items-center gap-1"><BookOpen className="w-3 h-3" /> {ml.subject}</span>
                      <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> Missed: {ml.date}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {ml.status === 'notes-available' ? (
                    <>
                      <StatusBadge variant="green">Notes Available</StatusBadge>
                      <button onClick={() => setViewing(ml)} className="px-3 py-1.5 rounded-lg bg-blue-50 text-edu-blue text-xs font-medium hover:bg-blue-100 flex items-center gap-1.5">
                        <Eye className="w-3.5 h-3.5" /> View Notes
                      </button>
                    </>
                  ) : (
                    <StatusBadge variant="amber">Notes Pending</StatusBadge>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* View notes modal */}
      {viewing && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 animate-fade-in" onClick={() => setViewing(null)}>
          <div className="bg-white rounded-2xl shadow-edu-lg max-w-lg w-full p-6 animate-slide-up max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-navy-800">Lesson Notes</h2>
              <button onClick={() => setViewing(null)} className="p-1.5 rounded-lg hover:bg-gray-100"><X className="w-5 h-5 text-gray-500" /></button>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              <StatusBadge variant="blue">{viewing.subject}</StatusBadge>
              <StatusBadge variant="gray">{viewing.date}</StatusBadge>
            </div>

            {/* Language selector */}
            <label className="text-xs font-medium text-gray-600 mb-1.5 block flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5" /> Select Language
            </label>
            <div className="grid grid-cols-3 gap-2 mb-4">
              {languages.map((l) => (
                <button
                  key={l.code}
                  onClick={() => setLang(l.code)}
                  className={`p-2.5 rounded-xl border-2 text-center transition-all ${lang === l.code ? 'border-edu-blue bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}
                >
                  <p className="text-xs font-bold text-navy-800">{l.flag}</p>
                  <p className="text-xs text-gray-500">{l.label}</p>
                </button>
              ))}
            </div>

            {/* Notes content */}
            <div className="bg-gray-50 rounded-xl p-4 mb-4">
              <div className="flex items-center gap-1.5 mb-2">
                <Volume2 className="w-3.5 h-3.5 text-edu-blue" />
                <span className="text-xs font-medium text-gray-500">Lesson notes in {lang}</span>
              </div>
              <p className="text-sm text-navy-800 leading-relaxed">{getNotes(viewing)}</p>
            </div>

            {/* Download */}
            <button
              onClick={() => {
                const blob = new Blob([getNotes(viewing)], { type: 'text/plain' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `${viewing.lessonTitle.replace(/\s+/g, '_')}_${lang}.txt`;
                a.click();
                URL.revokeObjectURL(url);
              }}
              className="btn-secondary w-full py-3"
            >
              <Download className="w-4 h-4" /> Download Notes
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

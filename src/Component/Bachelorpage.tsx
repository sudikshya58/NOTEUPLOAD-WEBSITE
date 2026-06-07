import { collection, getDocs, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "./firebase";
import { useNavigate } from "react-router-dom";

interface Faculty {
  id: string;
  faculty: string;
  description: string;
}

interface Note {
  id: string;
  faculty?: string;
  semester?: number | string;
  subject?: string;
  title?: string;
}

const SEMESTERS = [1, 2, 3, 4, 5, 6, 7, 8];

const COURSE_COLOR_CYCLE = [
  { active: "bg-blue-600",   text: "text-blue-700",   light: "text-blue-900",   bg: "bg-blue-50",   border: "border-blue-200" },
  { active: "bg-green-600",  text: "text-green-700",  light: "text-green-900",  bg: "bg-green-50",  border: "border-green-200" },
  { active: "bg-amber-600",  text: "text-amber-700",  light: "text-amber-900",  bg: "bg-amber-50",  border: "border-amber-200" },
  { active: "bg-purple-600", text: "text-purple-700", light: "text-purple-900", bg: "bg-purple-50", border: "border-purple-200" },
  { active: "bg-pink-600",   text: "text-pink-700",   light: "text-pink-900",   bg: "bg-pink-50",   border: "border-pink-200" },
  { active: "bg-teal-600",   text: "text-teal-700",   light: "text-teal-900",   bg: "bg-teal-50",   border: "border-teal-200" },
];

const SUBJECT_ICONS: Record<string, string> = {
  math: "📐", mathematics: "📐", physics: "⚡", chemistry: "🧪",
  programming: "💻", database: "🗄️", network: "🌐", english: "📖",
  management: "📊", account: "💰", economics: "📈", science: "🔬",
  default: "📄",
};

function getSubjectIcon(subject: string): string {
  const lower = subject.toLowerCase();
  for (const key of Object.keys(SUBJECT_ICONS)) {
    if (lower.includes(key)) return SUBJECT_ICONS[key];
  }
  return SUBJECT_ICONS.default;
}

const DOT_COLORS = [
  "bg-blue-500", "bg-green-500", "bg-amber-500",
  "bg-purple-500", "bg-pink-500", "bg-teal-500",
];

export const BachelorPage = () => {
  const navigate = useNavigate();

  const [faculties, setFaculties] = useState<Faculty[]>([]);
  const [facultiesLoading, setFacultiesLoading] = useState(true);

  const [activeCourse, setActiveCourse] = useState<Faculty | null>(null);
  const [activeSemester, setActiveSemester] = useState<number | null>(null);

  const [allNotes, setAllNotes] = useState<Note[]>([]);
  const [semesterCounts, setSemesterCounts] = useState<Record<number, number>>({});
  const [subjects, setSubjects] = useState<string[]>([]);
  const [notesLoading, setNotesLoading] = useState(false);

  // Fetch all faculties
  useEffect(() => {
    const fetchFaculties = async () => {
      try {
        const snapshot = await getDocs(collection(db, "Faculty"));
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<Faculty, "id">),
        }));
        setFaculties(data);
        if (data.length > 0) setActiveCourse(data[0]);
      } catch (err) {
        console.error("Error fetching faculties:", err);
      } finally {
        setFacultiesLoading(false);
      }
    };
    fetchFaculties();
  }, []);

  // Fetch notes when course changes
  useEffect(() => {
    if (!activeCourse) return;
    const fetchNotes = async () => {
      setNotesLoading(true);
      setActiveSemester(null);
      setSubjects([]);
      try {
        const q = query(
          collection(db, "NoteUpload"),
          where("faculty", "==", activeCourse.faculty)
        );
        const snapshot = await getDocs(q);
        const notes = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<Note, "id">),
        }));
        setAllNotes(notes);

        const counts: Record<number, number> = {};
        notes.forEach((note) => {
          const sem = Number(note.semester);
          if (!isNaN(sem) && sem >= 1 && sem <= 8) {
            counts[sem] = (counts[sem] || 0) + 1;
          }
        });
        setSemesterCounts(counts);
      } catch (err) {
        console.error("Error fetching notes:", err);
      } finally {
        setNotesLoading(false);
      }
    };
    fetchNotes();
  }, [activeCourse]);

  // Extract unique subjects for selected semester
  useEffect(() => {
    if (activeSemester === null) { setSubjects([]); return; }
    const filtered = allNotes.filter((n) => Number(n.semester) === activeSemester);
    const unique = Array.from(
      new Set(filtered.map((n) => n.subject?.trim()).filter(Boolean) as string[])
    );
    setSubjects(unique);
  }, [activeSemester, allNotes]);

  const activeIndex = faculties.findIndex((f) => f.id === activeCourse?.id);
  const color = COURSE_COLOR_CYCLE[activeIndex % COURSE_COLOR_CYCLE.length] ?? COURSE_COLOR_CYCLE[0];

  return (
    // ✅ NO min-h-screen, NO full-page wrapper — just a section
    <section className="py-12 px-6 lg:px-20 bg-gray-50">

      {/* Section Header */}
      <div className="flex items-baseline justify-between mb-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-blue-500 mb-1">
            📙 Bachelor Level
          </p>
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Bachelor — Quick Access
          </h2>
          <p className="text-gray-400 text-sm mt-1">
            Select your course, then pick your semester
          </p>
        </div>
        <span className="text-sm text-gray-400">
          {notesLoading ? "Loading..." : `${allNotes.length} total notes`}
        </span>
      </div>

      {/* Course Tabs */}
      {facultiesLoading ? (
        <div className="flex gap-2 flex-wrap mb-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-9 w-20 rounded-full bg-gray-200 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="flex flex-wrap gap-2 mb-6">
          {faculties.map((f, index) => {
            const c = COURSE_COLOR_CYCLE[index % COURSE_COLOR_CYCLE.length];
            const isActive = activeCourse?.id === f.id;
            return (
              <button
                key={f.id}
                onClick={() => setActiveCourse(f)}
                className={`
                  px-5 py-2 rounded-full text-sm font-semibold border transition-all duration-150
                  ${isActive
                    ? `${c.active} text-white border-transparent shadow-sm`
                    : `bg-white ${c.text} ${c.border} hover:${c.bg}`
                  }
                `}
              >
                {f.faculty}
              </button>
            );
          })}
        </div>
      )}

      {/* Semester Grid */}
      <div className="mb-6">
        <div className="flex items-baseline justify-between mb-3">
          <h3 className="text-base font-bold text-gray-700">
            Semesters —{" "}
            <span className={color.text}>{activeCourse?.faculty ?? "..."}</span>
          </h3>
        </div>
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
          {SEMESTERS.map((sem) => {
            const count = semesterCounts[sem] || 0;
            const isActive = activeSemester === sem;
            return (
              <button
                key={sem}
                onClick={() => setActiveSemester(isActive ? null : sem)}
                className={`
                  rounded-xl border py-3 text-center transition-all duration-150
                  ${isActive
                    ? `${color.active} text-white border-transparent shadow-sm scale-105`
                    : `bg-white border-gray-100 hover:border-blue-200`
                  }
                `}
              >
                <div className={`text-xl font-extrabold ${isActive ? "text-white" : color.text}`}>
                  {sem}
                </div>
                <div className={`text-xs mt-0.5 ${isActive ? "text-white/70" : "text-gray-400"}`}>
                  Sem
                </div>
                {notesLoading ? (
                  <div className="mt-1.5 h-3 w-8 mx-auto bg-gray-100 rounded animate-pulse" />
                ) : (
                  <div className={`text-xs font-semibold mt-1 ${isActive ? "text-white/80" : color.text}`}>
                    {count > 0 ? `${count} notes` : "—"}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Subject list */}
      {activeSemester !== null && (
        <div>
          <div className="flex items-baseline justify-between mb-3">
            <h3 className="text-base font-bold text-gray-700">
              Subjects —{" "}
              <span className={color.text}>
                {activeCourse?.faculty} Semester {activeSemester}
              </span>
            </h3>
            <span className="text-sm text-gray-400">
              {semesterCounts[activeSemester] || 0} notes
            </span>
          </div>

          {subjects.length === 0 ? (
            <div className="text-center py-10 bg-white rounded-2xl border border-gray-100">
              <div className="text-4xl mb-3">📭</div>
              <p className="text-gray-500 font-medium">No notes yet for this semester.</p>
              <p className="text-gray-400 text-sm mt-1">
                Be the first to upload for {activeCourse?.faculty} Semester {activeSemester}!
              </p>
              <button
                onClick={() => navigate("/upload")}
                className="mt-4 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-5 py-2 rounded-full transition-colors"
              >
                Upload notes →
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {subjects.map((subject, i) => {
                const subjectNoteCount = allNotes.filter(
                  (n) => Number(n.semester) === activeSemester && n.subject?.trim() === subject
                ).length;
                return (
                  <div
                    key={subject}
                    onClick={() =>
                      navigate(
                        `/faculty/${activeCourse?.faculty}/semester/${activeSemester}/subject/${encodeURIComponent(subject)}`
                      )
                    }
                    className="bg-white border border-gray-100 rounded-xl px-4 py-3 flex items-center justify-between cursor-pointer hover:border-blue-200 hover:bg-blue-50 transition-all duration-150 group"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-2.5 h-2.5 rounded-full ${DOT_COLORS[i % DOT_COLORS.length]} flex-shrink-0`} />
                      <div className="text-xl">{getSubjectIcon(subject)}</div>
                      <div>
                        <p className="text-sm font-semibold text-gray-800">{subject}</p>
                        <p className="text-xs text-gray-400">
                          {subjectNoteCount} {subjectNoteCount === 1 ? "note" : "notes"} · PDF
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`text-xs font-semibold ${color.bg} ${color.text} rounded-full px-3 py-1`}>
                        {subjectNoteCount} notes
                      </span>
                      <svg className="w-4 h-4 text-gray-300 group-hover:text-blue-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Hint when no semester selected */}
      {activeSemester === null && !notesLoading && activeCourse && (
        <div className={`rounded-2xl border ${color.border} ${color.bg} px-6 py-8 text-center`}>
          <div className="text-3xl mb-3">☝️</div>
          <p className={`font-semibold text-base ${color.light}`}>
            Pick a semester above to see subjects & notes
          </p>
          <p className="text-gray-400 text-sm mt-1">
            {activeCourse.faculty} has {allNotes.length} notes across all semesters
          </p>
        </div>
      )}

    </section>
  );
};
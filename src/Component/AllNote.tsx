import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "./firebase";
import { useNavigate } from "react-router-dom";

interface Faculty {
  faculty: string;
  description: string;
  id: string;
}

interface Note {
  faculty?: string;
}

// Color theme per card index — cycles through blue, green, amber
const CARD_THEMES = [
  {
    bg: "bg-blue-50",
    border: "border-blue-200",
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
    titleColor: "text-blue-900",
    subColor: "text-blue-600",
    badgeBg: "bg-blue-200",
    badgeText: "text-blue-900",
    btnBg: "bg-blue-600 hover:bg-blue-700",
    emoji: "📘",
  },
  {
    bg: "bg-green-50",
    border: "border-green-200",
    iconBg: "bg-green-100",
    iconColor: "text-green-600",
    titleColor: "text-green-900",
    subColor: "text-green-600",
    badgeBg: "bg-green-200",
    badgeText: "text-green-900",
    btnBg: "bg-green-600 hover:bg-green-700",
    emoji: "📗",
  },
  {
    bg: "bg-amber-50",
    border: "border-amber-200",
    iconBg: "bg-amber-100",
    iconColor: "text-amber-600",
    titleColor: "text-amber-900",
    subColor: "text-amber-600",
    badgeBg: "bg-amber-200",
    badgeText: "text-amber-900",
    btnBg: "bg-amber-600 hover:bg-amber-700",
    emoji: "📙",
  },
  {
    bg: "bg-purple-50",
    border: "border-purple-200",
    iconBg: "bg-purple-100",
    iconColor: "text-purple-600",
    titleColor: "text-purple-900",
    subColor: "text-purple-600",
    badgeBg: "bg-purple-200",
    badgeText: "text-purple-900",
    btnBg: "bg-purple-600 hover:bg-purple-700",
    emoji: "📒",
  },
  {
    bg: "bg-pink-50",
    border: "border-pink-200",
    iconBg: "bg-pink-100",
    iconColor: "text-pink-600",
    titleColor: "text-pink-900",
    subColor: "text-pink-600",
    badgeBg: "bg-pink-200",
    badgeText: "text-pink-900",
    btnBg: "bg-pink-600 hover:bg-pink-700",
    emoji: "📓",
  },
];

const generalTheme = {
  bg: "bg-slate-50",
  border: "border-slate-200",
  iconBg: "bg-slate-100",
  iconColor: "text-slate-600",
  titleColor: "text-slate-900",
  subColor: "text-slate-500",
  badgeBg: "bg-slate-200",
  badgeText: "text-slate-800",
  btnBg: "bg-slate-600 hover:bg-slate-700",
  emoji: "📄",
};

export const AllNote = () => {
  const [faculties, setFaculties] = useState<Faculty[]>([]);
  const [noteCounts, setNoteCounts] = useState<{ [faculty: string]: number }>({});
  const [generalNoteCount, setGeneralNoteCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFaculties = async () => {
      try {
        const facultyCollection = collection(db, "Faculty");
        const snapshot = await getDocs(facultyCollection);
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<Faculty, "id">),
        }));
        setFaculties(data);
      } catch (error) {
        console.error("Error fetching faculty data:", error);
      }
    };
    fetchFaculties();
  }, []);

  useEffect(() => {
    const fetchNoteCounts = async () => {
      try {
        const noteCollection = collection(db, "NoteUpload");
        const snapshot = await getDocs(noteCollection);
        const notes = snapshot.docs.map((doc) => doc.data() as Note);

        const countMap: { [faculty: string]: number } = {};
        let generalCount = 0;

        notes.forEach((note) => {
          if (note.faculty && note.faculty.trim() !== "") {
            countMap[note.faculty] = (countMap[note.faculty] || 0) + 1;
          } else {
            generalCount++;
          }
        });

        setNoteCounts(countMap);
        setGeneralNoteCount(generalCount);
      } catch (error) {
        console.error("Error fetching note counts:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchNoteCounts();
  }, []);

  // Skeleton placeholder card
  const SkeletonCard = () => (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 animate-pulse">
      <div className="w-12 h-12 rounded-xl bg-gray-100 mb-4" />
      <div className="h-5 bg-gray-100 rounded w-2/3 mb-2" />
      <div className="h-3 bg-gray-100 rounded w-full mb-1" />
      <div className="h-3 bg-gray-100 rounded w-4/5 mb-4" />
      <div className="h-8 bg-gray-100 rounded-full w-24" />
    </div>
  );

  return (
    <section className="py-12 px-6 lg:px-20 bg-gray-50 min-h-screen">

      {/* Section header */}
      <div className="flex items-baseline justify-between mb-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-blue-500 mb-1">
            What are you studying?
          </p>
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Browse by level
          </h2>
        </div>
        <span className="text-sm text-gray-400">
          {faculties.length + (generalNoteCount > 0 ? 1 : 0)} categories
        </span>
      </div>

      {/* Cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">

        {loading
          ? Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)
          : faculties.map((item, index) => {
              const theme = CARD_THEMES[index % CARD_THEMES.length];
              const count = noteCounts[item.faculty] || 0;

              return (
                <div
                  key={item.id}
                  className={`
                    group relative rounded-2xl border ${theme.border} ${theme.bg}
                    p-6 cursor-pointer transition-all duration-200
                    hover:-translate-y-1 hover:shadow-lg
                  `}
                  onClick={() => navigate(`/faculty/${item.faculty}/notes/${item.id}`)}
                >
                  {/* Emoji icon */}
                  <div className={`w-12 h-12 rounded-xl ${theme.iconBg} flex items-center justify-center text-2xl mb-4`}>
                    {theme.emoji}
                  </div>

                  {/* Title */}
                  <h3 className={`text-lg font-extrabold ${theme.titleColor} mb-1 tracking-tight`}>
                    {item.faculty}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-gray-500 leading-relaxed mb-4 line-clamp-2">
                    {item.description
                      ? item.description.substring(0, 80) + (item.description.length > 80 ? "..." : "")
                      : "Study notes and resources"}
                  </p>

                  {/* Note count badge */}
                  <span className={`inline-block text-xs font-semibold ${theme.badgeBg} ${theme.badgeText} rounded-full px-3 py-1 mb-4`}>
                    {count} {count === 1 ? "note" : "notes"} available
                  </span>

                  {/* CTA Button */}
                  <div className="mt-2">
                    <button
                      className={`
                        w-full ${theme.btnBg} text-white text-sm font-semibold
                        rounded-xl py-2.5 px-4 transition-colors duration-150
                        flex items-center justify-center gap-2
                      `}
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/faculty/${item.faculty}/notes/${item.id}`);
                      }}
                    >
                      View all notes
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>

                  {/* Hover arrow */}
                  <div className={`
                    absolute top-5 right-5 opacity-0 group-hover:opacity-30
                    transition-opacity duration-200 ${theme.titleColor} text-xl
                  `}>
                    →
                  </div>
                </div>
              );
            })}

        {/* General Notes Card */}
        {!loading && generalNoteCount > 0 && (
          <div
            className={`
              group relative rounded-2xl border ${generalTheme.border} ${generalTheme.bg}
              p-6 cursor-pointer transition-all duration-200
              hover:-translate-y-1 hover:shadow-lg
            `}
            onClick={() => navigate(`/faculty/general/notes`)}
          >
            <div className={`w-12 h-12 rounded-xl ${generalTheme.iconBg} flex items-center justify-center text-2xl mb-4`}>
              {generalTheme.emoji}
            </div>

            <h3 className={`text-lg font-extrabold ${generalTheme.titleColor} mb-1 tracking-tight`}>
              General Notes
            </h3>

            <p className="text-sm text-gray-500 leading-relaxed mb-4">
              Notes not associated with any specific faculty or course.
            </p>

            <span className={`inline-block text-xs font-semibold ${generalTheme.badgeBg} ${generalTheme.badgeText} rounded-full px-3 py-1 mb-4`}>
              {generalNoteCount} {generalNoteCount === 1 ? "note" : "notes"} available
            </span>

            <div className="mt-2">
              <button
                className={`
                  w-full ${generalTheme.btnBg} text-white text-sm font-semibold
                  rounded-xl py-2.5 px-4 transition-colors duration-150
                  flex items-center justify-center gap-2
                `}
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/faculty/general/notes`);
                }}
              >
                View general notes
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        )}

      </div>

      {/* Empty state */}
      {!loading && faculties.length === 0 && generalNoteCount === 0 && (
        <div className="text-center py-20">
          <div className="text-5xl mb-4">📭</div>
          <p className="text-gray-500 text-lg font-medium">No faculties found yet.</p>
          <p className="text-gray-400 text-sm mt-1">Be the first to upload a note!</p>
        </div>
      )}

    </section>
  );
};
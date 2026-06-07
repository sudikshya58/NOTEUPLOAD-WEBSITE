import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { db } from "./firebase";
import { collection, getDocs } from "firebase/firestore";
import { Footer } from "./Footer";
import { Header } from "../Component/Header";

interface FacultyNoteData {
  id: string;
  faculty: string;
  subject: string;
  semester: string;
  category?: string;
  Files?: string;
}

const categoryConfig: Record<string, { color: string; bg: string; icon: string }> = {
  "Note":       { color: "#1a56db", bg: "#eff6ff", icon: "📄" },
  "Question":   { color: "#057a55", bg: "#f0fdf4", icon: "❓" },
  "Report":     { color: "#7e3af2", bg: "#f5f3ff", icon: "📊" },
  "Assignment": { color: "#c27803", bg: "#fffbeb", icon: "📝" },
  "default":    { color: "#374151", bg: "#f9fafb", icon: "📁" },
};

const semesterList = ["1st","2nd","3rd","4th","5th","6th","7th","8th"];

function getCategoryConfig(cat?: string) {
  if (!cat) return categoryConfig["default"];
  const match = Object.keys(categoryConfig).find(k => cat.toLowerCase().includes(k.toLowerCase()));
  return match ? categoryConfig[match] : categoryConfig["default"];
}

export const FacultyNote = () => {
  const { faculty } = useParams<{ faculty: string }>();
  const [facultyData, setFacultyData] = useState<FacultyNoteData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSemester, setSelectedSemester] = useState("All");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFaculty = async () => {
      try {
        const snapshot = await getDocs(collection(db, "NoteUpload"));
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as FacultyNoteData[];
        setFacultyData(data.filter(item => item.faculty === faculty));
      } catch {
        setError("Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };
    fetchFaculty();
  }, [faculty]);

  const uniqueCategories = Array.from(new Set(facultyData.map(n => n.category))).filter(Boolean) as string[];

  const filteredNotes = facultyData.filter(item => {
    const semMatch = selectedSemester === "All" || item.semester === selectedSemester;
    const catMatch = selectedCategory === "All" || item.category === selectedCategory;
    const searchMatch = !search || item.subject.toLowerCase().includes(search.toLowerCase());
    return semMatch && catMatch && searchMatch;
  });

  const countBySemester = (sem: string) =>
    facultyData.filter(n => n.semester === sem).length;

  return (
    <>
      <Header />

      {/* Hero Banner */}
      <div style={{
        background: "linear-gradient(135deg, #0f172a 0%, #1e3a5f 60%, #0f172a 100%)",
        padding: "3.5rem 1.5rem 0",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Decorative circles */}
        <div style={{ position:"absolute", top:-60, right:-60, width:260, height:260, borderRadius:"50%", background:"rgba(255,255,255,0.03)", pointerEvents:"none" }} />
        <div style={{ position:"absolute", bottom:-40, left:80, width:180, height:180, borderRadius:"50%", background:"rgba(255,255,255,0.03)", pointerEvents:"none" }} />

        <div style={{ maxWidth:1100, margin:"0 auto" }}>
          {/* Breadcrumb */}
          <div style={{ fontSize:13, color:"rgba(255,255,255,0.5)", marginBottom:"1rem", display:"flex", alignItems:"center", gap:6 }}>
            <span style={{ cursor:"pointer", color:"rgba(255,255,255,0.7)" }} onClick={() => navigate("/")}>Home</span>
            <span>›</span>
            <span style={{ color:"#fff" }}>{faculty}</span>
          </div>

          <div style={{ display:"flex", alignItems:"flex-end", justifyContent:"space-between", flexWrap:"wrap", gap:"1rem" }}>
            <div>
              <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:"0.75rem" }}>
                <div style={{
                  width:52, height:52, borderRadius:14,
                  background:"rgba(255,255,255,0.1)",
                  border:"1px solid rgba(255,255,255,0.15)",
                  display:"flex", alignItems:"center", justifyContent:"center",
                  fontSize:24,
                }}>📚</div>
                <div>
                  <h1 style={{ color:"#fff", fontSize:"clamp(22px,4vw,32px)", fontWeight:700, margin:0, letterSpacing:-0.5 }}>
                    {faculty}
                  </h1>
                  <p style={{ color:"rgba(255,255,255,0.5)", fontSize:13, margin:0 }}>Tribhuvan University</p>
                </div>
              </div>
              <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                {["Notes","Questions","Reports","Assignments"].map(t => (
                  <span key={t} style={{
                    fontSize:11, padding:"3px 10px", borderRadius:20,
                    background:"rgba(255,255,255,0.08)",
                    border:"1px solid rgba(255,255,255,0.12)",
                    color:"rgba(255,255,255,0.7)",
                  }}>{t}</span>
                ))}
              </div>
            </div>
            <div style={{
              background:"rgba(255,255,255,0.06)",
              border:"1px solid rgba(255,255,255,0.1)",
              borderRadius:12, padding:"12px 20px",
              color:"#fff", textAlign:"center",
            }}>
              <div style={{ fontSize:28, fontWeight:700 }}>{facultyData.length}</div>
              <div style={{ fontSize:12, color:"rgba(255,255,255,0.5)" }}>Total materials</div>
            </div>
          </div>

          {/* Semester tabs */}
          <div style={{
            display:"flex", gap:4, marginTop:"2rem", overflowX:"auto",
            paddingBottom:0, WebkitOverflowScrolling:"touch",
          }}>
            {["All", ...semesterList].map(sem => {
              const isActive = selectedSemester === sem;
              const count = sem === "All" ? facultyData.length : countBySemester(sem);
              return (
                <button
                  key={sem}
                  onClick={() => setSelectedSemester(sem)}
                  style={{
                    padding:"10px 18px",
                    border:"none",
                    background: isActive ? "#fff" : "transparent",
                    color: isActive ? "#0f172a" : "rgba(255,255,255,0.55)",
                    fontWeight: isActive ? 600 : 400,
                    fontSize:13,
                    borderRadius:"10px 10px 0 0",
                    cursor:"pointer",
                    whiteSpace:"nowrap",
                    transition:"all 0.15s",
                    display:"flex", alignItems:"center", gap:6,
                  }}
                >
                  {sem === "All" ? "All" : `Sem ${sem.replace(/[a-z]/g,"")}`}
                  {count > 0 && (
                    <span style={{
                      fontSize:10, padding:"1px 6px", borderRadius:10,
                      background: isActive ? "#e5e7eb" : "rgba(255,255,255,0.12)",
                      color: isActive ? "#374151" : "rgba(255,255,255,0.6)",
                    }}>{count}</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content area */}
      <div style={{ background:"#f8fafc", minHeight:"60vh", paddingBottom:"3rem" }}>
        <div style={{ maxWidth:1100, margin:"0 auto", padding:"1.5rem 1.5rem 0" }}>

          {/* Filter bar */}
          <div style={{
            display:"flex", gap:10, alignItems:"center", flexWrap:"wrap",
            marginBottom:"1.5rem",
          }}>
            {/* Search */}
            <div style={{ position:"relative", flex:1, minWidth:180 }}>
              <span style={{ position:"absolute", left:12, top:"50%", transform:"translateY(-50%)", fontSize:15, color:"#9ca3af" }}>🔍</span>
              <input
                type="text"
                placeholder="Search by subject..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{
                  width:"100%", padding:"9px 12px 9px 36px",
                  border:"1.5px solid #e5e7eb", borderRadius:10,
                  fontSize:13, background:"#fff", color:"#111",
                  outline:"none", boxSizing:"border-box",
                }}
              />
            </div>

            {/* Category filters */}
            <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
              {["All", ...uniqueCategories].map(cat => {
                const cfg = cat === "All" ? null : getCategoryConfig(cat);
                const isActive = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    style={{
                      padding:"7px 14px", borderRadius:8, fontSize:13,
                      border: isActive ? `1.5px solid ${cfg?.color ?? "#374151"}` : "1.5px solid #e5e7eb",
                      background: isActive ? (cfg?.bg ?? "#f3f4f6") : "#fff",
                      color: isActive ? (cfg?.color ?? "#374151") : "#6b7280",
                      fontWeight: isActive ? 600 : 400,
                      cursor:"pointer", transition:"all 0.15s",
                      display:"flex", alignItems:"center", gap:5,
                    }}
                  >
                    {cfg && <span style={{ fontSize:13 }}>{cfg.icon}</span>}
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Results count */}
          {!loading && !error && (
            <p style={{ fontSize:13, color:"#9ca3af", marginBottom:"1rem" }}>
              Showing <strong style={{ color:"#374151" }}>{filteredNotes.length}</strong> result{filteredNotes.length !== 1 ? "s" : ""}
              {selectedSemester !== "All" && ` · ${selectedSemester} Semester`}
              {selectedCategory !== "All" && ` · ${selectedCategory}`}
            </p>
          )}

          {/* Cards */}
          {loading ? (
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))", gap:16 }}>
              {[...Array(6)].map((_,i) => (
                <div key={i} style={{
                  background:"#fff", borderRadius:14, height:220,
                  border:"1.5px solid #e5e7eb",
                  animation:"pulse 1.5s ease-in-out infinite",
                  animationDelay:`${i*0.1}s`,
                  opacity:0.6,
                }} />
              ))}
            </div>
          ) : error ? (
            <div style={{ textAlign:"center", padding:"4rem 0", color:"#ef4444" }}>
              <div style={{ fontSize:40, marginBottom:"0.5rem" }}>⚠️</div>
              <p style={{ fontWeight:600 }}>{error}</p>
            </div>
          ) : filteredNotes.length === 0 ? (
            <div style={{ textAlign:"center", padding:"5rem 0", color:"#9ca3af" }}>
              <div style={{ fontSize:48, marginBottom:"1rem" }}>📭</div>
              <p style={{ fontSize:16, fontWeight:600, color:"#374151" }}>No materials found</p>
              <p style={{ fontSize:13, marginTop:4 }}>Try changing semester or category filter</p>
            </div>
          ) : (
            <div style={{
              display:"grid",
              gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))",
              gap:16,
            }}>
              {filteredNotes.map((item, idx) => {
                const cfg = getCategoryConfig(item.category);
                return (
                  <div
                    key={item.id}
                    style={{
                      background:"#fff",
                      border:"1.5px solid #e5e7eb",
                      borderRadius:14,
                      overflow:"hidden",
                      transition:"transform 0.18s, border-color 0.18s, box-shadow 0.18s",
                      animation:`fadeUp 0.3s ease both`,
                      animationDelay:`${idx * 0.04}s`,
                    }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLDivElement).style.transform = "translateY(-3px)";
                      (e.currentTarget as HTMLDivElement).style.borderColor = cfg.color;
                      (e.currentTarget as HTMLDivElement).style.boxShadow = `0 8px 24px rgba(0,0,0,0.08)`;
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
                      (e.currentTarget as HTMLDivElement).style.borderColor = "#e5e7eb";
                      (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
                    }}
                  >
                    {/* Card top accent */}
                    <div style={{ height:4, background: cfg.color }} />

                    {/* Thumbnail */}
                    <div style={{
                      background: cfg.bg,
                      height:110,
                      display:"flex", alignItems:"center", justifyContent:"center",
                      fontSize:48,
                      position:"relative",
                    }}>
                      {cfg.icon}
                      {item.category && (
                        <span style={{
                          position:"absolute", top:10, right:10,
                          fontSize:10, padding:"3px 8px", borderRadius:20,
                          background: cfg.color, color:"#fff",
                          fontWeight:600, letterSpacing:0.3,
                        }}>{item.category}</span>
                      )}
                    </div>

                    {/* Card body */}
                    <div style={{ padding:"14px 14px 12px" }}>
                      <h3 style={{
                        fontSize:14, fontWeight:600, color:"#111827",
                        margin:"0 0 4px", lineHeight:1.4,
                        display:"-webkit-box", WebkitLineClamp:2,
                        WebkitBoxOrient:"vertical", overflow:"hidden",
                      }}>{item.subject}</h3>
                      <p style={{ fontSize:12, color:"#9ca3af", margin:"0 0 12px" }}>
                        {item.semester} Semester
                      </p>

                      {/* Actions */}
                      <div style={{ display:"flex", gap:8 }}>
                        <button
                          onClick={() => navigate(`/pdf/${item.id}`)}
                          style={{
                            flex:1, padding:"7px 0", fontSize:12, fontWeight:600,
                            borderRadius:8, cursor:"pointer",
                            border:`1.5px solid ${cfg.color}`,
                            background: cfg.bg, color: cfg.color,
                            display:"flex", alignItems:"center", justifyContent:"center", gap:5,
                            transition:"all 0.15s",
                          }}
                          onMouseEnter={e => {
                            (e.currentTarget as HTMLButtonElement).style.background = cfg.color;
                            (e.currentTarget as HTMLButtonElement).style.color = "#fff";
                          }}
                          onMouseLeave={e => {
                            (e.currentTarget as HTMLButtonElement).style.background = cfg.bg;
                            (e.currentTarget as HTMLButtonElement).style.color = cfg.color;
                          }}
                        >
                          👁 View
                        </button>
                        {item.Files && (
                          <a
                            href={item.Files}
                            download
                            target="_blank"
                            rel="noreferrer"
                            style={{
                              flex:1, padding:"7px 0", fontSize:12, fontWeight:600,
                              borderRadius:8, cursor:"pointer",
                              border:"1.5px solid #e5e7eb",
                              background:"#fff", color:"#374151",
                              display:"flex", alignItems:"center", justifyContent:"center", gap:5,
                              textDecoration:"none", transition:"all 0.15s",
                            }}
                            onMouseEnter={e => {
                              (e.currentTarget as HTMLAnchorElement).style.background = "#f3f4f6";
                              (e.currentTarget as HTMLAnchorElement).style.borderColor = "#d1d5db";
                            }}
                            onMouseLeave={e => {
                              (e.currentTarget as HTMLAnchorElement).style.background = "#fff";
                              (e.currentTarget as HTMLAnchorElement).style.borderColor = "#e5e7eb";
                            }}
                          >
                            ⬇ Save
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes fadeUp {
          from { opacity:0; transform:translateY(16px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes pulse {
          0%,100% { opacity:0.6; }
          50%      { opacity:0.3; }
        }
      `}</style>

      <Footer />
    </>
  );
};
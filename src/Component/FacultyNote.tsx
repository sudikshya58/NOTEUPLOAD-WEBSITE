import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { db } from "./firebase";
import banner from "../banner.jpg";
import { collection, getDocs } from "firebase/firestore";
import { AiOutlineDownload, AiOutlineEye } from "react-icons/ai";
import { Footer } from "./Footer";
import { Header } from "../Component/Header";

// Faculty note data type
interface FacultyNoteData {
  id: string;
  faculty: string;
  subject: string;
  semester: string;
  category?: string; // e.g., "Final Report", "Lecture Note"
  Files?: string;    // optional if you want to use download
}

export const FacultyNote = () => {
  const { faculty } = useParams<{ faculty: string }>();
  const [facultyData, setFacultyData] = useState<FacultyNoteData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSemester, setSelectedSemester] = useState<string>("All");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchFaculty = async () => {
      try {
        const facultyCollection = collection(db, "NoteUpload");
        const snapshot = await getDocs(facultyCollection);
        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })) as FacultyNoteData[];

        const filteredData = data.filter(item => item.faculty === faculty);
        setFacultyData(filteredData);
      } catch (error) {
        setError("Failed to fetch data");
        console.error("Error fetching faculty data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFaculty();
  }, [faculty]);

  const filteredNotes = facultyData.filter((item) => {
    const semesterMatch = selectedSemester === "All" || item.semester === selectedSemester;
    const categoryMatch = selectedCategory === "All" || item.category === selectedCategory;
    return semesterMatch && categoryMatch;
  });

  const uniqueCategories = Array.from(new Set(facultyData.map(note => note.category))).filter(Boolean);

  return (
    <>
      <Header />
      <img src={banner} alt="Banner" className="w-full object-cover h-96" />

      {/* Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mx-6  lg:mx-20 mt-10 gap-4">
        <select
          value={selectedSemester}
          onChange={(e) => setSelectedSemester(e.target.value)}
          className="border border-gray-400 p-2 rounded w-full sm:w-auto"
        >
          <option value="All">All Semesters</option>
          {["1st","2nd","3rd","4th","5th","6th","7th","8th"].map((sem) => (
            <option key={sem} value={sem}>{sem} Semester</option>
          ))}
        </select>

        <div className="flex gap-2 flex-wrap justify-center  sm:justify-start">
          <button
            onClick={() => setSelectedCategory("All")}
            className={`px-4 py-1 rounded border ${selectedCategory === "All" ? "bg-blue-500 text-white" : "bg-gray-100"}`}
          >
            All Categories
          </button>
          {uniqueCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat!)}
              className={`px-4 py-1 rounded border ${selectedCategory === cat ? "bg-blue-500 text-white" : "bg-gray-100"}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Notes List */}
      <div className="mt-10 mx-6 lg:mx-20 flex gap-10 flex-wrap justify-center">
        {loading ? (
          <div className="h-[30vh] flex items-center justify-center text-[20px] font-bold w-full">
            Loading...
          </div>
        ) : error ? (
          <div className="h-[30vh] flex items-center justify-center text-[20px] font-bold w-full">
            {error}
          </div>
        ) : filteredNotes.length > 0 ? (
          filteredNotes.map((item) => (
            <div className="w-72 shadow-lg rounded-lg overflow-hidden bg-white" key={item.id}>
              <img
                src="https://img.icons8.com/fluency/96/pdf.png"
                alt="Note thumbnail"
                className="h-40 w-full object-contain bg-gray-50 p-4"
              />
              <div className="p-4">
                <h2 className="font-semibold text-lg text-black">{item.subject}</h2>
                <p className="text-gray-600 text-sm mb-1">{item.semester} Semester</p>
                {item.category && (
                  <p className="text-sm text-white px-2 py-1 bg-blue-400 inline-block rounded">
                    {item.category}
                  </p>
                )}
                <div className="flex justify-between mt-4">
                  <button
                    className="flex items-center gap-1 text-black font-medium"
                    onClick={() => navigate(`/pdf/${item.id}`)}
                  >
                    <AiOutlineEye size={20} /> View
                  </button>
                  {item.Files && (
                    <a
                      href={item.Files}
                      download
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1 text-black font-medium"
                    >
                      <AiOutlineDownload size={20} /> Download
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="h-[30vh] flex items-center justify-center text-[20px] font-bold w-full">
            No notes available for selected filters.
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

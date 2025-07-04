import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "./firebase";
import { useNavigate } from "react-router-dom";

// Define the type for faculty
interface Faculty {
  faculty: string;
  description: string;
  id: string;
}

// Optional: for note count per faculty
interface Note {
  faculty?: string;  // make optional to detect missing faculty
}

export const AllNote = () => {
  const [faculties, setFaculties] = useState<Faculty[]>([]);
  const [noteCounts, setNoteCounts] = useState<{ [faculty: string]: number }>({});
  const [generalNoteCount, setGeneralNoteCount] = useState<number>(0);
  const navigate = useNavigate();

  // Fetch Faculty data
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

  // Fetch Note counts grouped by faculty + general note count
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
            generalCount++;  // no faculty assigned
          }
        });

        setNoteCounts(countMap);
        setGeneralNoteCount(generalCount);
      } catch (error) {
        console.error("Error fetching note counts:", error);
      }
    };

    fetchNoteCounts();
  }, []);

  return (
    <div className="mt-10 px-6 lg:px-20">
      <h1 className="font-bold text-3xl mb-10 text-center">All Course Faculties</h1>
      <div className="flex flex-wrap gap-10 justify-center">
        {faculties.map((item) => (
          <div
            key={item.id}
            className="flex flex-col sm:flex-row border border-gray-100 w-full sm:w-[22rem] shadow-xl rounded-md overflow-hidden bg-white"
          >
            <img
              src="https://img.freepik.com/free-vector/hand-drawn-flat-design-stack-books-illustration_23-2149341898.jpg"
              alt="Books"
              className="w-full sm:w-28 h-28 sm:h-full object-cover"
            />
            <div className="p-4 flex-1">
              <h2 className="font-bold text-blue-600 text-xl mb-2">{item.faculty}</h2>
              <p className="text-gray-700 text-sm mb-1">
                {item.description ? `${item.description.substring(0, 70)}...` : ""}
              </p>
              <p className="text-sm text-gray-500 mb-2">{noteCounts[item.faculty] || 0} notes available</p>
              <button
                className="w-[70%] mt-4 rounded-sm p-2 cursor-pointer text-white font-bold mr-3 bg-blue-300"
                onClick={() => navigate(`/faculty/${item.faculty}/notes/${item.id}`)}
              >
                View All Notes
              </button>
            </div>
          </div>
        ))}

        {/* General Notes Card */}
        {generalNoteCount > 0 && (
          <div
            key="general-notes"
            className="flex flex-col sm:flex-row border border-gray-100 w-full sm:w-[22rem] shadow-xl rounded-md overflow-hidden bg-white"
          >
            <img
              src="https://img.icons8.com/ios-filled/100/000000/notes.png"
              alt="General Notes"
              className="w-full sm:w-28 h-28 sm:h-full object-contain bg-gray-50 p-4"
            />
            <div className="p-4 flex-1">
              <h2 className="font-bold text-blue-600 text-xl mb-2">General Notes</h2>
              <p className="text-gray-700 text-sm mb-1">Notes not associated with any faculty.</p>
              <p className="text-sm text-gray-500 mb-2">{generalNoteCount} notes available</p>
              <button
                className="w-[70%] mt-4 rounded-sm p-2 cursor-pointer text-white font-bold mr-3 bg-blue-300"
                onClick={() => navigate(`/faculty/general/notes`)}
              >
                View General Notes
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

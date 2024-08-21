import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "./firebase";
import { Link} from "react-router-dom";


// Define a type for the note data
interface NoteData {
  id: string;
  subject: string;
  faculty: string;
  semester: string;
  // Add other fields if needed
}

export const NoteDesign = () => {
  const [notes, setNotes] = useState<NoteData[]>([]); // Typed state

  useEffect(() => {
    const fetchNotesData = async () => {
      try {
        const notesCollection = collection(db, "NoteUpload");
        const snapshot = await getDocs(notesCollection);
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as NoteData[];
        setNotes(data);
        console.log(data, "note");
      } catch (error) {
        console.error("Error fetching notes:", error);
      }
    };

    fetchNotesData();
  }, []);

  return (
    <div className="mt-28 mb-20">
      <div className="flex flex-wrap">
        {notes.map(item => (
          <Link to={`/pdf/${item.id}`} key={item.id}>
            <div className="mx-6 mt-10">
              <div className="w-72 bg-white border border-gray-100 border-opacity-25 rounded shadow-md">
                {/* Replace Note.File with relevant content if needed */}
                {/* <div className="">{Note && <PDFViewer src={Note.Files} />}</div> */}

                <div className="p-4">
                  <h1 className="font-medium text-[18px]">Subject Topic</h1>
                  <div className="flex justify-between">
                    <h1 className="font-bold">{item.subject}</h1>
                    <p>
                      {item.faculty} ({item.semester}) sem
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

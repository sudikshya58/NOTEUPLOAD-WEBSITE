import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../Component/firebase";
import { Link, useNavigate } from "react-router-dom";

export const NoteDesign = () => {
  const [Note, setNote] = useState([]);
  useEffect(() => {
    const fetchNotesdata = async () => {
      const NotesCollection = collection(db, "NoteUpload");
      const snapshot = await getDocs(NotesCollection);
      const Data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setNote(Data);
      console.log(Data, "note");
    };
    fetchNotesdata();
  }, []);
  const navigate = useNavigate();
  console.log(Note);

  return (
    <div className=" mt-28 mb-20  ">
      <div className="flex flex-wrap ">
        {Note.map((item, i) => (
          <Link to={`/pdf/${item.id}`} key={item.id}>
            <div className="mx-6  mt-10">
              <div
                className="w-72  bg-white border border-gray-100 border-opacity-25 rounded shadow-md"
                key={i}
              >
                {Note.File}
                {/* <div className="">{Note && <PDFViewer src={Note.Files} />}</div> */}

                <div className="p-4">
                  <h1 className="font-mediium text-[18px]">Subject Topic</h1>
                  <div className="flex justify-between ">
                    <h1 className="font-bold">{item.subject}</h1>
                    <p>
                      {item.faculty} ({item.semester})sem
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

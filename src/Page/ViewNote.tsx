import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from "../Component/firebase.ts";
import React, { useEffect, useState } from 'react';
import { AiOutlineDelete } from 'react-icons/ai';

interface Note {
  id: string;
  faculty: string;
  subject: string;
  semester: string;
  Files: string;
}

export const ViewNote: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [modal, setModal] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState<string | null>(null);

  useEffect(() => {
    const fetchNotesData = async () => {
      const notesCollection = collection(db, "NoteUpload");
      const snapshot = await getDocs(notesCollection);
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Note[];
      setNotes(data);
    };
    fetchNotesData();
  }, []);

  const handleDelete = async () => {
    if (!noteToDelete) return;
    try {
      const noteDoc = doc(db, "NoteUpload", noteToDelete);
      await deleteDoc(noteDoc);
      setNotes((prevNotes) => prevNotes.filter((note) => note.id !== noteToDelete));
      setModal(false);
      setNoteToDelete(null);
      console.log(`Document with ID ${noteToDelete} deleted successfully.`);
    } catch (error) {
      console.error("Error deleting document: ", error);
    }
  };

  const openModal = (id: string) => {
    setNoteToDelete(id);
    setModal(true);
  };

  const closeModal = () => {
    setModal(false);
    setNoteToDelete(null);
  };

  const ttables = `border px-4 py-2 text-center`;

  return (
    <>
      <div className='flex justify-center p-4'>
        <table className='table-auto border-collapse w-full'>
          <thead className='bg-gray-200'>
            <tr>
              <th className={ttables}>Faculty</th>
              <th className={ttables}>Subject</th>
              <th className={ttables}>Semester</th>
              <th className={ttables}>Files</th>
              <th className={ttables}>Action</th>
            </tr>
          </thead>
          <tbody>
            {notes.map((item) => (
              <tr key={item.id} className='odd:bg-white even:bg-gray-100'>
                <td className={ttables}>{item.faculty}</td>
                <td className={ttables}>{item.subject}</td>
                <td className={ttables}>{item.semester}</td>
                <td className={ttables}>
                  <a href={item.Files} target="_blank" rel="noopener noreferrer">
                    View File
                  </a>
                </td>
                <td className={ttables}>
                  <button onClick={() => openModal(item.id)}>
                    <AiOutlineDelete />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {modal &&
        <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50'>
          <div className='bg-white shadow-xl w-96 p-10'>
            <h1 className='font-bold text-center mb-10'>Do you want to delete this note?</h1>
            <div className='flex gap-10 justify-center'>
              <button className='bg-red-600 rounded w-40 p-3 font-bold text-white' onClick={closeModal}>Cancel</button>
              <button className='bg-blue-600 rounded w-40 p-3 font-bold text-white' onClick={handleDelete}>Yes</button>
            </div>
          </div>
        </div>
      }
    </>
  );
};

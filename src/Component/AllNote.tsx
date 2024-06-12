import { collection, getDocs } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { db } from "../Component/firebase";
import { useNavigate } from 'react-router-dom';

export const AllNote = () => {
  const [Note, setNote] = useState([]);
  useEffect(() => {
    const fetchNotesdata = async () => {
      const NotesCollection = collection(db, "Faculty");
      const snapshot = await getDocs(NotesCollection);
      const Data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setNote(Data);
      console.log(Data, "note");
    };
    fetchNotesdata();
  }, []);
  const navigate=useNavigate();
  return (
    <div className='mt-20'>
    <div>
      <h1 className='font-bold text-3xl mb-20'>All Courses Notes</h1>
      <div className='flex flex-wrap  gap-10' >
        {Note.map((item,index)=>(
          <div key={index} className='flex gap-4  cursor-pointer  border border-gray-100 w-96 h-40 shadow-xl' onClick={()=>navigate(`/faculty/${item.faculty}/notes/${item.id}`)}>
            <img src="https://img.freepik.com/free-vector/hand-drawn-flat-design-stack-books-illustration_23-2149341898.jpg" alt="" className='w-40' />
            <div className='p-1  mt-2 w-full'>
              <h1 className='font-bold w-48 text-blue-600 mb-2 '>{item.faculty}</h1>
              <p className='w-48 text-[16px] font-medium'>{item.description ? `${item.description.substring(0, 80)}...` : ''}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
  
  )
}

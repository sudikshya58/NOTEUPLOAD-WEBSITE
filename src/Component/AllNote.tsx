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
    <div className='mt-10'>
    <div>
      <h1 className='font-bold text-3xl mb-10'>All Courses Notes</h1>
      <div className='flex flex-wrap  gap-10' >
        {Note.map((item,index)=>(
          <div key={index} className='flex gap-4  flex-col sm:flex-row border border-gray-100 w-[27rem]  sm:w-[20rem] sm:h-52 shadow-xl'>
            <img src="https://img.freepik.com/free-vector/hand-drawn-flat-design-stack-books-illustration_23-2149341898.jpg" alt="" className='md:w-28 w-full h-20 sm:h-full object-cover' />
            <div className='p-1  mt-2 sm:w-60 w-full'>
              <h1 className='font-bold w-48  text-blue-600 mb-2 '>{item.faculty}</h1>
              <p className='md:w-48  w-full text-[16px]  font-medium overflow-hidden'>{item.description ? `${item.description.substring(0, 70)}...` : ''}</p>
              <button className='w-[70%] mt-4 rounded-sm p-2 cursor-pointer text-white font-bold mr-3 bg-blue-300' onClick={()=>navigate(`/faculty/${item.faculty}/notes/${item.id}`)}>View All Note</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
  
  )
}

import { collection, getDocs } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { db } from "../Component/firebase";
import { useNavigate } from 'react-router-dom';

interface AdminData {
    useremail: string;
    username: string;
    password:string;
    // Add other fields if needed
  }

export const Password = () => {
    const [data, setData] = useState<AdminData | null>(null);
    const navigate=useNavigate();
    const [form,setForm]=useState({
        password:""
    });
    useEffect(() => {
        const fetchadminDetail = async () => {
          const adminDetails = collection(db, "adminlogin");
          const snapshot = await getDocs(adminDetails);
          const adminData = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          console.log(adminData[0]);
          setData(adminData[0]);
        };
        fetchadminDetail();
      }, []);
      const handleSubmit = () => {
        // Check if data is available
        if (data) {
          const matchpw = data.password === form.password;
          if (matchpw) {
            navigate("/");
          } else {
            alert("Incorrect password"); // or handle the error accordingly
          }
        } else {
          console.log("Data is not available yet"); // or handle the case when data is not available yet
        }
      };
      
 
  return (
    <form onSubmit={handleSubmit} className='flex flex-wrap flex-col bg-white p-10 shadow-lg w-[30%] '>
     
          <div  className='flex justify-center items-center p-4 '>
            <label className='bg-red-300'>password</label>
            <input
              type="password"
              className='w-60 p-3 border outline-none focus:border-blue-300 border-gray-200'
              placeholder="password"
             
              onChange={(e) =>setForm({...form,password:e.target.value}) }
            />
          </div>
        ))
        <div className='flex justify-center items-center'>
          <button type="submit" className='font-bold mt-10 bg-blue-400 w-60 text-[20px] p-3 rounded-xl'>Submit</button>
        </div>
      </form>
  )
}

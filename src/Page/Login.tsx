import React, { FormEvent, useEffect, useState } from 'react';
import { Logins } from "../Page/index.js";
import { db } from "../Component/firebase";
import { collection, getDocs } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

interface FormState {
  [key: string]: string;
}

interface Login {
  username: string;
  formname: string;
  type: string;
}

interface AdminData {
  useremail: string;
  username: string;
  // Add other fields if needed
}

export const Login = () => {
  const [form, setForm] = useState<FormState>({
    useremail: "",
    username: ""
  });
  const [data, setData] = useState<AdminData | null>(null);

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
  const navigate=useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [fieldName]: value,
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!data || form.useremail === "" || form.username === "") {
      alert("Please fill all input fields");
      return;
    }

    const matchValue = data.useremail === form.useremail && data.username === form.username;
    if(matchValue){
        navigate("/passwordlogin");
        localStorage.setItem("authToken",data.username);
        localStorage.setItem("authToken",data.useremail);
    }
    else{
     console.log("Error")
    }
    console.log("Match Value:", matchValue);
  };

  console.log(form);

  return (
    <div className='flex justify-center items-center h-[100vh] ' >
      <form onSubmit={handleSubmit} className='flex flex-wrap flex-col bg-white p-10 shadow-lg w-[30%] '>
        {Logins.map((item: Login, index: number) => (
          <div key={index} className='flex justify-center items-center p-4 '>
            <label className='bg-red-300'>{item.username}</label>
            <input
              type={item.type}
              className='w-60 p-3 border outline-none focus:border-blue-300 border-gray-200'
              placeholder={item.placeholder}
              value={form[item.formname] || ''}
              onChange={(e) => handleChange(e, item.formname)}
            />
          </div>
        ))}
        <div className='flex justify-center items-center'>
          <button type="submit" className='font-bold mt-10 bg-blue-400 w-60 text-[20px] p-3 rounded-xl'>Submit</button>
        </div>
      </form>
    </div>
  );
};

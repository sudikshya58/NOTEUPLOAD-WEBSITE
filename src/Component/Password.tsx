import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "./firebase.ts";
import { useNavigate } from "react-router-dom";

interface AdminData {
  useremail: string;
  username: string;
  password: string;
  // Add other fields if needed
}

export const Password = () => {
  const [data, setData] = useState<AdminData | null>(null);
  const navigate = useNavigate();
  const [form, setForm] = useState<{ password: string }>({
    password: "",
  });

  useEffect(() => {
    const fetchadminDetail = async () => {
      const adminDetails = collection(db, "adminlogin");
      const snapshot = await getDocs(adminDetails);
      if (!snapshot.empty) {
        const adminData = snapshot.docs.map((doc) => ({
          // Ensure the document data matches AdminData
          ...doc.data(),
        }));

        // Assuming there's only one admin document, you might need to handle multiple documents as needed
        const admin = adminData[0] as AdminData; // Type assertion to ensure type
        setData(admin);
      }
    };

    fetchadminDetail();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Prevent the default form submission behavior

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
    <form
      onSubmit={handleSubmit}
      className="flex flex-wrap flex-col bg-white p-10 shadow-lg w-[30%] "
    >
      <div className="flex justify-center items-center p-4 ">
        <label className="bg-red-300">Password</label>
        <input
          type="password"
          className="w-60 p-3 border outline-none focus:border-blue-300 border-gray-200"
          placeholder="Password"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
      </div>
      <div className="flex justify-center items-center">
        <button
          type="submit"
          className="font-bold mt-10 bg-blue-400 w-60 text-[20px] p-3 rounded-xl"
        >
          Submit
        </button>
      </div>
    </form>
  );
};

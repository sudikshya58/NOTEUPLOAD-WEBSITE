import React, { FormEvent, useEffect, useState } from "react";
import { Logins } from "./index.js"; // Ensure Logins is correctly typed
import { db } from "../Component/firebase";
import { collection, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

// Define types
interface FormState {
  [key: string]: string;
}

interface Login {
  formname: string;
  type: string;
  placeholder?: string; // Make placeholder optional
}

interface AdminData {
  useremail: string;
  username: string;
  password: string;
  // Add other fields if needed
}

export const Login = () => {
  const [formStep, setFormStep] = useState<number>(1); // State to manage form steps
  const [form, setForm] = useState<FormState>({
    useremail: "",
    username: "",
    password: "",
  });
  const [data, setData] = useState<AdminData | null>(null);
  const [error, setError] = useState<string | null>(null); // For error handling
  console.log(error);

  useEffect(() => {
    const fetchAdminDetails = async () => {
      try {
        const adminDetails = collection(db, "adminlogin");
        const snapshot = await getDocs(adminDetails);
        const adminData = snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            useremail: data.useremail as string,
            username: data.username as string,
            password: data.password as string,
          } as AdminData;
        });

        if (adminData.length > 0) {
          setData(adminData[0]);
        } else {
          setError("No admin data found");
        }
      } catch (err) {
        setError((err as Error).message);
      }
    };

    fetchAdminDetails();
  }, []);

  const navigate = useNavigate();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    fieldName: string
  ) => {
    const { value } = e.target;
    setForm({
      ...form,
      [fieldName]: value,
    });
  };

  const handleSubmitStep1 = async (e: FormEvent) => {
    e.preventDefault();

    if (form.useremail === "" || form.username === "") {
      toast.error("Please fill all input fields");
      alert("Please fill all input fields");
      return;
    }

    if (
      data &&
      data.useremail === form.useremail &&
      data.username === form.username
    ) {
      setFormStep(2); // Move to the next step
    } else {
      toast.error("Invalid credentials");
      console.log("Error");
    }
  };

  const handleSubmitStep2 = async (e: FormEvent) => {
    e.preventDefault();

    if (data && data.password === form.password) {
      localStorage.setItem("accessToken", "ayhskidus");
      navigate("/dashboard"); // Password is correct, navigate to the desired page
    } else {
      toast.error("Incorrect password");
      alert("Incorrect password");
    }
  };

  return (
    <>
      <div className="flex justify-center items-center h-screen px-4 py-10">
        <form
          onSubmit={formStep === 1 ? handleSubmitStep1 : handleSubmitStep2}
          className="flex flex-col bg-white p-6 sm:p-10 w-full max-w-md mx-auto shadow-lg rounded-lg"
        >
          <h1 className="text-blue-400 font-bold text-xl text-center mb-6">Admin Login</h1>
          {formStep === 1 && (
            <>
              {Logins.map((item: Login, index: number) => (
                <div key={index} className="mb-4 flex flex-col gap-2">
                  <label className="font-medium text-base">{item.formname}</label>
                  <input
                    type={item.type}
                    className="w-full p-3 border border-gray-300 rounded outline-none focus:border-blue-400"
                    placeholder={item.placeholder || ""} // Handle optional placeholder
                    value={form[item.formname] || ""}
                    onChange={(e) => handleChange(e, item.formname)}
                  />
                </div>
              ))}
              <div className="flex justify-center">
                <button
                  type="submit"
                  className="font-bold bg-blue-400 w-full sm:w-40 text-white text-lg p-2 rounded hover:bg-blue-500"
                >
                  Next
                </button>
              </div>
            </>
          )}

          {formStep === 2 && (
            <>
              <div className="mb-4 flex flex-col">
                <label className="font-medium text-base">Password</label>
                <input
                  type="password"
                  className="w-full p-3 border border-gray-300 rounded outline-none focus:border-blue-400"
                  placeholder="Password"
                  value={form.password}
                  onChange={(e) => handleChange(e, "password")}
                />
              </div>
              <div className="flex justify-center">
                <button
                  type="submit"
                  className="font-bold bg-blue-400 w-full sm:w-60 text-white text-lg p-3 rounded-xl hover:bg-blue-500"
                >
                  Submit
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </>
  );
};

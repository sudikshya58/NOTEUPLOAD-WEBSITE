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
      <div className="flex justify-center items-center h-[100vh] ">
        <form
          onSubmit={formStep === 1 ? handleSubmitStep1 : handleSubmitStep2}
          className="flex flex-wrap flex-col bg-white p-10 shadow-lg w-[30%] "
        >
          {formStep === 1 && (
            <>
              {Logins.map((item: Login, index: number) => (
                <div key={index} className="flex justify-center items-center p-4 ">
                  <label className="bg-red-300">{item.formname}</label>
                  <input
                    type={item.type}
                    className="w-60 p-3 border outline-none focus:border-blue-300 border-gray-200"
                    placeholder={item.placeholder || ""} // Handle optional placeholder
                    value={form[item.formname] || ""}
                    onChange={(e) => handleChange(e, item.formname)}
                  />
                </div>
              ))}
              <div className="flex justify-center items-center">
                <button
                  type="submit"
                  className="font-bold mt-10 bg-blue-400 w-60 text-[20px] p-3 rounded-xl"
                >
                  Next
                </button>
              </div>
            </>
          )}

          {formStep === 2 && (
            <>
              <div className="flex justify-center items-center p-4 ">
                <label className="bg-red-300">Password</label>
                <input
                  type="password"
                  className="w-60 p-3 border outline-none focus:border-blue-300 border-gray-200"
                  placeholder="Password"
                  value={form.password}
                  onChange={(e) => handleChange(e, "password")}
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
            </>
          )}
        </form>
      </div>
    </>
  );
};

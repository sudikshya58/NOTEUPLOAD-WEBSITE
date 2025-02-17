import { FormEvent, useEffect, useState } from "react";
import { Notes } from "./index.js";
import { db, storage } from "../Component/firebase.js";
import { addDoc, collection, getDocs } from "firebase/firestore";
import toast from "react-hot-toast";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";

interface FormState {
  [key: string]: string;
}

const initialFormState: FormState = {
  semester: "",
  subject: "",
  Files: "", // Changed 'File' to 'Files'
};
interface Faculty {
  id: string;
  faculty: string; // Change 'name' to 'faculty' to match the data
}

export const AddNote = () => {
  const [form, setForm] = useState<FormState>(initialFormState);
  const [faculty, setFaculty] = useState<Faculty[] | null>(null); // Initialize as null
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchFaculty = async () => {
      const facultyCollection = collection(db, "Faculty");
      const snapshot = await getDocs(facultyCollection);
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Faculty[];
      setFaculty(data);
    };

    fetchFaculty();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files && e.target.files[0];
    if(selectedFile && selectedFile.size >30*1024*1024){
      toast.error("file size exceeds 30 mb limit");
      setFile(null);
      return;
    }
    setFile(selectedFile);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.faculty || !form.semester || !form.subject) {
      toast.error("Please fill all fields");
      return;
    }
    if (file && file.size > 30 * 1024 * 1024) { // 30MB in bytes
      toast.error("File size exceeds 30MB limit.");
      return;
    }
    setLoading(true);

    try {
      let fileUrl = "";
      if (file) {
        const storageRef = ref(storage, `files/${file.name}`);
        const uploadTask = uploadBytesResumable(storageRef, file);
        const snapshot = await uploadTask;
        fileUrl = await getDownloadURL(snapshot.ref);
      }

      const updatedForm = {
        ...form,
        Files: fileUrl,
      };

      if (!fileUrl) {
        setLoading(false);
        toast.error("Please upload a file");
        return;
      }

      await addDoc(collection(db, "NoteUpload"), updatedForm);
      toast.success("Submit success");
      setForm(initialFormState);
      setFile(null);
      setFaculty(null);
    } catch (error) {
      toast.error("Submit error");
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex justify-center  h-[100vh]">
        <div className="flex justify-center items-center">
          <form onSubmit={handleSubmit} className="shadow-xl border p-20">
            <div className="mb-4 flex flex-col items-center  w-full">
              <label className="text-black font-bold  mb-3">Upload File</label>
              <label
                htmlFor="file-upload"
                className="cursor-pointer border border-gray-300 p-3 rounded w-96 flex justify-center items-center bg-white text-gray-500"
              >
                <svg
                  className="w-6 h-6 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M7 16V12a4 4 0 018 0v4m4 4H5a2 2 0 01-2-2V7a2 2 0 012-2h3.586a1 1 0 01.707.293l1.414 1.414A1 1 0 0011.414 7H19a2 2 0 012 2v9a2 2 0 01-2 2z"
                  ></path>
                </svg>
                {file ? file.name : "Choose file"}
              </label>
              <input
                id="file-upload"
                type="file"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>

            {Notes.map((item: FormState, index: number) => (
              <div
                key={index}
                className="flex  flex-wrap justify-center items-center p-4 w-full"
              >
                <div className="flex flex-col w-96">
                  <label className="text-black font-bold mb-3">
                    {item.name}
                  </label>
                  <input
                    type={item.type}
                    className="p-3 border outline-none focus:border-blue-300 border-gray-200"
                    placeholder={item.placeholder}
                    onChange={handleChange}
                    name={item.formname}
                    value={form[item.formname] || ""}
                  />
                </div>
              </div>
            ))}

            <div className="p-4 flex flex-col">
              <label className="text-black font-bold mb-3 ">Faculty</label>
              <select
                name="faculty"
                value={form.faculty}
                onChange={handleChange}
                className="p-3 border outline-none focus:border-blue-300 border-gray-200"
              >
                <option value="">Select Faculty</option>
                {faculty !== null &&
                  faculty.map((f) => (
                    <option key={f.id} value={f.faculty}>
                      {f.faculty}
                    </option>
                  ))}
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`font-bold mt-10 bg-blue-400 w-96 text-[20px] p-3 rounded ${
                loading ? "cursor-not-allowed opacity-50" : ""
              }`}
            >
              {loading ? "Submitting..." : "Submit"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

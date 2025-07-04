import { FormEvent, useEffect, useState } from "react";
import { db, storage } from "../Component/firebase.js";
import { addDoc, collection, getDocs } from "firebase/firestore";
import toast from "react-hot-toast";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";

interface FormState {
  faculty: string;
  semester?: string;
  subject: string;
  category: string;
  Files: string;
}

const initialFormState: FormState = {
  faculty: "",
  semester: "",
  subject: "",
  category: "",
  Files: "",
};

interface Faculty {
  id: string;
  faculty: string;
}

export const AddNote = () => {
  const [form, setForm] = useState<FormState>(initialFormState);
  const [facultyList, setFacultyList] = useState<Faculty[] | null>(null);  // renamed from 'faculty' to 'facultyList'
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // Fetch faculty list on mount
  useEffect(() => {
    const fetchFaculty = async () => {
      try {
        const facultyCollection = collection(db, "Faculty");
        const snapshot = await getDocs(facultyCollection);
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Faculty[];
        setFacultyList(data);
      } catch (error) {
        toast.error("Failed to load faculties");
        console.error(error);
      }
    };

    fetchFaculty();
  }, []);

  // Handle file input change and validate size
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files && e.target.files[0];
    if (selectedFile && selectedFile.size > 30 * 1024 * 1024) {
      toast.error("File size exceeds 30MB limit");
      setFile(null);
      return;
    }
    setFile(selectedFile);
  };

  // Handle form input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Submit handler
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Validation logic
    if (!form.faculty) {
      toast.error("Please select a faculty");
      return;
    }

    // Only require semester if faculty is NOT General
    if (form.faculty !== "General" && !form.semester) {
      toast.error("Please select a semester");
      return;
    }

    if (!form.subject) {
      toast.error("Please enter a subject");
      return;
    }

    if (!form.category) {
      toast.error("Please select a category");
      return;
    }

    if (!file) {
      toast.error("Please upload a file");
      return;
    }

    setLoading(true);

    try {
      // Upload file to Firebase Storage with better async handling
      const storageRef = ref(storage, `files/${Date.now()}_${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      // Wrap upload in Promise for easier await
      const fileUrl: string = await new Promise((resolve, reject) => {
        uploadTask.on(
          "state_changed",
          null, // can add progress callback here if you want
          (error) => {
            toast.error("File upload failed");
            reject(error);
          },
          async () => {
            const url = await getDownloadURL(uploadTask.snapshot.ref);
            resolve(url);
          }
        );
      });

      // Prepare full data with uploaded file url
      const dataToSubmit = {
        ...form,
        Files: fileUrl,
      };

      await addDoc(collection(db, "NoteUpload"), dataToSubmit);

      toast.success("Submit success");

      // Reset form & file but DO NOT reset facultyList
      setForm(initialFormState);
      setFile(null);
    } catch (error) {
      toast.error("Submit error");
      console.error("Error submitting note:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center h-[100vh] items-center">
      <form onSubmit={handleSubmit} className="shadow-xl border p-20 bg-white rounded-lg w-full max-w-lg">
        {/* File Upload */}
        <div className="mb-4 flex flex-col items-center w-full">
          <label className="text-black font-bold mb-3">Upload File</label>
          <label
            htmlFor="file-upload"
            className="cursor-pointer border border-gray-300 p-3 rounded w-full flex justify-center items-center bg-white text-gray-500"
          >
            {file ? file.name : "Choose file"}
          </label>
          <input
            id="file-upload"
            type="file"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>

        {/* Faculty Dropdown */}
        <div className="p-4 flex flex-col">
          <label className="text-black font-bold mb-3">Faculty</label>
          <select
            name="faculty"
            value={form.faculty}
            onChange={handleChange}
            className="p-3 border outline-none focus:border-blue-300 border-gray-200"
          >
            <option value="">Select Faculty</option>
            {facultyList &&
              facultyList.map((f) => (
                <option key={f.id} value={f.faculty}>
                  {f.faculty}
                </option>
              ))}
            {/* Add General option */}
            <option value="General">General</option>
          </select>
        </div>

        {/* Conditionally render semester only if faculty is NOT General */}
        {form.faculty !== "General" && (
          <div className="p-4 flex flex-col">
            <label className="text-black font-bold mb-3">Semester</label>
            <select
              name="semester"
              value={form.semester}
              onChange={handleChange}
              className="p-3 border outline-none focus:border-blue-300 border-gray-200"
            >
              <option value="">Select Semester</option>
              {["1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th"].map((sem) => (
                <option key={sem} value={sem}>
                  {sem} Semester
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Subject input */}
        <div className="p-4 flex flex-col">
          <label className="text-black font-bold mb-3">Subject</label>
          <input
            type="text"
            name="subject"
            placeholder="Enter subject"
            value={form.subject}
            onChange={handleChange}
            className="p-3 border outline-none focus:border-blue-300 border-gray-200"
          />
        </div>

        {/* Category Dropdown */}
        <div className="p-4 flex flex-col">
          <label className="text-black font-bold mb-3">Category</label>
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className="p-3 border outline-none focus:border-blue-300 border-gray-200"
          >
            <option value="">Select Category</option>
            <option value="Lecture Note">Lecture Note</option>
            <option value="Assignment">Assignment</option>
            <option value="Final Report">Final Report</option>
            <option value="Question Collection">Question Collection</option>
          </select>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className={`font-bold mt-10 bg-blue-400 w-full text-[20px] p-3 rounded ${
            loading ? "cursor-not-allowed opacity-50" : ""
          }`}
        >
          {loading ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
};

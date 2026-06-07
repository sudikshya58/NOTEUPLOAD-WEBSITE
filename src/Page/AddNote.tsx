import { FormEvent, useEffect, useState } from "react";
import { db } from "../Component/firebase.js";
import { addDoc, collection, getDocs } from "firebase/firestore";
import toast from "react-hot-toast";

interface FormState {
  level: string;       // ✅ added
  faculty: string;
  semester?: string;
  subject: string;
  category: string;
  Files: string;
}

const initialFormState: FormState = {
  level: "",           // ✅ added
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

// ✅ Faculties based on level
const FACULTY_OPTIONS: Record<string, string[]> = {
  Bachelor: ["CSIT", "BCA", "BBS", "BIM", "BE", "BE Civil"],
  Master: ["MCSIT", "MBA", "MBS", "ME"],
};

export const AddNote = () => {
  const [form, setForm] = useState<FormState>(initialFormState);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files && e.target.files[0];
    if (selectedFile && selectedFile.size > 30 * 1024 * 1024) {
      toast.error("File size exceeds 30MB limit");
      setFile(null);
      return;
    }
    setFile(selectedFile);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    // ✅ Reset faculty when level changes
    if (name === "level") {
      setForm((prev) => ({ ...prev, level: value, faculty: "", semester: "" }));
      return;
    }

    // ✅ Reset semester when faculty changes
    if (name === "faculty") {
      setForm((prev) => ({ ...prev, faculty: value, semester: "" }));
      return;
    }

    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!form.level) {
      toast.error("Please select a level");
      return;
    }

    if (!form.faculty) {
      toast.error("Please select a faculty");
      return;
    }

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
      // ✅ Send all fields to backend
      const formData = new FormData();
      formData.append("file", file);
      formData.append("level", form.level);
      formData.append("faculty", form.faculty);
      formData.append("semester", form.semester || "");
      formData.append("subject", form.subject);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Upload to Google Drive failed");
      const { url } = await response.json();

      // ✅ Save to Firestore with level
      const dataToSubmit = {
        ...form,
        Files: url,
      };

      await addDoc(collection(db, "NoteUpload"), dataToSubmit);

      toast.success("Submit success");

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
    <div className="flex justify-center min-h-[100vh] items-center">
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
            accept="application/pdf"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>

        {/* ✅ Level Dropdown */}
        <div className="p-4 flex flex-col">
          <label className="text-black font-bold mb-3">Level</label>
          <select
            name="level"
            value={form.level}
            onChange={handleChange}
            className="p-3 border outline-none focus:border-blue-300 border-gray-200"
          >
            <option value="">Select Level</option>
            <option value="Bachelor">Bachelor</option>
            <option value="Master">Master</option>
            <option value="General">General</option>
          </select>
        </div>

        {/* ✅ Faculty Dropdown - shows based on level */}
        {form.level && form.level !== "General" && (
          <div className="p-4 flex flex-col">
            <label className="text-black font-bold mb-3">Faculty</label>
            <select
              name="faculty"
              value={form.faculty}
              onChange={handleChange}
              className="p-3 border outline-none focus:border-blue-300 border-gray-200"
            >
              <option value="">Select Faculty</option>
              {FACULTY_OPTIONS[form.level]?.map((f) => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
          </div>
        )}

        {/* ✅ Semester - shows only when faculty is selected and not General */}
        {form.faculty && form.level !== "General" && (
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
                <option key={sem} value={sem}>{sem} Semester</option>
              ))}
            </select>
          </div>
        )}

        {/* Subject */}
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

        {/* Category */}
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
          {loading ? "Uploading to Google Drive..." : "Submit"}
        </button>
      </form>
    </div>
  );
};
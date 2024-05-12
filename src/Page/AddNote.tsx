import { FormEvent, useState } from "react";
import { Notes } from "../Page/index.js";
import { db, storage } from "../Component/firebase";
import { addDoc, collection } from "firebase/firestore";
import toast from "react-hot-toast";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";

interface FormState {
    [key: string]: string;
}

export const AddNote = () => {
    const [form, setForm] = useState<FormState>({
        faculty: "",
        semester: "",
        subject: "",
        Files: "", // Changed 'File' to 'Files'
    });
    console.log(form)

    const [file, setFile] = useState<File | null>(null);
    const [loading,setLoading]=useState(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files && e.target.files[0];
        setFile(selectedFile);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm({
            ...form,
            [name]: value,
        });
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if(!form.faculty || !form.semester || !form.subject) { // Remove the condition for form.Files
            toast.error("Please fill all fields");
            return;
        }
        try {
            let fileUrl = "";
            if (file) {
                const storageRef = ref(storage, `files/${file.name}`);
                const uploadTask = uploadBytesResumable(storageRef, file);
                const snapshot = await uploadTask;
                fileUrl = await getDownloadURL(snapshot.ref);
            }
        
            // Update the form state with the file URL
            const updatedForm = {
                ...form,
                Files: fileUrl,
            };
        
            // Check if fileUrl is empty before submitting the form
            if (!fileUrl) {
                toast.error("Please upload a file");
                return;
            }
    
            // Submit the updated form state to Firestore
            setLoading(true); // Set loading to true when the submission starts
            await addDoc(collection(db, "NoteUpload"), updatedForm);
            setLoading(false); // Set loading to false when the submission completes
            toast.success("Submit success");
        } catch (error) {
            setLoading(false); // Set loading to false if there's an error
            toast.error("Submit error");
            console.error("Error:", error);
        }
    };
    
    

    return (
        <>
            <div>
                <form onSubmit={handleSubmit}>
                <div>
                        <input type="file" onChange={handleFileChange} />
                        {file && <p>Selected File: {file.name}</p>}
                    </div>
                    {Notes.map((item: FormState, index: number) => (
                        <div key={index} className="flex justify-center items-center p-4 ">
                            <label className="bg-red-300">{item.username}</label>
                            <input
                                type={item.type}
                                className="w-60 p-3 border outline-none focus:border-blue-300 border-gray-200"
                                placeholder={item.placeholder}
                                onChange={handleChange}
                                name={item.formname}
                                value={form[item.formname] || ""}
                            />
                        </div>
                    ))}
                 
                    <button
                        type="submit"
                        disabled={loading}
                        className={`font-bold mt-10 bg-blue-400 w-60 text-[20px] p-3 rounded ${loading ?"cursor-not-allowed opacity-50":""}`}
                    >
                        {loading ?"Submitting....":"submit"}
                    </button>
                </form>
            </div>
        </>
    );
};

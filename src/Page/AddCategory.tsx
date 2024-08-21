import { addDoc, collection } from "firebase/firestore";
import { useState } from "react";
import { db } from "../Component/firebase.ts";
import toast from "react-hot-toast";

interface FormState {
    [key: string]: string;
}

const initialFormState: FormState = {
    faculty: "",
    description: ""
};

export const AddCategory = () => {
    const [form, setForm] = useState<FormState>(initialFormState);
    const [loading, setLoading] = useState<boolean>(false);
    const [exceedsLimit, setExceedsLimit] = useState<boolean>(false);

    // Update handleChange to handle both input and textarea events
    const handleChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => {
        const { name, value } = e.target as HTMLInputElement | HTMLTextAreaElement;
        if (name === "description" && value.split(/\s+/).length > 200) {
            setExceedsLimit(true);
        } else {
            setExceedsLimit(false);
        }
        setForm({
            ...form,
            [name]: value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (exceedsLimit) {
            toast.error("Description should be less than 200 characters.");
            return;
        }
        if (!form.faculty || !form.description) {
            toast.error("Please fill all fields");
            return;
        }

        setLoading(true);
        try {
            await addDoc(collection(db, "Faculty"), form);
            toast.success("Submit success");
            setForm(initialFormState);
        } catch (error) {
            toast.error("Submit error");
        } finally {
            setLoading(false);
        }
    };

    console.log(form, "for");

    return (
        <>
            <div className="flex justify-center flex-col items-center h-[100vh]">
                <h1 className="mb-6 font-bold text-[20px]">Add Faculty</h1>
                <form onSubmit={handleSubmit} className="shadow-xl border p-20">
                    <div className="flex flex-col">
                        <div className="flex flex-col">
                            <label className="text-black font-bold mb-3">Faculty</label>
                            <input
                                className="p-3 border outline-none focus:border-blue-300 border-gray-200"
                                name="faculty"
                                value={form.faculty}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="flex flex-col">
                            <label className="text-black font-bold mb-3">Description</label>
                            <textarea
                                cols={50} // Fixed attribute name to 'cols'
                                rows={4} // Fixed attribute name to 'rows'
                                className="p-3 border outline-none focus:border-blue-300 border-gray-200"
                                name="description"
                                value={form.description}
                                onChange={handleChange}
                            />
                            {exceedsLimit && <p className="text-red-500">Description should be less than 200 characters.</p>}
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
                    </div>
                </form>
            </div>
        </>
    );
};

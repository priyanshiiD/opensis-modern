import { useState } from "react";

function TeacherForm() {
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        password: ""
    });

    function handleChange(e) {
        const { name, value } = e.target;

        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    }

    async function handleSubmit(e) {
    e.preventDefault();

    if (!formData.fullName || !formData.email || !formData.password) {
        alert("All fields are required");
        return;
    }

    try {
        const token = localStorage.getItem("accessToken");

        console.log("TOKEN:", token);

        const res = await fetch("http://localhost:4000/api/teachers", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
                
            },
            body: JSON.stringify(formData)
        });

        const data = await res.json();
        console.log(data);

        alert("Teacher added successfully");

        setFormData({
            fullName: "",
            email: "",
            password: ""
        });

    } catch (err) {
        console.error(err);
    }
}

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <input
                type="text"
                name="fullName"
                placeholder="Enter name"
                value={formData.fullName}
                onChange={handleChange}
                className="border p-2 w-full"
            />

            <input
                type="email"
                name="email"
                placeholder="Enter email"
                value={formData.email}
                onChange={handleChange}
                className="border p-2 w-full"
            />

            <input
                type="password"
                name="password"
                placeholder="Enter password"
                value={formData.password}
                onChange={handleChange}
                className="border p-2 w-full"
            />

            <button className="bg-green-500 text-white px-4 py-2">
                Submit
            </button>
        </form>
    );
}

export default TeacherForm;
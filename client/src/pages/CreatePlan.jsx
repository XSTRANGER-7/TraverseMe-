


import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";

const CreatePlan = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [timing, setTiming] = useState("");
  const [photo, setPhoto] = useState(null);
  const [date, setDate] = useState("");
  // const [error, setError] = useState("");
  // const [success, setSuccess] = useState("");

  const token = localStorage.getItem("token");
  const decodeduser = jwtDecode(token);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!photo) {
      // setError("Please select a photo.");
      toast.error("Please select a photo.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("location", location);
    formData.append("timing", timing);
    formData.append("photo", photo);
    formData.append("date", date);
    formData.append("createdBy", decodeduser?.id);

    try {
      const response = await axios.post("http://localhost:7000/plan", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success(response.data.message);
      // setSuccess(response.data.message);
      // setError("");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create the plan");
      // setError(error.response?.data?.message || "Failed to create the plan");
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-lightDark2 shadow-md rounded-lg outline-2 border-1 border-gray-700">
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-400">
        Create a New Plan
      </h2>
      {/* {error && (
        <p className="text-red-600 bg-red-100 p-2 rounded mb-4">{error}</p>
      )}
      {success && (
        <p className="text-green-600 bg-green-100 p-2 rounded mb-4">
          {success}
        </p>
      )} */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block font-medium text-gray-400">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border border-gray-700 rounded-md p-3 mt-1 bg-dark placeholder:text-gray-600"
            placeholder="Enter the title"
            required
          />
        </div>
        <div>
          <label className="block font-medium text-gray-400">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border border-gray-700 rounded-md p-3 mt-1 bg-dark placeholder:text-gray-600"
            placeholder="Enter a description"
            rows="4"
            required
          ></textarea>
        </div>
        <div>
          <label className="block font-medium text-gray-400">Location</label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full border border-gray-700 rounded-md p-3 mt-1 bg-dark placeholder:text-gray-600"
            placeholder="Enter the location"
            required
          />
        </div>
        <div>
          <label className="block font-medium text-gray-400">Timing</label>
          <input
            type="time"
            value={timing}
            onChange={(e) => setTiming(e.target.value)}
            className="w-full border border-gray-700 rounded-md p-3 mt-1 bg-dark placeholder:text-gray-600 appearance-none focus:outline-none cursor-pointer"
            required
          />
        </div>
        <div>
          <label className="block font-medium text-gray-400">Photo</label>
          <input
            type="file"
            onChange={(e) => setPhoto(e.target.files[0])}
            className="w-full border border-gray-700 rounded-md p-3 mt-1 bg-dark placeholder:text-gray-600"
            required
          />
        </div>
        <div>
          <label className="block font-medium text-gray-400">Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full border border-gray-700 rounded-md p-3 mt-1 bg-dark placeholder:text-gray-600 appearance-none focus:outline-none cursor-pointer"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-md font-semibold hover:bg-blue-700 transition"
        >
          Create Plan
        </button>
      </form>
    </div>
  );
};

export default CreatePlan;

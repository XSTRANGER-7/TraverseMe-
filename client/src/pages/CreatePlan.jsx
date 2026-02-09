
import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from 'react-router-dom';
import {jwtDecode} from "jwt-decode";

const CreatePlan = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [timing, setTiming] = useState("");
  const [photo, setPhoto] = useState(null);
  const [date, setDate] = useState("");
  const [step, setStep] = useState(0);

  const token = localStorage.getItem("token");
  const decodeduser = token ? jwtDecode(token) : null;
  const navigate = useNavigate();

  const fields = [
    { key: "title", label: "Title", type: "text", value: title, setter: setTitle },
    { key: "description", label: "Description", type: "textarea", value: description, setter: setDescription },
    { key: "location", label: "Location", type: "text", value: location, setter: setLocation },
    { key: "timing", label: "Timing", type: "time", value: timing, setter: setTiming },
    { key: "photo", label: "Photo", type: "file", value: photo, setter: setPhoto },
    { key: "date", label: "Date", type: "date", value: date, setter: setDate },
  ];

  const next = (e) => {
    e?.preventDefault();
    const current = fields[step];
    if (current.key === "photo") {
      if (!photo) return toast.error("Please select a photo.");
    } else if (!current.value || current.value === "") {
      return toast.error(`Please enter ${current.label.toLowerCase()}.`);
    }
    if (step < fields.length - 1) setStep((s) => s + 1);
    else handleSubmit();
  };

  const prev = () => setStep((s) => Math.max(0, s - 1));

  const handleSubmit = async () => {
    if (!photo) return toast.error("Please select a photo.");

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("location", location);
    formData.append("timing", timing);
    formData.append("photo", photo);
    formData.append("date", date);
    formData.append("createdBy", decodeduser?.id);

    try {
      const response = await axios.post("http://localhost:4000/plan", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success(response.data.message);
      const createdPlanId = response.data?.plan?._id || response.data?.plan?.id;
      if (createdPlanId) navigate(`/showplans/${createdPlanId}`);
      setStep(0);
      setTitle("");
      setDescription("");
      setLocation("");
      setTiming("");
      setPhoto(null);
      setDate("");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create the plan");
    }
  };

  const current = fields[step];

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="w-full max-w-2xl mx-auto p-8 rounded-lg shadow-lg bg-black border border-gray-800">
        <div className="mb-6 text-center">
          <h2 className="text-3xl font-bold text-red-400">Create a New Plan</h2>
          <p className="text-sm text-gray-400 mt-1">Step {step + 1} of {fields.length}</p>
        </div>

        <form onSubmit={(e) => e.preventDefault()}>
          <div className="min-h-[40vh] flex flex-col items-center justify-center">
            <label className="block text-xl font-semibold text-red-400 mb-4">{current.label}</label>

            {current.type === "textarea" ? (
              <textarea
                value={current.value}
                onChange={(e) => current.setter(e.target.value)}
                className="w-full bg-black border border-gray-700 rounded-md p-4 text-white placeholder-gray-500 max-h-60"
                placeholder={`Enter ${current.label.toLowerCase()}`}
                rows={6}
              />
            ) : current.type === "file" ? (
              <input
                type="file"
                onChange={(e) => current.setter(e.target.files[0])}
                className="w-full text-white bg-black"
              />
            ) : (
              <input
                type={current.type}
                value={current.value}
                onChange={(e) => current.setter(e.target.value)}
                className="w-full bg-black border border-gray-700 rounded-md p-4 text-white placeholder-gray-500"
                placeholder={`Enter ${current.label.toLowerCase()}`}
              />
            )}
          </div>

          <div className="mt-8 flex justify-between">
            <button
              type="button"
              onClick={prev}
              disabled={step === 0}
              className={`px-6 py-2 rounded-md font-semibold border ${step === 0 ? 'border-gray-700 text-gray-600' : 'border-red-400 text-red-400'} bg-transparent`}
            >
              Back
            </button>

            <button
              type="button"
              onClick={next}
              className="px-6 py-2 rounded-md font-semibold bg-red-400 text-black hover:opacity-90"
            >
              {step < fields.length - 1 ? 'Next' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePlan;

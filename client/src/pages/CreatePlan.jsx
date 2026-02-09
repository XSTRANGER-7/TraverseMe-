
import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from 'react-router-dom';
import indiaCities from "../data/indiaCities";
import {jwtDecode} from "jwt-decode";

const CreatePlan = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [timing, setTiming] = useState("");
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [date, setDate] = useState("");
  const [step, setStep] = useState(0);
  const fileInputRef = useRef(null);

  const token = localStorage.getItem("token");
  const decodeduser = token ? jwtDecode(token) : null;
  const navigate = useNavigate();

  useEffect(() => {
    return () => {
      if (photoPreview) URL.revokeObjectURL(photoPreview);
    };
  }, [photoPreview]);

  const handleFile = (file) => {
    if (!file) return;
    setPhoto(file);
    if (photoPreview) URL.revokeObjectURL(photoPreview);
    setPhotoPreview(URL.createObjectURL(file));
  };

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
  const [showCityList, setShowCityList] = useState(false);
  const [filteredCities, setFilteredCities] = useState(indiaCities);

  const handleLocationChange = (val) => {
    setLocation(val);
    const q = String(val || "").toLowerCase();
    if (!q) setFilteredCities(indiaCities);
    else setFilteredCities(indiaCities.filter((c) => c.toLowerCase().includes(q)));
    setShowCityList(true);
  };

  const handleSelectCity = (city) => {
    setLocation(city);
    setShowCityList(false);
  };

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
            ) : current.key === 'location' ? (
                <div className="w-full relative">
                  <input
                    value={current.value}
                    onChange={(e) => handleLocationChange(e.target.value)}
                    onFocus={() => { setFilteredCities(indiaCities); setShowCityList(true); }}
                    onBlur={() => setTimeout(() => setShowCityList(false), 150)}
                    className="w-full bg-black border border-gray-700 rounded-md p-4 text-white placeholder-gray-500"
                    placeholder="Select or type a city"
                    aria-label="Select city"
                  />

                  <div className={`absolute left-0 right-0 mt-1 bg-black border border-gray-700 rounded-md z-50 ${showCityList ? '' : 'hidden'}`}>
                    <div className="max-h-56 sm:max-h-48 overflow-auto">
                      {filteredCities.length === 0 ? (
                        <div className="p-3 text-gray-400">No cities found</div>
                      ) : (
                        filteredCities.map((c) => (
                          <button
                            key={c}
                            type="button"
                            onMouseDown={() => handleSelectCity(c)}
                            className="w-full text-left px-4 py-2 hover:bg-red-900/30 text-gray-200"
                          >
                            {c}
                          </button>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              ) : current.key === 'photo' ? (
              <>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFile(e.target.files[0])}
                  className="hidden"
                />

                <div
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={(e) => { e.preventDefault(); setIsDragging(false); const f = e.dataTransfer.files[0]; handleFile(f); }}
                  className={`w-full rounded-md p-8 text-center cursor-pointer bg-black ${isDragging ? 'border-2 border-red-300' : 'border-2 border-dashed border-gray-600'}`}
                >
                  {photoPreview ? (
                    <div className="flex flex-col items-center">
                      <img src={photoPreview} alt="preview" className="max-h-48 object-cover rounded mb-4" />
                      <div className="flex gap-3">
                        <button type="button" onClick={() => fileInputRef.current?.click()} className="px-4 py-2 bg-red-400 text-black rounded">Change</button>
                        <button type="button" onClick={() => { setPhoto(null); URL.revokeObjectURL(photoPreview); setPhotoPreview(null); if (fileInputRef.current) fileInputRef.current.value = null; }} className="px-4 py-2 border border-gray-700 text-gray-200 rounded">Remove</button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-gray-300">
                      <p className="text-lg font-medium text-red-400">Drag & drop a photo here</p>
                      <p className="text-sm mt-2">or click to select from folder</p>
                      <p className="text-xs text-gray-500 mt-2">(PNG, JPG, GIF)</p>
                    </div>
                  )}
                </div>
              </>
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

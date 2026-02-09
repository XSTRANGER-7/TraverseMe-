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
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
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
    { key: "date", label: "Date", type: "date", value: date, setter: setDate },
    { key: "timing", label: "Timing", type: "time", value: timing, setter: setTiming },
    { key: "photo", label: "Photo", type: "file", value: photo, setter: setPhoto },
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

  const handleTimeSelect = (hours, minutes) => {
    const timeStr = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
    setTiming(timeStr);
    setShowTimePicker(false);
  };

  const handleDateSelect = (selectedDate) => {
    setDate(selectedDate);
    setShowDatePicker(false);
  };

  const TimePicker = () => {
    const [hours, setHours] = useState(parseInt(timing.split(':')[0]) || new Date().getHours());
    const [minutes, setMinutes] = useState(parseInt(timing.split(':')[1]) || new Date().getMinutes());
    const secondsRef = useRef(null);

    useEffect(() => {
      // keep a live clock running when not interacting
      secondsRef.current = setInterval(() => {
        setHours((h) => h); // force re-render if needed
      }, 1000);
      return () => clearInterval(secondsRef.current);
    }, []);

    const AnalogClock = ({ hours, minutes, setHours, setMinutes }) => {
      const svgRef = useRef(null);
      const dragging = useRef(null);

      const size = 220;
      const cx = size / 2;
      const cy = size / 2;
      const r = size / 2 - 10;

      const polarToDeg = (x, y) => {
        const dx = x - cx;
        const dy = y - cy;
        const rad = Math.atan2(dy, dx);
        let deg = (rad * 180) / Math.PI + 90;
        deg = (deg + 360) % 360;
        return deg;
      };

      const degToHourMinute = (deg, isHour) => {
        if (isHour) {
          const hourFloat = deg / 30; // 360/12=30
          const hr = Math.floor(hourFloat) % 24;
          return hr;
        }
        const min = Math.round(deg / 6) % 60; // 360/60=6
        return min;
      };

      const getPoint = (deg, length) => {
        const rad = ((deg - 90) * Math.PI) / 180;
        return {
          x: cx + Math.cos(rad) * length,
          y: cy + Math.sin(rad) * length,
        };
      };

      const onPointerDown = (e) => {
        const rect = svgRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const dist = Math.hypot(x - cx, y - cy);
        const isHour = dist < r * 0.6;
        dragging.current = isHour ? 'hour' : 'minute';
        onPointerMove(e);
        window.addEventListener('pointermove', onPointerMove);
        window.addEventListener('pointerup', onPointerUp);
      };

      const onPointerMove = (e) => {
        if (!dragging.current) return;
        const rect = svgRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const deg = polarToDeg(x, y);
        if (dragging.current === 'hour') {
          const hr = degToHourMinute(deg, true);
          setHours(hr);
        } else {
          const m = degToHourMinute(deg, false);
          setMinutes(m);
        }
      };

      const onPointerUp = () => {
        dragging.current = null;
        window.removeEventListener('pointermove', onPointerMove);
        window.removeEventListener('pointerup', onPointerUp);
      };

      const hourDeg = ((hours % 12) + minutes / 60) * 30; // 360/12
      const minuteDeg = minutes * 6;

      const hourPt = getPoint(hourDeg, r * 0.5);
      const minutePt = getPoint(minuteDeg, r * 0.8);

      return (
        <svg
          ref={svgRef}
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          onPointerDown={onPointerDown}
          className="mx-auto"
        >
          <circle cx={cx} cy={cy} r={r} stroke="#374151" strokeWidth="3" fill="#000" />
          {/* hour ticks */}
          {[...Array(12)].map((_, i) => {
            const deg = i * 30;
            const outer = getPoint(deg, r - 4);
            const inner = getPoint(deg, r - 14);
            return <line key={i} x1={inner.x} y1={inner.y} x2={outer.x} y2={outer.y} stroke="#4b5563" strokeWidth="2" />;
          })}

          {/* minute hand */}
          <line x1={cx} y1={cy} x2={minutePt.x} y2={minutePt.y} stroke="#ef4444" strokeWidth="3" strokeLinecap="round" />
          {/* hour hand */}
          <line x1={cx} y1={cy} x2={hourPt.x} y2={hourPt.y} stroke="#f87171" strokeWidth="5" strokeLinecap="round" />

          <circle cx={cx} cy={cy} r="4" fill="#ef4444" />
        </svg>
      );
    };

    return (
      <div className="bg-black border border-gray-700 rounded-lg p-6 w-full max-w-sm">
        <AnalogClock hours={hours} minutes={minutes} setHours={setHours} setMinutes={setMinutes} />
        <div className="mt-4 text-center text-3xl font-bold text-red-400">{String(hours).padStart(2, '0')}:{String(minutes).padStart(2, '0')}</div>
        <div className="flex gap-2 justify-end mt-4">
          <button type="button" onClick={() => setShowTimePicker(false)} className="px-4 py-2 border border-gray-700 rounded text-gray-200">Cancel</button>
          <button type="button" onClick={() => handleTimeSelect(hours, minutes)} className="px-4 py-2 bg-red-400 text-black rounded font-semibold">Confirm</button>
        </div>
      </div>
    );
  };

  const DatePicker = () => {
    const [currentMonth, setCurrentMonth] = useState(new Date(date || new Date()));

    const getDaysInMonth = (date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    const getFirstDayOfMonth = (date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();

    const days = [];
    const firstDay = getFirstDayOfMonth(currentMonth);
    const daysInMonth = getDaysInMonth(currentMonth);

    for (let i = 0; i < firstDay; i++) days.push(null);
    for (let i = 1; i <= daysInMonth; i++) days.push(i);

    const handlePrevMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
    const handleNextMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));

    return (
      <div className="bg-black border border-gray-700 rounded-lg p-4 w-full max-w-sm">
        <div className="flex justify-between items-center mb-4">
          <button type="button" onClick={handlePrevMonth} className="text-red-400 text-xl">←</button>
          <h3 className="text-red-400 font-semibold">{currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</h3>
          <button type="button" onClick={handleNextMonth} className="text-red-400 text-xl">→</button>
        </div>
        <div className="grid grid-cols-7 gap-2 mb-4">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => <div key={d} className="text-center text-xs text-gray-400 font-semibold">{d}</div>)}
          {days.map((day, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => day && handleDateSelect(`${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`)}
              className={`p-2 text-sm rounded ${day ? 'text-white hover:bg-red-900/30 cursor-pointer' : ''} ${day === new Date(date).getDate() && currentMonth.getMonth() === new Date(date).getMonth() ? 'bg-red-400 text-black font-semibold' : ''}`}
            >
              {day}
            </button>
          ))}
        </div>
        <button type="button" onClick={() => setShowDatePicker(false)} className="w-full px-4 py-2 border border-gray-700 rounded text-gray-200">Close</button>
      </div>
    );
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
              ) : current.key === 'date' ? (
              <div className="w-full flex flex-col items-center">
                <input
                  type="text"
                  value={date}
                  onClick={() => setShowDatePicker(true)}
                  readOnly
                  className="w-full bg-black border border-gray-700 rounded-md p-4 text-white placeholder-gray-500 cursor-pointer"
                  placeholder="Select a date"
                />
                {showDatePicker && <div className="mt-4"><DatePicker /></div>}
              </div>
              ) : current.key === 'timing' ? (
              <div className="w-full flex flex-col items-center">
                <input
                  type="text"
                  value={timing}
                  onClick={() => setShowTimePicker(true)}
                  readOnly
                  className="w-full bg-black border border-gray-700 rounded-md p-4 text-white placeholder-gray-500 cursor-pointer"
                  placeholder="Select a time"
                />
                {showTimePicker && <div className="mt-4"><TimePicker /></div>}
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

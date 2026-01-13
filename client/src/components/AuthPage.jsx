
// import React, { useState, useEffect, useRef } from 'react';
// import { FaGoogle } from 'react-icons/fa';
// import { motion } from 'framer-motion';
// import { GoogleLogin } from '@react-oauth/google';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import { IoArrowBack } from 'react-icons/io5'; 
// import { toast } from 'react-toastify';

// const AuthPage = () => {
//   const [isLogin, setIsLogin] = useState(true); 
//   const [isRotating, setIsRotating] = useState(true); 
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     password: '',
//     gender: '',
//     age: '',
//     aadhaarNo: '', 
//   });
//   const [error, setError] = useState({});
//   const [currentStep, setCurrentStep] = useState(0);
//   const navigate = useNavigate();


//   const handleChange = (e) => {
//   const { name, value } = e.target;

//   if (name === 'aadhaarNo') {
//     const formattedValue = value.replace(/\D/g, ''); // Remove non-numeric characters
//     setFormData({ ...formData, aadhaarNo: formattedValue });
//   } else if (name === 'age') {
//     setFormData({ ...formData, age: parseInt(value, 10) || '' }); // Ensure age is numeric
//   } else {
//     setFormData({ ...formData, [name]: value });
//   }
// };


//   const validateField = (field, value) => {
//     switch (field) {
//       case 'email':
//         const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//         return emailRegex.test(value) ? '' : 'Enter a valid email address';
  
//       case 'password':
//         return value.length >= 8 ? '' : 'Password must be at least 8 characters long';
  
//       case 'age':
//         const age = parseInt(value, 10);
//         return age >= 14 && age <= 90 ? '' : 'Age must be between 14 and 90';
  
//       case 'aadhaarNo':
//         const aadhaarNo = value.replace(/\s/g, '');
//         return /^\d{12}$/.test(aadhaarNo) ? '' : 'Aadhaar number must be 12 digits';
  
//       default:
//         return '';
//     }
//   };
  
//   const nameRef = useRef(null);
//   const emaillRef = useRef(null);
//   const passworddRef = useRef(null);
//   const genderRef = useRef(null);
//   const ageRef = useRef(null);
//   const aadhaarNoRef = useRef(null);
 
//   const handleKeyUp = (event) => { 
//     if (event.key === 'Enter') {
//       if (event.target.name === 'name') {
//         console.log('Moving to email field');
//         emaillRef.current.focus();
//       } else if (event.target.name === 'email') {
//         passworddRef.current.focus();
//       } else if (event.target.name === 'password') {
//         genderRef.current.focus();
//       } else if (event.target.name === 'gender') {
//         ageRef.current.focus();
//       } else if (event.target.name === 'age') {
//         aadhaarNoRef.current.focus();
//       } else if (event.target.name === 'aadhaarNo') {
//         registerUser();
//       }
//     }
//   };

//   const registerUser = async () => {
//     const sanitizedData = {
//       ...formData,
//       aadhaarNo: formData.aadhaarNo.replace(/\s/g, ''), 
//       age: parseInt(formData.age, 10),
//     };
  
//     try {
//       const response = await axios.post('http://localhost:7000/register', sanitizedData);

  
//       if (response.status === 201 || response.status === 200 || response.status === 203) { 
//         console.log('Registration successful:', response.data.message);
//         toast.success('Registered successfully! Please wait for the verification.', {
//           position: 'top-right',
//           autoClose: 5000,
//         });
//         setIsLogin(true);
//       } 
//       else { 
//         toast.error('Unexpected error occurred. Please try again.', {
//           position: 'top-right',
//           autoClose: 5000,
//         });
//         setError({ ...error, general: 'Unexpected error occurred. Please try again.' });
//       }
//     } catch (err) { 
//       console.error('Registration error:', err.response?.data);
//       toast.error('Registration failed. Please try again.', {
//         position: 'top-right',
//         autoClose: 5000,
//       });
//       setError({
//         ...error,
//         general: err.response?.data?.message || 'Registration failed. Please try again.',
//       });
//     }
//   };

  
//   const nextStep = async () => {
//     const fields = ['name', 'email', 'password', 'gender', 'age', 'aadhaarNo'];
//     const currentField = fields[currentStep];
//     const errorMessage = validateField(currentField, formData[currentField]);
  
//     if (!formData[currentField]) {
//       setError({
//         ...error,
//         [currentField]: `${currentField.charAt(0).toUpperCase() + currentField.slice(1)} is required`,
//       });
//       return;
//     }
  
//     if (errorMessage) {
//       setError({ ...error, [currentField]: errorMessage });
//       return;
//     }
  
//     if (currentField === 'email') {
//       try {
//         const response = await axios.post('http://localhost:7000/check-email', {
//           email: formData.email,
//         });
//         if (response.data.exists) {
//           setError({ ...error, email: 'User already registered with this email' });
//           return;
//         }
//       } catch (err) {
//         setError({
//           ...error,
//           email: err.response?.data?.message || 'Error checking email. Please try again.',
//         });
//         return;
//       }
//     }
   
//     setError({ ...error, [currentField]: '' });
   
//     if (currentStep === fields.length - 1) {
//       await registerUser();
//     } else { 
//       if (currentStep < fields.length - 1) {
//         setCurrentStep((prevStep) => prevStep + 1);
//       }
//     }
//   };
  
//   const prevStep = () => {
//     if (currentStep > 0) {
//       setCurrentStep(currentStep - 1);
//     }
//   };
 
//       const emailRef = useRef(null);
//       const passwordRef = useRef(null);
    
//       const handleKeyDown = (event) => { 
//         if (event.key === 'Enter' && event.target.name === 'email') {
//           console.log('Moving to password field');
//           passwordRef.current.focus(); // Focus on password field
//         }
     
//         if (event.key === 'Enter' && event.target.name === 'password') {
//           console.log('Moving to submit field');
//           loginUser();
//         }
//       };
   

//     const loginUser = async () => {
//       try {
//         const response = await axios.post('http://localhost:7000/login', {
//           email: formData.email,
//           password: formData.password,
//         });
  
//         if (response.status === 200) {
//           const { token, user } = response.data;
   
//           // console.log('Login successful:', token, user);
//           localStorage.setItem('token', token);
//           localStorage.setItem('user', JSON.stringify(user)); 
//           navigate('/'); 
//           window.location.reload();  
//         }else if(response.status === 204){
//           console.log('Your profile is under Verifcation'); 
//           toast.info('Your profile is under verification. Try to login after sometime.', {
//             style: {
//               backgroundColor: '#000000', /* Blue background for info */
//               color: '#8acbffbd',
//             },
//             position: 'top-right',
//             autoClose: 5000,
//           }); 
//         }  else { 
//           setFormData({ email: '', password: '' });
//           toast.error('Invalid credentials, please try again', {
//             position: 'top-right',
//             autoClose: 5000,
//           });
//           setError({ ...error, general: 'Invalid credentials, please try again' });
//         }
//       } catch (err) { 
//         console.error('Login error hmm:', err.response?.data); 
//         // toast.error(`${err.response?.data}`, {
//         toast.error('Something went wrong, please try again', {
//           position: 'top-right',
//           autoClose: 5000,
//         });
//         setError({ ...error, general: err.response?.data?.message || 'Error logging in, please try again' });
//       }
//     };


      
//   const renderInputFields = () => {
//     const fields = [
//       { label: 'Username', name: 'name', type: 'text', placeholder: 'Enter your username' },
//       { label: 'Email', name: 'email', type: 'email', placeholder: 'Enter your email' },
//       { label: 'Password', name: 'password', type: 'password', placeholder: 'Enter your password' },
//       {
//         label: 'Gender',
//         name: 'gender',
//         type: 'select',
//         options: [
//           { value: '', label: 'Select your gender' },
//           { value: 'male', label: 'Male' },
//           { value: 'female', label: 'Female' },
//           { value: 'other', label: 'Other' },
//         ],
//       },
//       { label: 'Age', name: 'age', type: 'number', placeholder: 'Enter your age' },
//       {
//         label: 'Aadhaar No.',
//         name: 'aadhaarNo',
//         type: 'text',
//         placeholder: 'Enter your Aadhaar number (12 digits)',
//       },
//     ];
//     const currentField = fields[currentStep];

//     return (
//       <div key={currentField.name}>
//         <label className="block text-gray-400 mb-2">{currentField.label}</label>
//         {currentField.type === 'select' ? (
//           <select
//             name={currentField.name}
//             value={formData[currentField.name]}
//             onChange={handleChange}
//             onKeyUp={handleKeyUp} // Attach onKeyUp event
//             ref={currentField.name === 'name' ? nameRef : currentField.name === 'email' ? emaillRef : currentField.name === 'password' ? passworddRef : currentField.name === 'aadhaarNo' ? aadhaarNoRef : currentField.name === 'age' ? ageRef : currentField.name === 'gender' ? genderRef : null}
//             className="w-full p-3 rounded-lg bg-gray-900 text-white border border-gray-600 focus:ring focus:ring-primary"
//           >
//             {currentField.options.map((option) => (
//               <option key={option.value} value={option.value}>
//                 {option.label}
//               </option>
//             ))}
//           </select>
//         ) : (
//           <input
//             type={currentField.type}
//             placeholder={currentField.placeholder}
//             name={currentField.name}
//             value={formData[currentField.name]}
//             onChange={handleChange}
//             className="w-full p-3 rounded-lg bg-gray-900 text-white border border-gray-600 focus:ring focus:ring-primary"
//           />
//         )}
//         {error[currentField.name] && (
//           <p className="text-red-500 text-sm mt-2">{error[currentField.name]}</p>
//         )}
//       </div>
//     );
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-black via-gray-900 to-black overflow-hidden">
//         <motion.div
//         initial={{ scale: 0.8, opacity: 0 }}
//         animate={{ scale: 1, opacity: 1 }}
//         transition={{ duration: 0.6 }}
//         className={`relative w-full max-w-md px-8 bg-gradient-to-b from-Dark via-black to-black rounded-lg shadow-2xl border border-gray-700 ${
//           isRotating ? 'rotate-card' : ''
//         }`}
//       >
//         <div className='py-8'>

//        {!isLogin && currentStep > 0 && (
//          <IoArrowBack
//            onClick={prevStep}
//            className="absolute top-4 left-4 text-white text-xl cursor-pointer"
//          />
//        )}

//        <h2 className="text-white text-3xl font-semibold text-center mb-6">
//          {isLogin ? 'Login' : 'Sign Up'}
//        </h2>

//        <form className="space-y-6"  onSubmit={(e) => e.preventDefault()}>
//          {isLogin ? (
//            <>
//              <div>
//                <label className="block text-gray-400 mb-2">Email</label>
//                <input
//                  type="email"
//                  placeholder="Enter your email"
//                  name="email"
//                  value={formData.email}
//                  onChange={handleChange}
//                  onKeyDown={handleKeyDown} 
//                  ref={emailRef}
//                  className="w-full p-3 rounded-lg bg-gray-900 text-white border border-gray-600 focus:ring focus:ring-primary"
//                />
//              </div>
//              <div>
//                <label className="block text-gray-400 mb-2">Password</label>
//                <input
//                  type="password"
//                  placeholder="Enter your password"
//                  name="password"
//                  value={formData.password}
//                  onChange={handleChange}
//                  onKeyDown={handleKeyDown} 
//                  ref={passwordRef}
//                  className="w-full p-3 rounded-lg bg-gray-900 text-white border border-gray-600 focus:ring focus:ring-primary"
//                />
//              </div>
//              <div>
//                <button
//                  type="button"
//                  onClick={loginUser}
//                  className="w-full p-3 mt-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
//                >
//                  Login
//                </button>
//              </div>
//            </>
//          ) : (
//            <div>
//              {renderInputFields()}
//              <button
//                type="button"
//                onClick={nextStep}
//                className="w-full p-3 mt-10 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
//              >
//                {currentStep < 5 ? 'Next' : 'Submit'}
//              </button>
//            </div>
//          )} 

//          <div className="text-center text-white mt-4">
//            {isLogin ? (
//              <>
//                Don't have an account?{' '}
//                <button
//                  type="button"
//                  onClick={() => setIsLogin(false)}
//                  className="text-blue-500"
//                >
//                  Sign Up
//                </button>
//              </>
//            ) : (
//              <>
//                Already have an account?{' '}
//                <button
//                  type="button"
//                  onClick={() => setIsLogin(true)}
//                  className="text-blue-500 mb-4"
//                >
//                  Login
//                </button>
//              </>
//            )}
           
//          </div>
//        </form>
//      </div> 
//      </motion.div>
//      <style>
//         {`
//           .rotate-card {
//             animation: rotate 0.6s ease-in-out;
//           }

//           @keyframes rotate {
//             0% {
//               transform: rotateY(0);
//             }
//             50% {
//               transform: rotateY(90deg);
//             }
//             100% {
//               transform: rotateY(0);
//             }
//           }
//         `}
//       </style>
//     </div>

//   );
// };

// export default AuthPage;



























// import React, { useState, useEffect, useRef } from "react";
// import axios from "axios";

// const CameraValidation = () => {
//   const [validationMessage, setValidationMessage] = useState("");
//   const [borderColor, setBorderColor] = useState("red"); // Default border color
//   const [isCaptureEnabled, setIsCaptureEnabled] = useState(false); // Control "Capture Photo" button visibility
//   const [detectedGender, setDetectedGender] = useState(""); // Store the detected gender and confidence
//   const videoRef = useRef(null);
//   const canvasRef = useRef(null);

//   useEffect(() => {
//     // Start the camera stream
//     const startCamera = async () => {
//       try {
//         const stream = await navigator.mediaDevices.getUserMedia({ video: true });
//         if (videoRef.current) {
//           videoRef.current.srcObject = stream;
//         }
//       } catch (error) {
//         console.error("Error accessing the camera:", error);
//       }
//     };

//     startCamera();

//     const interval = setInterval(validateFrame, 500); // Validate the frame every 500ms
//     return () => clearInterval(interval); // Cleanup interval on unmount
//   }, []);

//   const validateFrame = async () => {
//     if (!canvasRef.current || !videoRef.current) return;

//     const canvas = canvasRef.current;
//     const video = videoRef.current;

//     // Draw the current video frame on the canvas
//     canvas.width = video.videoWidth;
//     canvas.height = video.videoHeight;
//     const context = canvas.getContext("2d");
//     context.drawImage(video, 0, 0, canvas.width, canvas.height);

//     // Convert canvas to Blob
//     canvas.toBlob(async (blob) => {
//       if (!blob) {
//         console.error("Failed to create a Blob from the canvas.");
//         return;
//       }

//       const formData = new FormData();
//       formData.append("frame", blob, "frame.jpg");

//       try {
//         const response = await axios.post("http://127.0.0.1:5000/validate_frame", formData);
//         const { status, message } = response.data;

//         setValidationMessage(message);
//         setBorderColor(status === "success" ? "green" : "red");
//         setIsCaptureEnabled(status === "success"); // Enable the "Capture Photo" button only if validation passes
//       } catch (error) {
//         setValidationMessage("Error validating frame. Please try again.");
//         setBorderColor("red");
//         setIsCaptureEnabled(false); // Disable the "Capture Photo" button on validation error
//       }
//     }, "image/jpeg");
//   };

//   const capturePhoto = async () => {
//     if (!canvasRef.current || !videoRef.current) return;

//     const canvas = canvasRef.current;
//     const video = videoRef.current;

//     // Draw the current video frame on the canvas
//     canvas.width = video.videoWidth;
//     canvas.height = video.videoHeight;
//     const context = canvas.getContext("2d");
//     context.drawImage(video, 0, 0, canvas.width, canvas.height);

//     // Convert canvas to Blob
//     canvas.toBlob(async (blob) => {
//       if (!blob) {
//         console.error("Failed to create a Blob from the canvas.");
//         return;
//       }

//       const formData = new FormData();
//       formData.append("image", blob, "captured-image.jpg");

//       try {
//         const response = await axios.post("http://127.0.0.1:5000/analyze_gender", formData);
//         const { status, gender } = response.data;

//         if (status === "success") {
//           setDetectedGender(gender); // Store detected gender and display it
//           alert(`Gender detected: ${gender}`);
//         }
//       } catch (error) {
//         alert("Error analyzing gender. Please try again.");
//       }
//     }, "image/jpeg");
//   };

//   return (
//     <div style={styles.container}>
//       <div style={{ ...styles.cameraWrapper, borderColor }}>
//         <video
//           ref={videoRef}
//           autoPlay
//           playsInline
//           muted
//           style={styles.video}
//         />
//         <canvas ref={canvasRef} style={styles.hiddenCanvas}></canvas>
//       </div>
//       <p style={styles.message}>{validationMessage}</p>
//       {isCaptureEnabled && (
//         <button onClick={capturePhoto} style={styles.captureButton}>
//           Capture Photo
//         </button>
//       )}
//       {detectedGender && (
//         <p style={styles.detectedGender}>Detected Gender: {detectedGender}</p>
//       )}
//     </div>
//   );
// };

// const styles = {
//   container: {
//     display: "flex",
//     flexDirection: "column",
//     alignItems: "center",
//     justifyContent: "center",
//     height: "100vh",
//     backgroundColor: "#f4f4f4",
//   },
//   cameraWrapper: {
//     width: 200, // Adjust size as needed
//     height: 200,
//     borderRadius: "50%",
//     border: "5px solid red", // Default red border
//     overflow: "hidden",
//     position: "relative",
//   },
//   video: {
//     width: "100%",
//     height: "100%",
//     objectFit: "cover",
//   },
//   hiddenCanvas: {
//     display: "none", // Hidden canvas for frame processing
//   },
//   message: {
//     marginTop: 20,
//     fontSize: "1rem",
//     fontWeight: "bold",
//     color: "#333",
//   },
//   captureButton: {
//     marginTop: 20,
//     padding: "10px 20px",
//     fontSize: "1rem",
//     fontWeight: "bold",
//     backgroundColor: "#4CAF50",
//     color: "white",
//     border: "none",
//     borderRadius: "5px",
//     cursor: "pointer",
//   },
//   detectedGender: {
//     marginTop: 20,
//     fontSize: "1.2rem",
//     fontWeight: "bold",
//     color: "#333",
//   },
// };

// export default CameraValidation;
















// import React, { useState, useEffect, useRef } from "react";
// import axios from "axios";

// const CameraValidation = () => {
//   const [validationMessage, setValidationMessage] = useState("");
//   const [borderColor, setBorderColor] = useState("red"); // Default border color
//   const [isCaptureEnabled, setIsCaptureEnabled] = useState(false); // Control "Capture Photo" button visibility
//   const [detectedGender, setDetectedGender] = useState(""); // Store the detected gender and confidence
//   const videoRef = useRef(null);
//   const canvasRef = useRef(null);

//   useEffect(() => {
//     // Start the camera stream
//     const startCamera = async () => {
//       try {
//         const stream = await navigator.mediaDevices.getUserMedia({ video: true });
//         if (videoRef.current) {
//           videoRef.current.srcObject = stream;
//         }
//       } catch (error) {
//         console.error("Error accessing the camera:", error);
//       }
//     };

//     startCamera();

//     const interval = setInterval(validateMovement, 500); // Validate the frame every 500ms
//     return () => clearInterval(interval); // Cleanup interval on unmount
//   }, []);

//   // const validateFrame = async () => {
//   //   if (!canvasRef.current || !videoRef.current) return;

//   //   const canvas = canvasRef.current;
//   //   const video = videoRef.current;

//   //   // Draw the current video frame on the canvas
//   //   canvas.width = video.videoWidth;
//   //   canvas.height = video.videoHeight;
//   //   const context = canvas.getContext("2d");
//   //   context.drawImage(video, 0, 0, canvas.width, canvas.height);

//   //   // Convert canvas to Blob
//   //   canvas.toBlob(async (blob) => {
//   //     if (!blob) {
//   //       console.error("Failed to create a Blob from the canvas.");
//   //       return;
//   //     }

//   //     const formData = new FormData();
//   //     formData.append("frame", blob, "frame.jpg");

//   //     try {
//   //       const response = await axios.post("http://127.0.0.1:5000/validate_frame", formData);
//   //       const { status, message } = response.data;

//   //       setValidationMessage(message);
//   //       setBorderColor(status === "success" ? "green" : "red");
//   //       setIsCaptureEnabled(status === "success"); // Enable the "Capture Photo" button only if validation passes
//   //     } catch (error) {
//   //       setValidationMessage("Error validating frame. Please try again.");
//   //       setBorderColor("red");
//   //       setIsCaptureEnabled(false); // Disable the "Capture Photo" button on validation error
//   //     }
//   //   }, "image/jpeg");
//   // };


//   const validateMovement = async () => {
//     // Assume `capturedFrames` contains multiple captured frames
//     const formData = new FormData();
//     capturedFrames.forEach((frame, index) => {
//       formData.append(`frames`, frame, `frame_${index}.jpg`);
//     });
  
//     try {
//       const response = await axios.post("http://127.0.0.1:5000/validate_movement", formData);
//       const { status, message } = response.data;
  
//       if (status === "success") {
//         alert("Face movement verified. Proceeding to gender analysis.");
//         // Proceed to capture the final photo for gender analysis
//       } else {
//         alert(message); // Show error message
//       }
//     } catch (error) {
//       console.error("Error validating movement:", error);
//     }
//   };
  

//   const capturePhoto = async () => {
//     if (!canvasRef.current || !videoRef.current) return;

//     const canvas = canvasRef.current;
//     const video = videoRef.current;

//     // Draw the current video frame on the canvas
//     canvas.width = video.videoWidth;
//     canvas.height = video.videoHeight;
//     const context = canvas.getContext("2d");
//     context.drawImage(video, 0, 0, canvas.width, canvas.height);

//     // Convert canvas to Blob
//     canvas.toBlob(async (blob) => {
//       if (!blob) {
//         console.error("Failed to create a Blob from the canvas.");
//         return;
//       }

//       const formData = new FormData();
//       formData.append("image", blob, "captured-image.jpg");

//       try {
//         const response = await axios.post("http://127.0.0.1:5000/analyze_gender", formData);
//         const { status, gender } = response.data;

//         if (status === "success") {
//           setDetectedGender(gender); // Store detected gender and display it
//           alert(`Gender detected: ${gender}`);
//         }
//       } catch (error) {
//         alert("Error analyzing gender. Please try again.");
//       }
//     }, "image/jpeg");
//   };

//   return (
//     <div style={styles.container}>
//       <div style={{ ...styles.cameraWrapper, borderColor }}>
//         <video
//           ref={videoRef}
//           autoPlay
//           playsInline
//           muted
//           style={styles.video}
//         />
//         <canvas ref={canvasRef} style={styles.hiddenCanvas}></canvas>
//       </div>
//       <p style={styles.message}>{validationMessage}</p>
//       {isCaptureEnabled && (
//         <button onClick={capturePhoto} style={styles.captureButton}>
//           Capture Photo
//         </button>
//       )}
//       {detectedGender && (
//         <p style={styles.detectedGender}>Detected Gender: {detectedGender}</p>
//       )}
//     </div>
//   );
// };

// const styles = {
//   container: {
//     display: "flex",
//     flexDirection: "column",
//     alignItems: "center",
//     justifyContent: "center",
//     height: "100vh",
//     backgroundColor: "#f4f4f4",
//   },
//   cameraWrapper: {
//     width: 200, // Adjust size as needed
//     height: 200,
//     borderRadius: "50%",
//     border: "5px solid red", // Default red border
//     overflow: "hidden",
//     position: "relative",
//   },
//   video: {
//     width: "100%",
//     height: "100%",
//     objectFit: "cover",
//   },
//   hiddenCanvas: {
//     display: "none", // Hidden canvas for frame processing
//   },
//   message: {
//     marginTop: 20,
//     fontSize: "1rem",
//     fontWeight: "bold",
//     color: "#333",
//   },
//   captureButton: {
//     marginTop: 20,
//     padding: "10px 20px",
//     fontSize: "1rem",
//     fontWeight: "bold",
//     backgroundColor: "#4CAF50",
//     color: "white",
//     border: "none",
//     borderRadius: "5px",
//     cursor: "pointer",
//   },
//   detectedGender: {
//     marginTop: 20,
//     fontSize: "1.2rem",
//     fontWeight: "bold",
//     color: "#333",
//   },
// };

// export default CameraValidation;














// import React, { useState, useEffect, useRef } from "react";
// import axios from "axios";

// const CameraValidation = () => {
//   const [capturedFrames, setCapturedFrames] = useState([]); // Store captured frames
//   const [validationMessage, setValidationMessage] = useState("");
//   const [borderColor, setBorderColor] = useState("red");
//   const videoRef = useRef(null);
//   const canvasRef = useRef(null);

//   useEffect(() => {
//     // Start the camera stream
//     const startCamera = async () => {
//       try {
//         const stream = await navigator.mediaDevices.getUserMedia({ video: true });
//         if (videoRef.current) {
//           videoRef.current.srcObject = stream;
//         }
//       } catch (error) {
//         console.error("Error accessing the camera:", error);
//       }
//     };

//     startCamera();
//   }, []);

//   const captureFrame = () => {
//     if (!canvasRef.current || !videoRef.current) return;

//     const canvas = canvasRef.current;
//     const video = videoRef.current;

//     // Draw the current video frame on the canvas
//     canvas.width = video.videoWidth;
//     canvas.height = video.videoHeight;
//     const context = canvas.getContext("2d");
//     context.drawImage(video, 0, 0, canvas.width, canvas.height);

//     // Convert the frame to Blob and add it to the capturedFrames array
//     canvas.toBlob((blob) => {
//       if (blob) {
//         setCapturedFrames((prevFrames) => [...prevFrames, blob]); // Append frame to the list
//       }
//     }, "image/jpeg");
//   };

//   const validateMovement = async () => {
//     // Ensure there are captured frames
//     if (capturedFrames.length === 0) {
//       setValidationMessage("No frames captured. Ensure the camera is working.");
//       return;
//     }

//     const formData = new FormData();
//     capturedFrames.forEach((frame, index) => {
//       formData.append(`frames`, frame, `frame_${index}.jpg`);
//     });

//     try {
//       const response = await axios.post("http://127.0.0.1:5000/validate_movement", formData);
//       const { status, message } = response.data;

//       if (status === "success") {
//         alert("Face movement verified. Proceeding to gender analysis.");
//         setValidationMessage("Face movement verified successfully.");
//         setBorderColor("green");
//       } else {
//         setValidationMessage(message);
//         setBorderColor("red");
//       }
//     } catch (error) {
//       console.error("Error validating movement:", error);
//       setValidationMessage("Error validating movement. Please try again.");
//       setBorderColor("red");
//     }
//   };

//   return (
//     <div style={styles.container}>
//       <div style={{ ...styles.cameraWrapper, borderColor }}>
//         <video
//           ref={videoRef}
//           autoPlay
//           playsInline
//           muted
//           style={styles.video}
//         />
//         <canvas ref={canvasRef} style={styles.hiddenCanvas}></canvas>
//       </div>
//       <button onClick={captureFrame} style={styles.captureButton}>
//         Capture Frame
//       </button>
//       <button onClick={validateMovement} style={styles.validateButton}>
//         Validate Movement
//       </button>
//       <p style={styles.message}>{validationMessage}</p>
//     </div>
//   );
// };

// const styles = {
//   container: {
//     display: "flex",
//     flexDirection: "column",
//     alignItems: "center",
//     justifyContent: "center",
//     height: "100vh",
//     backgroundColor: "#f4f4f4",
//   },
//   cameraWrapper: {
//     width: 200,
//     height: 200,
//     borderRadius: "50%",
//     border: "5px solid red", // Default red border
//     overflow: "hidden",
//     position: "relative",
//   },
//   video: {
//     width: "100%",
//     height: "100%",
//     objectFit: "cover",
//   },
//   hiddenCanvas: {
//     display: "none", // Hidden canvas for frame processing
//   },
//   captureButton: {
//     marginTop: 20,
//     padding: "10px 20px",
//     fontSize: "1rem",
//     fontWeight: "bold",
//     backgroundColor: "#4CAF50",
//     color: "white",
//     border: "none",
//     borderRadius: "5px",
//     cursor: "pointer",
//   },
//   validateButton: {
//     marginTop: 10,
//     padding: "10px 20px",
//     fontSize: "1rem",
//     fontWeight: "bold",
//     backgroundColor: "#2196F3",
//     color: "white",
//     border: "none",
//     borderRadius: "5px",
//     cursor: "pointer",
//   },
//   message: {
//     marginTop: 20,
//     fontSize: "1rem",
//     fontWeight: "bold",
//     color: "#333",
//   },
// };

// export default CameraValidation;























// import React, { useState, useEffect, useRef } from "react";
// import axios from "axios";

// const CameraValidation = () => {
//   const [instructions, setInstructions] = useState([
//     "Turn your face to the right",
//     "Turn your face to the left",
//     "Move your face up",
//     "Move your face down",
//   ]); // Movement instructions
//   const [currentInstructionIndex, setCurrentInstructionIndex] = useState(0);
//   const [validationMessage, setValidationMessage] = useState("");
//   const [borderColor, setBorderColor] = useState("red"); // Red border by default
//   const [frames, setFrames] = useState([]); // Captured frames
//   const [isValidationComplete, setIsValidationComplete] = useState(false);
//   const [detectedGender, setDetectedGender] = useState("");
//   const videoRef = useRef(null);
//   const canvasRef = useRef(null);

//   useEffect(() => {
//     const startCamera = async () => {
//       try {
//         const stream = await navigator.mediaDevices.getUserMedia({ video: true });
//         if (videoRef.current) {
//           videoRef.current.srcObject = stream;
//         }
//       } catch (error) {
//         console.error("Error accessing the camera:", error);
//       }
//     };

//     startCamera();

//     const interval = setInterval(() => {
//       if (!isValidationComplete) {
//         processFrame();
//       }
//     }, 1000); // Process frames every second
//     return () => clearInterval(interval);
//   }, [isValidationComplete]);

//   const processFrame = () => {
//     if (!canvasRef.current || !videoRef.current) return;

//     const canvas = canvasRef.current;
//     const video = videoRef.current;

//     // Draw the current video frame on the canvas
//     canvas.width = video.videoWidth;
//     canvas.height = video.videoHeight;
//     const context = canvas.getContext("2d");
//     context.drawImage(video, 0, 0, canvas.width, canvas.height);

//     // Simulate wireframe overlay for face detection
//     context.strokeStyle = borderColor === "green" ? "green" : "red";
//     context.lineWidth = 2;
//     context.beginPath();
//     context.ellipse(
//       canvas.width / 2, // x-coordinate (center)
//       canvas.height / 2, // y-coordinate (center)
//       canvas.width / 6, // x-radius
//       canvas.height / 8, // y-radius
//       0, // rotation
//       0, // start angle
//       2 * Math.PI // end angle
//     );
//     context.stroke();

//     // Convert the canvas to a Blob and add it to frames if valid
//     canvas.toBlob((blob) => {
//       if (blob && borderColor === "green") {
//         setFrames((prevFrames) => [...prevFrames, blob]); // Append frame to the list
//         handleInstructionProgress();
//       }
//     }, "image/jpeg");
//   };

//   const handleInstructionProgress = () => {
//     if (currentInstructionIndex < instructions.length - 1) {
//       setCurrentInstructionIndex((prevIndex) => prevIndex + 1); // Move to the next instruction
//     } else {
//       setIsValidationComplete(true); // Validation complete after all instructions
//     }
//   };

//   const validateMovement = async () => {
//     const formData = new FormData();
//     frames.forEach((frame, index) => {
//       formData.append("frames", frame, `frame_${index}.jpg`);
//     });

//     try {
//       const response = await axios.post("http://127.0.0.1:5000/validate_movement", formData);
//       const { status, message } = response.data;

//       setValidationMessage(message);
//       if (status === "success") {
//         fetchGender(); // Proceed to gender detection
//       } else {
//         setBorderColor("red");
//       }
//     } catch (error) {
//       console.error("Error validating movement:", error);
//       setValidationMessage("Error validating movement. Please try again.");
//       setBorderColor("red");
//     }
//   };

//   const fetchGender = async () => {
//     const formData = new FormData();
//     formData.append("image", frames[frames.length - 1], "final_frame.jpg"); // Send the last frame for gender analysis

//     try {
//       const response = await axios.post("http://127.0.0.1:5000/analyze_gender", formData);
//       const { status, gender } = response.data;

//       if (status === "success") {
//         setDetectedGender(gender);
//       } else {
//         setValidationMessage("Error analyzing gender.");
//       }
//     } catch (error) {
//       console.error("Error analyzing gender:", error);
//       setValidationMessage("Error analyzing gender. Please try again.");
//     }
//   };

//   return (
//     <div style={styles.container}>
//       <div style={{ ...styles.cameraWrapper, borderColor }}>
//         <video
//           ref={videoRef}
//           autoPlay
//           playsInline
//           muted
//           style={styles.video}
//         />
//         <canvas ref={canvasRef} style={styles.canvas}></canvas>
//       </div>
//       <p style={styles.message}>
//         {!isValidationComplete
//           ? instructions[currentInstructionIndex]
//           : "Validating your movements..."}
//       </p>
//       {isValidationComplete && (
//         <button onClick={validateMovement} style={styles.validateButton}>
//           Validate Movement
//         </button>
//       )}
//       {detectedGender && (
//         <p style={styles.genderMessage}>
//           Detected Gender: <strong>{detectedGender}</strong>
//         </p>
//       )}
//       <p style={styles.validationMessage}>{validationMessage}</p>
//     </div>
//   );
// };

// const styles = {
//   container: {
//     display: "flex",
//     flexDirection: "column",
//     alignItems: "center",
//     justifyContent: "center",
//     height: "100vh",
//     backgroundColor: "#f4f4f4",
//   },
//   cameraWrapper: {
//     width: 300,
//     height: 300,
//     borderRadius: "50%",
//     border: "5px solid red", // Default border
//     overflow: "hidden",
//     position: "relative",
//   },
//   video: {
//     width: "100%",
//     height: "100%",
//     objectFit: "cover",
//   },
//   canvas: {
//     position: "absolute",
//     top: 0,
//     left: 0,
//     width: "100%",
//     height: "100%",
//   },
//   message: {
//     marginTop: 20,
//     fontSize: "1.2rem",
//     fontWeight: "bold",
//     color: "#333",
//   },
//   validateButton: {
//     marginTop: 20,
//     padding: "10px 20px",
//     fontSize: "1rem",
//     fontWeight: "bold",
//     backgroundColor: "#4CAF50",
//     color: "white",
//     border: "none",
//     borderRadius: "5px",
//     cursor: "pointer",
//   },
//   genderMessage: {
//     marginTop: 20,
//     fontSize: "1.2rem",
//     fontWeight: "bold",
//     color: "#4CAF50",
//   },
//   validationMessage: {
//     marginTop: 10,
//     fontSize: "1rem",
//     color: "#FF5722",
//   },
// };

// export default CameraValidation;




// import { useEffect, useState } from 'react';
// import img from "./img2.png";

// const SplashScreen = () => {
//   const [mounted, setMounted] = useState(false);

//   useEffect(() => {
//     setMounted(true);
//   }, []);

//   return (
//     // <div className="h-screen w-full flex items-center justify-center relative overflow-hidden bg-gradient-to-b from-purple-600 via-blue-500 to-blue-400">
//     <div className="h-screen w-full flex items-center justify-center relative overflow-hidden bg-gradient-to-b from-black via-gray-900 to-black">
//       {/* Ripple waves */}
//       <div className={`absolute w-64 h-64 rounded-full border-4 border-white/20 transition-all duration-1000 ${mounted ? 'scale-[4] opacity-0' : 'scale-100 opacity-100'}`} />
//       <div className={`absolute w-64 h-64 rounded-full border-4 border-white/20 transition-all duration-1000 delay-300 ${mounted ? 'scale-[3] opacity-0' : 'scale-100 opacity-100'}`} />
//       <div className={`absolute w-64 h-64 rounded-full border-4 border-white/20 transition-all duration-1000 delay-600 ${mounted ? 'scale-[2] opacity-0' : 'scale-100 opacity-100'}`} />
      
//       {/* Continuous waves */}
//       <div className="absolute w-64 h-64 rounded-full border-4 border-white/20 animate-[ripple_3s_linear_infinite]" />
//       <div className="absolute w-64 h-64 rounded-full border-4 border-white/20 animate-[ripple_3s_linear_infinite_1s]" />
//       <div className="absolute w-64 h-64 rounded-full border-4 border-white/20 animate-[ripple_3s_linear_infinite_2s]" />
      
//       {/* Logo container with subtle float animation */}
//       <div className={`relative w-32 h-32 rounded-full transition-all duration-1000 ${mounted ? 'scale-100 opacity-100' : 'scale-50 opacity-0'} animate-float`}>
//         <img 
//           src={img}  // Replace with your actual logo path
//           alt="App Logo"
//           className="w-full h-full object-contain"
//         />
//       </div>
      
//       <style jsx>{`
//         @keyframes ripple {
//           0% {
//             transform: scale(1);
//             opacity: 0.2;
//           }
//           100% {
//             transform: scale(4);
//             opacity: 0;
//           }
//         }
//         @keyframes float {
//           0%, 100% {
//             transform: translateY(0);
//           }
//           50% {
//             transform: translateY(-10px);
//           }
//         }
//       `}</style>
//     </div>
//   );
// };

// export default SplashScreen;














// import React, { useEffect, useRef, useState } from "react";
// import Webcam from "react-webcam";
// import axios from "axios";

// const AuthPage = () => {
//   const webcamRef = useRef(null);
//   const [instruction, setInstruction] = useState("Move your face to the front");
//   const [borderColor, setBorderColor] = useState("red");
//   const [message, setMessage] = useState("");
//   const [currentStep, setCurrentStep] = useState(0);
//   const [capturedImages, setCapturedImages] = useState([]);
//   const [isProcessing, setIsProcessing] = useState(false);
//   const instructions = [
//     "Move your face to the front",
//     "Move your face to the right",
//     "Move your face to the left",
//     "Move your face up",
//     "Move your face down",
//   ];

//   useEffect(() => {
//     const interval = setInterval(() => {
//       captureFrame();
//     }, 500); // Capture every 500ms to detect real-time issues
//     return () => clearInterval(interval);
//   }, [currentStep]);

//   const captureFrame = async () => {
//     if (!webcamRef.current) return;
  
//     const frame = webcamRef.current.getScreenshot(); // Capture frame
//     const formData = new FormData();
//     formData.append("frame", frame); // Ensure the key is "frame"
  
//     try {
//       const response = await axios.post(
//         "http://127.0.0.1:5000/validate_frame",
//         formData,
//         {
//           headers: { "Content-Type": "multipart/form-data" },
//         }
//       );
  
//       if (response.data.status === "success") {
//         setBorderColor("green");
//         setMessage(response.data.message);
//       } else {
//         setBorderColor("red");
//         setMessage(response.data.message);
//       }
//     } catch (error) {
//       setBorderColor("red");
//       setMessage("Error validating face. Try again.");
//     }
//   };
  
//   const handleCapture = async () => {
//     if (!webcamRef.current) return;

//     const frame = webcamRef.current.getScreenshot();
//     setCapturedImages((prev) => [...prev, frame]);

//     if (currentStep < instructions.length - 1) {
//       setCurrentStep((prev) => prev + 1);
//       setInstruction(instructions[currentStep + 1]);
//     } else {
//       setIsProcessing(true);
//       await processGender();
//     }
//   };

//   const processGender = async () => {
//     const formData = new FormData();
//     capturedImages.forEach((img, index) =>
//       formData.append(`images[${index}]`, img)
//     );

//     try {
//       const response = await axios.post(
//         "http://127.0.0.1:5000/analyze_gender",
//         formData,
//         { headers: { "Content-Type": "multipart/form-data" } }
//       );

//       if (response.data.status === "success") {
//         setMessage(`Gender: ${response.data.gender}`);
//       } else {
//         setMessage("Error analyzing gender.");
//       }
//     } catch (error) {
//       setMessage("Error analyzing gender.");
//     } finally {
//       setIsProcessing(false);
//     }
//   };

//   return (
//     <div className="auth-container" style={{ textAlign: "center" }}>
//       <h1>Face Verification</h1>
//       <div
//         className="camera-container"
//         style={{
//           border: `5px solid ${borderColor}`,
//           borderRadius: "50%",
//           width: "300px",
//           height: "300px",
//           overflow: "hidden",
//           margin: "20px auto",
//           position: "relative",
//         }}
//       >
//         <Webcam
//           ref={webcamRef}
//           screenshotFormat="image/jpeg"
//           videoConstraints={{
//             width: 300,
//             height: 300,
//             facingMode: "user",
//           }}
//           style={{ width: "100%", height: "100%" }}
//         />
//         {message && (
//           <p
//             style={{
//               color: borderColor === "green" ? "green" : "red",
//               position: "absolute",
//               bottom: "-40px",
//               width: "100%",
//             }}
//           >
//             {message}
//           </p>
//         )}
//       </div>

//       <p>{instruction}</p>
//       <button
//         onClick={handleCapture}
//         disabled={borderColor !== "green" || isProcessing}
//       >
//         {currentStep === instructions.length - 1
//           ? "Finish & Analyze Gender"
//           : "Next"}
//       </button>
//     </div>
//   );
// };

// export default AuthPage;











// import React, { useEffect, useRef, useState } from "react";
// import Webcam from "react-webcam";
// import axios from "axios";

// const AuthPage = () => {
//   const webcamRef = useRef(null);
//   const [instruction, setInstruction] = useState("Move your face to the front");
//   const [borderColor, setBorderColor] = useState("red");
//   const [message, setMessage] = useState("No face detected.");
//   const [currentStep, setCurrentStep] = useState(0);
//   const [capturedImages, setCapturedImages] = useState([]);
//   const [isProcessing, setIsProcessing] = useState(false);
//   const instructions = [
//     "Move your face to the front",
//     "Move your face to the right",
//     "Move your face to the left",
//     "Move your face up",
//     "Move your face down",
//   ];

//   useEffect(() => {
//     const interval = setInterval(() => {
//       captureFrame();
//     }, 500); // Capture every 500ms to detect real-time issues
//     return () => clearInterval(interval);
//   }, [currentStep]);

//   const captureFrame = async () => {
//     if (!webcamRef.current) return;
  
//     const frame = webcamRef.current.getScreenshot(); // Capture the current frame
//     console.log("Captured Frame: ", frame); // Log the frame for debugging
//     if (!frame) {
//       setBorderColor("red");
//       setMessage("Error capturing frame. Ensure the camera is working.");
//       return;
//     }
  
//     const formData = new FormData();
//     formData.append("frame", frame); // Ensure the key is "frame"
  
//     try {
//       const response = await axios.post(
//         "http://127.0.0.1:5000/validate_frame",
//         formData,
//         {
//           headers: { "Content-Type": "multipart/form-data" },
//         }
//       );
  
//       if (response.data.status === "success") {
//         setBorderColor("green");
//         setMessage(response.data.message);
//       } else {
//         setBorderColor("red");
//         setMessage(response.data.message);
//       }
//     } catch (error) {
//       setBorderColor("red");
//       setMessage("Error validating face. Try again.");
//     }
//   };
  
//   const handleCapture = async () => {
//     if (!webcamRef.current) return;

//     const frame = webcamRef.current.getScreenshot();
//     setCapturedImages((prev) => [...prev, frame]);

//     if (currentStep < instructions.length - 1) {
//       setCurrentStep((prev) => prev + 1);
//       setInstruction(instructions[currentStep + 1]);
//     } else {
//       setIsProcessing(true);
//       await processGender();
//     }
//   };

//   const processGender = async () => {
//     const formData = new FormData();
//     capturedImages.forEach((img, index) =>
//       formData.append(`images[${index}]`, img)
//     );

//     try {
//       const response = await axios.post(
//         "http://127.0.0.1:5000/analyze_gender",
//         formData,
//         { headers: { "Content-Type": "multipart/form-data" } }
//       );

//       if (response.data.status === "success") {
//         setMessage(`Gender: ${response.data.gender}`); // Display gender result
//       } else {
//         setMessage("Error analyzing gender.");
//       }
//     } catch (error) {
//       setMessage("Error analyzing gender.");
//     } finally {
//       setIsProcessing(false);
//     }
//   };

//   return (
//     <div className="auth-container" style={{ textAlign: "center" }}>
//       <h1>Face Verification</h1>
//       <div
//         className="camera-container"
//         style={{
//           border: `5px solid ${borderColor}`,
//           borderRadius: "50%",
//           width: "300px",
//           height: "300px",
//           overflow: "hidden",
//           margin: "20px auto",
//           position: "relative",
//         }}
//       >
//         <Webcam
//           ref={webcamRef}
//           screenshotFormat="image/jpeg"
//           videoConstraints={{
//             width: 300,
//             height: 300,
//             facingMode: "user",
//           }}
//           style={{ width: "100%", height: "100%" }}
//         />
//       </div>

//       <p
//         style={{
//           color: borderColor === "green" ? "green" : "red",
//           marginTop: "10px",
//         }}
//       >
//         {message}
//       </p>

//       <p>{instruction}</p>
//       <button
//         onClick={handleCapture}
//         disabled={borderColor !== "green" || isProcessing}
//       >
//         {currentStep === instructions.length - 1
//           ? "Finish & Analyze Gender"
//           : "Next"}
//       </button>
//     </div>
//   );
// };

// export default AuthPage;















// import React, { useEffect, useRef, useState } from "react";
// import Webcam from "react-webcam";
// import axios from "axios";

// const AuthPage = () => {
//   const webcamRef = useRef(null);
//   const [instruction, setInstruction] = useState("Move your face to the front");
//   const [borderColor, setBorderColor] = useState("red");
//   const [message, setMessage] = useState("Position your face in the frame.");
//   const [currentStep, setCurrentStep] = useState(0);
//   const [capturedImages, setCapturedImages] = useState([]);
//   const [isProcessing, setIsProcessing] = useState(false);
//   const [gender, setGender] = useState(null);
//   const instructions = [
//     "Move your face to the front",
//     "Move your face to the right",
//     "Move your face to the left",
//     "Move your face up",
//     "Move your face down",
//   ];

//   useEffect(() => {
//     const interval = setInterval(() => {
//       validateFrame();
//     }, 800); // Validate frame every 800ms
//     return () => clearInterval(interval);
//   }, [currentStep]);

//   const validateFrame = async () => {
//     if (!webcamRef.current) return;

//     const frame = webcamRef.current.getScreenshot(); // Capture the current frame
//     const formData = new FormData();
//     formData.append("frame", frame);
//     formData.append("instruction", instructions[currentStep]);

//     try {
//       const response = await axios.post(
//         "http://127.0.0.1:5000/validate_frame",
//         formData,
//         {
//           headers: { "Content-Type": "multipart/form-data" },
//         }
//       );

//       if (response.data.status === "success") {
//         setBorderColor("green");
//         setMessage(response.data.message);

//         // Capture the frame only if movement is validated
//         if (response.data.movementValid) {
//           captureFrame(frame);
//         }
//       } else {
//         setBorderColor("red");
//         setMessage(response.data.message);
//       }
//     } catch (error) {
//       setBorderColor("red");
//       setMessage("Error validating face. Try again.");
//     }
//   };

//   const captureFrame = (frame) => {
//     setCapturedImages((prev) => [...prev, frame]);

//     // Move to the next instruction
//     if (currentStep < instructions.length - 1) {
//       setCurrentStep((prev) => prev + 1);
//       setInstruction(instructions[currentStep + 1]);
//     } else {
//       setIsProcessing(true);
//       analyzeGender(); // Once all instructions are completed
//     }
//   };

//   const analyzeGender = async () => {
//     const formData = new FormData();
//     capturedImages.forEach((img, index) =>
//       formData.append(`images[${index}]`, img)
//     );

//     try {
//       const response = await axios.post(
//         "http://127.0.0.1:5000/analyze_gender",
//         formData,
//         { headers: { "Content-Type": "multipart/form-data" } }
//       );

//       if (response.data.status === "success") {
//         setGender(response.data.gender); // Display detected gender
//         setMessage(`Detected Gender: ${response.data.gender}`);
//       } else {
//         setMessage("Error analyzing gender.");
//       }
//     } catch (error) {
//       setMessage("Error analyzing gender.");
//     } finally {
//       setIsProcessing(false);
//     }
//   };

//   return (
//     <div className="auth-container" style={{ textAlign: "center" }}>
//       <h1>Face Verification</h1>
//       <div
//         className="camera-container"
//         style={{
//           border: `5px solid ${borderColor}`,
//           borderRadius: "50%",
//           width: "300px",
//           height: "300px",
//           overflow: "hidden",
//           margin: "20px auto",
//           position: "relative",
//         }}
//       >
//         <Webcam
//           ref={webcamRef}
//           screenshotFormat="image/jpeg"
//           videoConstraints={{
//             width: 300,
//             height: 300,
//             facingMode: "user",
//           }}
//           style={{ width: "100%", height: "100%" }}
//         />
//       </div>

//       <p
//         style={{
//           color: borderColor === "green" ? "green" : "red",
//           marginTop: "10px",
//         }}
//       >
//         {message}
//       </p>

//       <p>{instruction}</p>

//       {isProcessing && <p>Processing gender analysis...</p>}
//       {gender && <p>Final Gender: {gender}</p>}
//     </div>
//   );
// };

// export default AuthPage;






















// import React, { useEffect, useRef, useState } from "react";
// import Webcam from "react-webcam";
// import axios from "axios";

// const AuthPage = () => {
//   const webcamRef = useRef(null);
//   const [instruction, setInstruction] = useState("Move your face to the right");
//   const [borderColor, setBorderColor] = useState("red");
//   const [message, setMessage] = useState("Position your face in the frame.");
//   const [currentStep, setCurrentStep] = useState(0);
//   const [capturedImages, setCapturedImages] = useState([]);
//   const [isProcessing, setIsProcessing] = useState(false);
//   const [gender, setGender] = useState(null);

//   // Instructions for the user
//   const instructions = [
//     "Move your face to the right",
//     "Move your face to the left",
//     "Move your face up",
//     "Move your face down",
//   ];

//   useEffect(() => {
//     const interval = setInterval(() => {
//       validateFrame();
//     }, 800); // Validate frame every 800ms
//     return () => clearInterval(interval);
//   }, [currentStep]);

//   const validateFrame = async () => {
//     if (!webcamRef.current) return;

//     const frame = webcamRef.current.getScreenshot(); // Capture the current frame
//     const formData = new FormData();
//     formData.append("frame", frame);
//     formData.append("instruction", instructions[currentStep]);

//     try {
//       const response = await axios.post(
//         "http://127.0.0.1:5000/validate_frame",
//         formData,
//         {
//           headers: { "Content-Type": "multipart/form-data" },
//         }
//       );

//       if (response.data.status === "success") {
//         setBorderColor("green");
//         setMessage(response.data.message);

//         // Capture the frame only if movement is validated
//         if (response.data.movementValid) {
//           captureFrame(frame);
//         }
//       } else {
//         setBorderColor("red");
//         setMessage(response.data.message);
//       }
//     } catch (error) {
//       setBorderColor("red");
//       setMessage("Error validating face. Try again.");
//     }
//   };

//   const captureFrame = (frame) => {
//     setCapturedImages((prev) => [...prev, frame]);

//     // Move to the next instruction
//     if (currentStep < instructions.length - 1) {
//       setCurrentStep((prev) => prev + 1);
//       setInstruction(instructions[currentStep + 1]);
//     } else {
//       setIsProcessing(true);
//       analyzeGender(); // Once all instructions are completed
//     }
//   };

//   const analyzeGender = async () => {
//     const formData = new FormData();
//     capturedImages.forEach((img, index) =>
//       formData.append(`images[${index}]`, img)
//     );

//     try {
//       const response = await axios.post(
//         "http://127.0.0.1:5000/analyze_gender",
//         formData,
//         { headers: { "Content-Type": "multipart/form-data" } }
//       );

//       if (response.data.status === "success") {
//         setGender(response.data.gender); // Display detected gender
//         setMessage(`Detected Gender: ${response.data.gender}`);
//       } else {
//         setMessage("Error analyzing gender.");
//       }
//     } catch (error) {
//       setMessage("Error analyzing gender.");
//     } finally {
//       setIsProcessing(false);
//     }
//   };

//   return (
//     <div className="auth-container" style={{ textAlign: "center" }}>
//       <h1>Face Verification</h1>
//       <div
//         className="camera-container"
//         style={{
//           border: `5px solid ${borderColor}`,
//           borderRadius: "50%",
//           width: "300px",
//           height: "300px",
//           overflow: "hidden",
//           margin: "20px auto",
//           position: "relative",
//         }}
//       >
//         <Webcam
//           ref={webcamRef}
//           screenshotFormat="image/jpeg"
//           videoConstraints={{
//             width: 300,
//             height: 300,
//             facingMode: "user",
//           }}
//           style={{ width: "100%", height: "100%" }}
//         />
//       </div>

//       <p
//         style={{
//           color: borderColor === "green" ? "green" : "red",
//           marginTop: "10px",
//         }}
//       >
//         {message}
//       </p>

//       <p>{instruction}</p>

//       {isProcessing && <p>Processing gender analysis...</p>}
//       {gender && <p>Final Gender: {gender}</p>}
//     </div>
//   );
// };

// export default AuthPage;



















// import React, { useEffect, useRef, useState } from "react";
// import Webcam from "react-webcam";
// import axios from "axios";

// const AuthPage = () => {
//   const webcamRef = useRef(null);
//   const [instruction, setInstruction] = useState("Move your face to the right");
//   const [borderColor, setBorderColor] = useState("red");
//   const [message, setMessage] = useState("Position your face in the frame.");
//   const [currentStep, setCurrentStep] = useState(0);
//   const [capturedImages, setCapturedImages] = useState([]);
//   const [isProcessing, setIsProcessing] = useState(false);
//   const [gender, setGender] = useState(null);

//   // Movement instructions
//   const instructions = [
//     "Move your face to the right",
//     "Move your face to the left",
//     "Move your face up",
//     "Move your face down",
//   ];

//   useEffect(() => {
//     const interval = setInterval(() => {
//       validateFrame();
//     }, 800); // Validate frame every 800ms
//     return () => clearInterval(interval);
//   }, [currentStep]);

//   const validateFrame = async () => {
//     if (!webcamRef.current) return;

//     const frame = webcamRef.current.getScreenshot(); // Capture the current frame
//     const formData = new FormData();
//     formData.append("frame", frame);
//     formData.append("instruction", instructions[currentStep]);

//     try {
//       const response = await axios.post(
//         "http://127.0.0.1:5000/validate_frame",
//         formData,
//         {
//           headers: { "Content-Type": "multipart/form-data" },
//         }
//       );

//       if (response.data.status === "success") {
//         setBorderColor("green");
//         setMessage(response.data.message);

//         if (response.data.movementValid) {
//           captureFrame(frame); // Capture the frame for this movement
//         }
//       } else {
//         setBorderColor("red");
//         setMessage(response.data.message);
//       }
//     } catch (error) {
//       setBorderColor("red");
//       setMessage("Error validating face. Try again.");
//     }
//   };

//   const captureFrame = (frame) => {
//     setCapturedImages((prev) => [...prev, frame]);

//     // Move to the next instruction
//     if (currentStep < instructions.length - 1) {
//       setCurrentStep((prev) => prev + 1);
//       setInstruction(instructions[currentStep + 1]);
//     } else {
//       setIsProcessing(true);
//       analyzeGender(); // Once all instructions are completed
//     }
//   };

//   const analyzeGender = async () => {
//     const formData = new FormData();
//     capturedImages.forEach((img, index) =>
//       formData.append(`images[${index}]`, img)
//     );

//     try {
//       const response = await axios.post(
//         "http://127.0.0.1:5000/analyze_gender",
//         formData,
//         { headers: { "Content-Type": "multipart/form-data" } }
//       );

//       if (response.data.status === "success") {
//         setGender(response.data.gender); // Display detected gender
//         setMessage(`Detected Gender: ${response.data.gender}`);
//       } else {
//         setMessage("Error analyzing gender.");
//       }
//     } catch (error) {
//       setMessage("Error analyzing gender.");
//     } finally {
//       setIsProcessing(false);
//     }
//   };

//   return (
//     <div className="auth-container" style={{ textAlign: "center" }}>
//       <h1>Face Verification</h1>
//       <div
//         className="camera-container"
//         style={{
//           border: `5px solid ${borderColor}`,
//           borderRadius: "50%",
//           width: "300px",
//           height: "300px",
//           overflow: "hidden",
//           margin: "20px auto",
//           position: "relative",
//         }}
//       >
//         <Webcam
//           ref={webcamRef}
//           screenshotFormat="image/jpeg"
//           videoConstraints={{
//             width: 300,
//             height: 300,
//             facingMode: "user",
//           }}
//           style={{ width: "100%", height: "100%" }}
//         />
//       </div>

//       <p
//         style={{
//           color: borderColor === "green" ? "green" : "red",
//           marginTop: "10px",
//         }}
//       >
//         {message}
//       </p>

//       <p>{instruction}</p>

//       {isProcessing && <p>Processing gender analysis...</p>}
//       {gender && <p>Final Gender: {gender}</p>}
//     </div>
//   );
// };

// export default AuthPage;

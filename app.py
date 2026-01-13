# from flask import Flask, request, Response, jsonify
# import cv2
# import numpy as np
# from deepface import DeepFace

# app = Flask(__name__)

# def check_blurriness(image):
#     """Check if the image is blurry by calculating the Laplacian variance."""
#     gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)  # Convert to grayscale
#     variance = cv2.Laplacian(gray, cv2.CV_64F).var()  # Calculate variance of the Laplacian
#     return variance

# def detect_face(image):
#     """Detect faces in the image using OpenCV's Haar Cascade Classifier."""
#     face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + "haarcascade_frontalface_default.xml")
#     gray_image = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)  # Convert the image to grayscale
#     faces = face_cascade.detectMultiScale(gray_image, scaleFactor=1.1, minNeighbors=5, minSize=(50, 50))
#     return faces  # Return the detected faces

# @app.route("/validate_frame", methods=["POST"])
# def validate_frame():
#     """Validate a single frame for face detection, brightness, and blurriness."""
#     file = request.files["frame"]
#     np_img = np.frombuffer(file.read(), np.uint8)
#     image = cv2.imdecode(np_img, cv2.IMREAD_COLOR)

#     faces = detect_face(image)
#     sharpness = check_blurriness(image)

#     if len(faces) == 0:
#         return jsonify({"status": "error", "message": "No face detected."})
#     elif sharpness < 60:
#         return jsonify({"status": "error", "message": "Face is blurry or Adjust lighting or position."})
#     else:
#         return jsonify({"status": "success", "message": "Face detected and clear."})

# @app.route("/analyze_gender", methods=["POST"])
# def analyze_gender():
#     file = request.files["image"]
#     np_img = np.frombuffer(file.read(), np.uint8)
#     image = cv2.imdecode(np_img, cv2.IMREAD_COLOR)

#     temp_image_path = "captured_image.jpg"
#     cv2.imwrite(temp_image_path, image)

#     try:
#         results = DeepFace.analyze(img_path=temp_image_path, actions=["gender"], enforce_detection=False)
#         gender_probabilities = results[0]["gender"] if isinstance(results, list) else results["gender"]
#         detected_gender = max(gender_probabilities, key=gender_probabilities.get)
#         confidence = gender_probabilities[detected_gender] 

#         return jsonify({"status": "success", "gender": f"{detected_gender}: {confidence:.4f}%"})
#     except Exception as e:
#         return jsonify({"status": "error", "message": str(e)})
#     finally:
#         import os
#         if os.path.exists(temp_image_path):
#             os.remove(temp_image_path)

# if __name__ == "__main__":
#     app.run(debug=True)





































# from flask import Flask, request, jsonify
# import cv2
# import numpy as np
# from deepface import DeepFace
# import time

# app = Flask(__name__)

# def detect_face(image):
#     """Detect faces in the image using OpenCV's Haar Cascade Classifier."""
#     face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + "haarcascade_frontalface_default.xml")
#     gray_image = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)  # Convert the image to grayscale
#     faces = face_cascade.detectMultiScale(gray_image, scaleFactor=1.1, minNeighbors=5, minSize=(50, 50))
#     return faces  # Return the detected faces

# def check_face_movement(face_positions):
#     """Check if the face has moved in all required directions."""
#     directions = {"left": False, "right": False, "up": False, "down": False}

#     # Loop through the face positions to determine movement
#     for i in range(1, len(face_positions)):
#         x_diff = face_positions[i][0] - face_positions[i - 1][0]
#         y_diff = face_positions[i][1] - face_positions[i - 1][1]

#         if x_diff > 20:  # Moved right
#             directions["right"] = True
#         elif x_diff < -20:  # Moved left
#             directions["left"] = True

#         if y_diff > 20:  # Moved down
#             directions["down"] = True
#         elif y_diff < -20:  # Moved up
#             directions["up"] = True

#     return all(directions.values())  # Return True if all directions are covered

# @app.route("/validate_movement", methods=["POST"])
# def validate_movement():
#     """Validate the face movement and ensure authenticity."""
#     frames = request.files.getlist("frames")  # Receive multiple frames from the frontend
#     face_positions = []

#     for file in frames:
#         np_img = np.frombuffer(file.read(), np.uint8)
#         image = cv2.imdecode(np_img, cv2.IMREAD_COLOR)
#         faces = detect_face(image)

#         if len(faces) == 0:
#             return jsonify({"status": "error", "message": "Face not detected in all frames. Ensure proper lighting and positioning."})

#         # Track the position of the first detected face
#         x, y, w, h = faces[0]
#         face_positions.append((x, y))

#     if not check_face_movement(face_positions):
#         return jsonify({"status": "error", "message": "Face movement incomplete. Please move your face as instructed."})

#     return jsonify({"status": "success", "message": "Face movement verified successfully."})

# @app.route("/analyze_gender", methods=["POST"])
# def analyze_gender():
#     """Analyze the gender of the provided image."""
#     file = request.files["image"]
#     np_img = np.frombuffer(file.read(), np.uint8)
#     image = cv2.imdecode(np_img, cv2.IMREAD_COLOR)

#     temp_image_path = "captured_image.jpg"
#     cv2.imwrite(temp_image_path, image)

#     try:
#         results = DeepFace.analyze(img_path=temp_image_path, actions=["gender"], enforce_detection=False)
#         gender_probabilities = results[0]["gender"] if isinstance(results, list) else results["gender"]
#         detected_gender = max(gender_probabilities, key=gender_probabilities.get)
#         confidence = gender_probabilities[detected_gender]

#         return jsonify({"status": "success", "gender": f"{detected_gender}: {confidence:.4f}%"})
#     except Exception as e:
#         return jsonify({"status": "error", "message": str(e)})
#     finally:
#         import os
#         if os.path.exists(temp_image_path):
#             os.remove(temp_image_path)

# if __name__ == "__main__":
#     app.run(debug=True)






















# from flask import Flask, request, jsonify
# import cv2
# import numpy as np
# from deepface import DeepFace

# app = Flask(__name__)

# # Constants
# MOVEMENT_THRESHOLD = 20  # Minimum pixel movement to consider valid

# def detect_face(image):
#     """Detect faces in the image using OpenCV's Haar Cascade Classifier."""
#     face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + "haarcascade_frontalface_default.xml")
#     gray_image = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)  # Convert the image to grayscale
#     faces = face_cascade.detectMultiScale(gray_image, scaleFactor=1.1, minNeighbors=5, minSize=(50, 50))
#     return faces  # Return the detected faces

# def draw_wireframe(image, x, y, w, h):
#     """Draw a wireframe mask on the detected face."""
#     center = (x + w // 2, y + h // 2)
#     axes = (w // 2, h // 3)  # Adjust the axes for an oval wireframe
#     cv2.ellipse(image, center, axes, 0, 0, 360, (0, 255, 0), 2)  # Green wireframe

# def validate_movement_sequence(face_positions):
#     """Validate if the face moved in the required sequence: left → right → up → down."""
#     directions = {"left": False, "right": False, "up": False, "down": False}

#     for i in range(1, len(face_positions)):
#         x_diff = face_positions[i][0] - face_positions[i - 1][0]
#         y_diff = face_positions[i][1] - face_positions[i - 1][1]

#         if x_diff < -MOVEMENT_THRESHOLD:  # Moved left
#             directions["left"] = True
#         elif x_diff > MOVEMENT_THRESHOLD:  # Moved right
#             directions["right"] = True
#         if y_diff < -MOVEMENT_THRESHOLD:  # Moved up
#             directions["up"] = True
#         elif y_diff > MOVEMENT_THRESHOLD:  # Moved down
#             directions["down"] = True

#     # Check if all movements have been performed
#     return all(directions.values())

# @app.route("/validate_movement", methods=["POST"])
# def validate_movement():
#     """Validate the face movement and ensure authenticity."""
#     frames = request.files.getlist("frames")  # Receive multiple frames from the frontend
#     face_positions = []

#     for file in frames:
#         np_img = np.frombuffer(file.read(), np.uint8)
#         image = cv2.imdecode(np_img, cv2.IMREAD_COLOR)
#         faces = detect_face(image)

#         if len(faces) == 0:
#             return jsonify({"status": "error", "message": "Face not detected in all frames. Ensure proper lighting and positioning."})

#         # Draw wireframe on the face
#         x, y, w, h = faces[0]
#         draw_wireframe(image, x, y, w, h)
#         face_positions.append((x, y))

#     if not validate_movement_sequence(face_positions):
#         return jsonify({"status": "error", "message": "Face movement incomplete. Please move your face as instructed."})

#     return jsonify({"status": "success", "message": "Face movement verified successfully."})

# @app.route("/analyze_gender", methods=["POST"])
# def analyze_gender():
#     """Analyze the gender of the provided image."""
#     file = request.files["image"]
#     np_img = np.frombuffer(file.read(), np.uint8)
#     image = cv2.imdecode(np_img, cv2.IMREAD_COLOR)

#     temp_image_path = "captured_image.jpg"
#     cv2.imwrite(temp_image_path, image)

#     try:
#         results = DeepFace.analyze(img_path=temp_image_path, actions=["gender"], enforce_detection=False)
#         gender_probabilities = results[0]["gender"] if isinstance(results, list) else results["gender"]
#         detected_gender = max(gender_probabilities, key=gender_probabilities.get)
#         confidence = gender_probabilities[detected_gender]

#         return jsonify({"status": "success", "gender": f"{detected_gender}: {confidence:.2f}%"})
#     except Exception as e:
#         return jsonify({"status": "error", "message": str(e)})
#     finally:
#         import os
#         if os.path.exists(temp_image_path):
#             os.remove(temp_image_path)

# if __name__ == "__main__":
#     app.run(debug=True)





















# from flask import Flask, request, jsonify
# import cv2
# import numpy as np
# from deepface import DeepFace

# app = Flask(__name__)

# MOVEMENT_THRESHOLD = 20  # Minimum pixel movement to validate a direction

# def detect_face(image):
#     """Detect faces in the image using OpenCV's Haar Cascade Classifier."""
#     face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + "haarcascade_frontalface_default.xml")
#     gray_image = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)  # Convert the image to grayscale
#     faces = face_cascade.detectMultiScale(gray_image, scaleFactor=1.1, minNeighbors=5, minSize=(50, 50))
#     return faces  # Return the detected faces

# def draw_wireframe(image, x, y, w, h):
#     """Draw a wireframe mask on the detected face."""
#     center = (x + w // 2, y + h // 2)
#     axes = (w // 2, h // 3)  # Adjust axes for the ellipse
#     cv2.ellipse(image, center, axes, 0, 0, 360, (0, 255, 0), 2)  # Green wireframe

# def check_face_movement(face_positions):
#     """Check if the face has moved in all required directions."""
#     directions = {"left": False, "right": False, "up": False, "down": False}

#     # Iterate through face positions to determine movement
#     for i in range(1, len(face_positions)):
#         x_diff = face_positions[i][0] - face_positions[i - 1][0]
#         y_diff = face_positions[i][1] - face_positions[i - 1][1]

#         if x_diff > MOVEMENT_THRESHOLD:  # Moved right
#             directions["right"] = True
#         elif x_diff < -MOVEMENT_THRESHOLD:  # Moved left
#             directions["left"] = True

#         if y_diff < -MOVEMENT_THRESHOLD:  # Moved up
#             directions["up"] = True
#         elif y_diff > MOVEMENT_THRESHOLD:  # Moved down
#             directions["down"] = True

#     return all(directions.values())  # Return True if all movements are completed

# @app.route("/validate_movement", methods=["POST"])
# def validate_movement():
#     """Validate the face movement and ensure the authenticity of the user."""
#     frames = request.files.getlist("frames")  # Receive multiple frames from the frontend
#     face_positions = []

#     for file in frames:
#         np_img = np.frombuffer(file.read(), np.uint8)
#         image = cv2.imdecode(np_img, cv2.IMREAD_COLOR)
#         faces = detect_face(image)

#         if len(faces) == 0:
#             return jsonify({"status": "error", "message": "Face not detected in all frames. Ensure proper lighting and positioning."})

#         # Get the first detected face and track its position
#         x, y, w, h = faces[0]
#         face_positions.append((x, y))

#         # Draw wireframe on the detected face
#         draw_wireframe(image, x, y, w, h)

#     if not check_face_movement(face_positions):
#         return jsonify({"status": "error", "message": "Face movement incomplete. Please follow the instructions: right, left, up, down."})

#     return jsonify({"status": "success", "message": "Face movement verified successfully."})

# @app.route("/analyze_gender", methods=["POST"])
# def analyze_gender():
#     """Analyze the gender of the user from the provided image."""
#     file = request.files["image"]
#     np_img = np.frombuffer(file.read(), np.uint8)
#     image = cv2.imdecode(np_img, cv2.IMREAD_COLOR)

#     temp_image_path = "captured_image.jpg"
#     cv2.imwrite(temp_image_path, image)

#     try:
#         # Use DeepFace to analyze gender
#         results = DeepFace.analyze(img_path=temp_image_path, actions=["gender"], enforce_detection=False)
#         gender_probabilities = results[0]["gender"] if isinstance(results, list) else results["gender"]
#         detected_gender = max(gender_probabilities, key=gender_probabilities.get)
#         confidence = gender_probabilities[detected_gender]

#         return jsonify({"status": "success", "gender": f"{detected_gender}: {confidence:.2f}%"})
#     except Exception as e:
#         return jsonify({"status": "error", "message": str(e)})
#     finally:
#         # Clean up temporary image file
#         import os
#         if os.path.exists(temp_image_path):
#             os.remove(temp_image_path)

# if __name__ == "__main__":
#     app.run(debug=True)














# from flask import Flask, request, jsonify
# import cv2
# import numpy as np
# from deepface import DeepFace

# app = Flask(__name__)

# MOVEMENT_THRESHOLD = 10
# POSITIONS = ["front", "right", "left", "up", "down"]
# captured_positions = []

# def detect_face(image):
#     face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + "haarcascade_frontalface_default.xml")
#     gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
#     faces = face_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5, minSize=(50, 50))
#     return faces

# @app.route("/validate_frame", methods=["POST"])
# def validate_frame():
#     """Validate a single frame for face detection."""
#     if "frame" not in request.files:
#         return jsonify({"status": "error", "message": "No frame data received."}), 400

#     file = request.files["frame"]  # Get the frame
#     try:
#         np_img = np.frombuffer(file.read(), np.uint8)
#         image = cv2.imdecode(np_img, cv2.IMREAD_COLOR)

#         faces = detect_face(image)
#         if len(faces) == 0:
#             return jsonify({"status": "error", "message": "No face detected. Ensure your face is in the frame."})

#         return jsonify({"status": "success", "message": "Face detected. Follow the instruction."})
#     except Exception as e:
#         return jsonify({"status": "error", "message": f"Error processing frame: {str(e)}"}), 500

# @app.route("/analyze_gender", methods=["POST"])
# def analyze_gender():
#     images = request.files.getlist("images[]")
#     gender_results = []

#     for image in images:
#         np_img = np.frombuffer(image.read(), np.uint8)
#         img = cv2.imdecode(np_img, cv2.IMREAD_COLOR)
#         try:
#             results = DeepFace.analyze(img_path=img, actions=["gender"], enforce_detection=False)
#             gender = max(results["gender"], key=results["gender"].get)
#             gender_results.append(gender)
#         except Exception as e:
#             return jsonify({"status": "error", "message": str(e)})

#     # Majority vote for final gender
#     final_gender = max(set(gender_results), key=gender_results.count)
#     return jsonify({"status": "success", "gender": final_gender})

# if __name__ == "__main__":
#     app.run(debug=True)






















# from flask import Flask, request, jsonify
# import cv2
# import numpy as np
# from deepface import DeepFace

# app = Flask(__name__)

# def detect_face(image):
#     """Detect faces using Haar Cascade."""
#     face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + "haarcascade_frontalface_default.xml")
#     gray_image = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
#     faces = face_cascade.detectMultiScale(gray_image, scaleFactor=1.1, minNeighbors=5, minSize=(50, 50))
#     return faces

# @app.route("/validate_frame", methods=["POST"])
# def validate_frame():
#     """Validate the frame and provide real-time feedback."""
#     if "frame" not in request.files:
#         return jsonify({"status": "error", "message": "No frame received."})

#     file = request.files["frame"]
#     np_frame = np.frombuffer(file.read(), np.uint8)
#     image = cv2.imdecode(np_frame, cv2.IMREAD_COLOR)

#     faces = detect_face(image)
#     if len(faces) == 0:
#         return jsonify({"status": "error", "message": "No face detected. Ensure your face is in the frame."})

#     return jsonify({"status": "success", "message": "Face detected. Follow the instruction."})

# @app.route("/analyze_gender", methods=["POST"])
# def analyze_gender():
#     """Analyze gender from multiple images."""
#     images = request.files.getlist("images[]")
#     gender_results = []

#     for image in images:
#         np_img = np.frombuffer(image.read(), np.uint8)
#         img = cv2.imdecode(np_img, cv2.IMREAD_COLOR)
#         try:
#             results = DeepFace.analyze(img_path=img, actions=["gender"], enforce_detection=False)
#             gender = max(results["gender"], key=results["gender"].get)
#             gender_results.append(gender)
#         except Exception as e:
#             return jsonify({"status": "error", "message": str(e)})

#     # Majority vote for final gender
#     final_gender = max(set(gender_results), key=gender_results.count)
#     return jsonify({"status": "success", "gender": final_gender})

# if __name__ == "__main__":
#     app.run(debug=True)























# from flask import Flask, request, jsonify
# import cv2
# import numpy as np
# import base64

# app = Flask(__name__)

# def detect_face(image):
#     """Detect faces using Haar Cascade."""
#     face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + "haarcascade_frontalface_default.xml")
#     gray_image = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
#     faces = face_cascade.detectMultiScale(gray_image, scaleFactor=1.1, minNeighbors=5, minSize=(50, 50))
#     return faces

# @app.route("/validate_frame", methods=["POST"])
# def validate_frame():
#     """Validate the frame and provide real-time feedback."""
#     data = request.form.get("frame")
#     if not data:
#         return jsonify({"status": "error", "message": "No frame received."}), 400

#     # Decode the Base64 frame
#     try:
#         base64_data = data.split(",")[1]  # Extract Base64 data after the header
#         img_data = base64.b64decode(base64_data)
#         np_img = np.frombuffer(img_data, np.uint8)
#         image = cv2.imdecode(np_img, cv2.IMREAD_COLOR)
#     except Exception as e:
#         return jsonify({"status": "error", "message": f"Error decoding frame: {str(e)}"}), 500

#     faces = detect_face(image)
#     if len(faces) == 0:
#         return jsonify({"status": "error", "message": "No face detected. Ensure your face is in the frame."})

#     return jsonify({"status": "success", "message": "Face detected. Follow the instruction."})

# if __name__ == "__main__":
#     app.run(debug=True)


















# from flask import Flask, request, jsonify
# import cv2
# import numpy as np
# from deepface import DeepFace

# app = Flask(__name__)

# MOVEMENT_THRESHOLD = 10

# def detect_face(image):
#     """Detect faces using Haar Cascade."""
#     face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + "haarcascade_frontalface_default.xml")
#     gray_image = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
#     faces = face_cascade.detectMultiScale(gray_image, scaleFactor=1.1, minNeighbors=5, minSize=(50, 50))
#     return faces

# @app.route("/validate_frame", methods=["POST"])
# def validate_frame():
#     """Validate the frame and provide feedback for face movement."""
#     frame = request.form.get("frame")
#     instruction = request.form.get("instruction")
#     if not frame or not instruction:
#         return jsonify({"status": "error", "message": "No frame or instruction received."})

#     # Decode Base64 frame
#     try:
#         base64_data = frame.split(",")[1]
#         img_data = np.frombuffer(base64.b64decode(base64_data), np.uint8)
#         image = cv2.imdecode(img_data, cv2.IMREAD_COLOR)
#     except Exception as e:
#         return jsonify({"status": "error", "message": f"Error decoding frame: {str(e)}"})

#     faces = detect_face(image)
#     if len(faces) == 0:
#         return jsonify({"status": "error", "message": "No face detected. Ensure your face is in the frame."})

#     # Movement validation
#     x, y, w, h = faces[0]
#     if instruction == "Move your face to the right" and x > MOVEMENT_THRESHOLD:
#         return jsonify({"status": "success", "message": "Face moved right.", "movementValid": True})
#     elif instruction == "Move your face to the left" and x < -MOVEMENT_THRESHOLD:
#         return jsonify({"status": "success", "message": "Face moved left.", "movementValid": True})
#     elif instruction == "Move your face up" and y < -MOVEMENT_THRESHOLD:
#         return jsonify({"status": "success", "message": "Face moved up.", "movementValid": True})
#     elif instruction == "Move your face down" and y > MOVEMENT_THRESHOLD:
#         return jsonify({"status": "success", "message": "Face moved down.", "movementValid": True})

#     return jsonify({"status": "error", "message": "Move your face as instructed.", "movementValid": False})

# @app.route("/analyze_gender", methods=["POST"])
# def analyze_gender():
#     """Analyze gender from multiple images."""
#     images = request.files.getlist("images[]")
#     gender_results = []

#     for image in images:
#         np_img = np.frombuffer(image.read(), np.uint8)
#         img = cv2.imdecode(np_img, cv2.IMREAD_COLOR)
#         try:
#             results = DeepFace.analyze(img_path=img, actions=["gender"], enforce_detection=False)
#             gender = max(results["gender"], key=results["gender"].get)
#             gender_results.append(gender)
#         except Exception as e:
#             return jsonify({"status": "error", "message": str(e)})

#     final_gender = max(set(gender_results), key=gender_results.count)
#     return jsonify({"status": "success", "gender": final_gender})

# if __name__ == "__main__":
#     app.run(debug=True)











# from flask import Flask, request, jsonify
# import cv2
# import numpy as np
# import base64  # Import the base64 module
# from deepface import DeepFace

# app = Flask(__name__)

# MOVEMENT_THRESHOLD = 10

# def detect_face(image):
#     """Detect faces using Haar Cascade."""
#     face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + "haarcascade_frontalface_default.xml")
#     gray_image = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
#     faces = face_cascade.detectMultiScale(gray_image, scaleFactor=1.1, minNeighbors=5, minSize=(50, 50))
#     return faces

# @app.route("/validate_frame", methods=["POST"])
# def validate_frame():
#     """Validate the frame and provide feedback for face movement."""
#     frame = request.form.get("frame")
#     instruction = request.form.get("instruction")
#     if not frame or not instruction:
#         return jsonify({"status": "error", "message": "No frame or instruction received."})

#     # Decode Base64 frame
#     try:
#         base64_data = frame.split(",")[1]
#         img_data = np.frombuffer(base64.b64decode(base64_data), np.uint8)
#         image = cv2.imdecode(img_data, cv2.IMREAD_COLOR)
#     except Exception as e:
#         return jsonify({"status": "error", "message": f"Error decoding frame: {str(e)}"})

#     faces = detect_face(image)
#     if len(faces) == 0:
#         return jsonify({"status": "error", "message": "No face detected. Ensure your face is in the frame."})

#     # Movement validation
#     x, y, w, h = faces[0]
#     if instruction == "Move your face to the right" and x > MOVEMENT_THRESHOLD:
#         return jsonify({"status": "success", "message": "Face moved right.", "movementValid": True})
#     elif instruction == "Move your face to the left" and x < -MOVEMENT_THRESHOLD:
#         return jsonify({"status": "success", "message": "Face moved left.", "movementValid": True})
#     elif instruction == "Move your face up" and y < -MOVEMENT_THRESHOLD:
#         return jsonify({"status": "success", "message": "Face moved up.", "movementValid": True})
#     elif instruction == "Move your face down" and y > MOVEMENT_THRESHOLD:
#         return jsonify({"status": "success", "message": "Face moved down.", "movementValid": True})

#     return jsonify({"status": "error", "message": "Move your face as instructed.", "movementValid": False})

# @app.route("/analyze_gender", methods=["POST"])
# def analyze_gender():
#     """Analyze gender from multiple images."""
#     images = request.files.getlist("images[]")
#     gender_results = []

#     for image in images:
#         np_img = np.frombuffer(image.read(), np.uint8)
#         img = cv2.imdecode(np_img, cv2.IMREAD_COLOR)
#         try:
#             results = DeepFace.analyze(img_path=img, actions=["gender"], enforce_detection=False)
#             gender = max(results["gender"], key=results["gender"].get)
#             gender_results.append(gender)
#         except Exception as e:
#             return jsonify({"status": "error", "message": str(e)})

#     final_gender = max(set(gender_results), key=gender_results.count)
#     return jsonify({"status": "success", "gender": final_gender})

# if __name__ == "__main__":
#     app.run(debug=True)


































# from flask import Flask, request, jsonify
# import cv2
# import numpy as np
# import base64  # Ensure base64 is imported
# from deepface import DeepFace

# app = Flask(__name__)

# MOVEMENT_THRESHOLD = 10

# def detect_face(image):
#     """Detect faces using Haar Cascade."""
#     face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + "haarcascade_frontalface_default.xml")
#     gray_image = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
#     faces = face_cascade.detectMultiScale(gray_image, scaleFactor=1.1, minNeighbors=5, minSize=(50, 50))
#     return faces

# @app.route("/validate_frame", methods=["POST"])
# def validate_frame():
#     """Validate the frame and provide feedback for face movement."""
#     frame = request.form.get("frame")
#     instruction = request.form.get("instruction")
#     if not frame or not instruction:
#         return jsonify({"status": "error", "message": "No frame or instruction received."})

#     # Decode Base64 frame
#     try:
#         base64_data = frame.split(",")[1]
#         img_data = np.frombuffer(base64.b64decode(base64_data), np.uint8)
#         image = cv2.imdecode(img_data, cv2.IMREAD_COLOR)
#     except Exception as e:
#         return jsonify({"status": "error", "message": f"Error decoding frame: {str(e)}"})

#     faces = detect_face(image)
#     if len(faces) == 0:
#         return jsonify({"status": "error", "message": "No face detected. Ensure your face is in the frame."})

#     # Movement validation
#     x, y, w, h = faces[0]
#     if instruction == "Move your face to the right" and x > MOVEMENT_THRESHOLD:
#         return jsonify({"status": "success", "message": "Face moved right.", "movementValid": True})
#     elif instruction == "Move your face to the left" and x < -MOVEMENT_THRESHOLD:
#         return jsonify({"status": "success", "message": "Face moved left.", "movementValid": True})
#     elif instruction == "Move your face up" and y < -MOVEMENT_THRESHOLD:
#         return jsonify({"status": "success", "message": "Face moved up.", "movementValid": True})
#     elif instruction == "Move your face down" and y > MOVEMENT_THRESHOLD:
#         return jsonify({"status": "success", "message": "Face moved down.", "movementValid": True})

#     return jsonify({"status": "error", "message": "Move your face as instructed.", "movementValid": False})

# @app.route("/analyze_gender", methods=["POST"])
# def analyze_gender():
#     """Analyze gender from multiple images."""
#     images = request.files.getlist("images[]")
#     gender_results = []

#     for image in images:
#         np_img = np.frombuffer(image.read(), np.uint8)
#         img = cv2.imdecode(np_img, cv2.IMREAD_COLOR)
#         try:
#             results = DeepFace.analyze(img_path=img, actions=["gender"], enforce_detection=False)
#             gender = max(results["gender"], key=results["gender"].get)
#             gender_results.append(gender)
#         except Exception as e:
#             return jsonify({"status": "error", "message": str(e)})

#     final_gender = max(set(gender_results), key=gender_results.count)
#     return jsonify({"status": "success", "gender": final_gender})

# if __name__ == "__main__":
#     app.run(debug=True)













from flask import Flask, request, jsonify
import cv2
import numpy as np
import base64  # Ensure base64 is imported
from deepface import DeepFace

app = Flask(__name__)

MOVEMENT_THRESHOLD = 5  # Smaller threshold to detect slight movements

def detect_face(image):
    """Detect faces using Haar Cascade."""
    face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + "haarcascade_frontalface_default.xml")
    gray_image = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    faces = face_cascade.detectMultiScale(gray_image, scaleFactor=1.1, minNeighbors=5, minSize=(50, 50))
    return faces

@app.route("/validate_frame", methods=["POST"])
def validate_frame():
    """Validate the frame and provide feedback for face movement."""
    frame = request.form.get("frame")
    instruction = request.form.get("instruction")
    if not frame or not instruction:
        return jsonify({"status": "error", "message": "No frame or instruction received."})

    # Decode Base64 frame
    try:
        base64_data = frame.split(",")[1]
        img_data = np.frombuffer(base64.b64decode(base64_data), np.uint8)
        image = cv2.imdecode(img_data, cv2.IMREAD_COLOR)
    except Exception as e:
        return jsonify({"status": "error", "message": f"Error decoding frame: {str(e)}"})

    faces = detect_face(image)
    if len(faces) == 0:
        return jsonify({"status": "error", "message": "No face detected. Ensure your face is in the frame."})

    # Movement validation
    x, y, w, h = faces[0]
    if instruction == "Move your face to the right" and x > MOVEMENT_THRESHOLD:
        return jsonify({"status": "success", "message": "Face moved right.", "movementValid": True})
    elif instruction == "Move your face to the left" and x < -MOVEMENT_THRESHOLD:
        return jsonify({"status": "success", "message": "Face moved left.", "movementValid": True})
    elif instruction == "Move your face up" and y < -MOVEMENT_THRESHOLD:
        return jsonify({"status": "success", "message": "Face moved up.", "movementValid": True})
    elif instruction == "Move your face down" and y > MOVEMENT_THRESHOLD:
        return jsonify({"status": "success", "message": "Face moved down.", "movementValid": True})

    return jsonify({"status": "error", "message": "Move your face as instructed.", "movementValid": False})

@app.route("/analyze_gender", methods=["POST"])
def analyze_gender():
    """Analyze gender from multiple images."""
    images = request.files.getlist("images[]")
    gender_results = []

    for image in images:
        np_img = np.frombuffer(image.read(), np.uint8)
        img = cv2.imdecode(np_img, cv2.IMREAD_COLOR)
        try:
            results = DeepFace.analyze(img_path=img, actions=["gender"], enforce_detection=False)
            gender = max(results["gender"], key=results["gender"].get)
            gender_results.append(gender)
        except Exception as e:
            return jsonify({"status": "error", "message": str(e)})

    final_gender = max(set(gender_results), key=gender_results.count)
    return jsonify({"status": "success", "gender": final_gender})

if __name__ == "__main__":
    app.run(debug=True)

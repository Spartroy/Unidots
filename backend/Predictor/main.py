from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
import numpy as np
from PIL import Image
import tensorflow as tf
import io

app = FastAPI()

# Allow your frontend origin in production!
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load your trained model
model = tf.keras.models.load_model("DotDeformationDetector.h5")  # <-- path to your .h5

IMG_SIZE = (180, 180)  # Use your actual input size

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    contents = await file.read()
    img = Image.open(io.BytesIO(contents)).convert("RGB")
    img = img.resize(IMG_SIZE)
    img_array = np.array(img) / 255.0  # Normalize
    img_array = np.expand_dims(img_array, axis=0)  # (1, H, W, 3)

    # Run prediction
    prediction = model.predict(img_array)[0]
    probability = float(prediction[0])
    predicted_class = "good" if probability > 0.5 else "bad"
    confidence = probability if probability > 0.5 else 1 - probability

    return {
        "class": predicted_class,
        "confidence": confidence,
        "probability": probability
    }

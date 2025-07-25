from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from PIL import Image
import io
import numpy as np
from skimage.feature import local_binary_pattern
from skimage.color import rgb2gray
import cv2

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/classify-rice")
async def classify_rice(file: UploadFile = File(...)):
    print(f"Received file: {file.filename}, content type: {file.content_type}")
    try:
        # Verify image format
        if file.content_type not in ["image/jpeg", "image/png"]:
            raise HTTPException(status_code=400, detail="Invalid file format. Only JPEG or PNG allowed.")
        
        # Read and validate image
        image_data = await file.read()
        try:
            image = Image.open(io.BytesIO(image_data))
            image.verify()  # Verify image integrity
            image = Image.open(io.BytesIO(image_data))  # Reopen for processing
            if image.mode != "RGB":
                image = image.convert("RGB")
            image_array = np.array(image)
            if image_array.size == 0 or np.all(image_array == 0):
                raise HTTPException(status_code=400, detail="Image is empty or invalid.")
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Invalid image: {str(e)}")

        # Resize image for consistent processing
        image = image.resize((256, 256))
        image_array = np.array(image)

        # Extract features
        # 1. Color histogram (RGB channels)
        color_hist = []
        for channel in range(3):  # R, G, B
            hist = cv2.calcHist([image_array], [channel], None, [32], [0, 256])
            hist = hist.flatten() / hist.sum()  # Normalize
            color_hist.extend(hist)
        
        # 2. Texture using Local Binary Patterns (LBP)
        gray_image = rgb2gray(image_array)
        lbp = local_binary_pattern(gray_image, P=8, R=1, method="uniform")
        lbp_hist, _ = np.histogram(lbp.ravel(), bins=np.arange(0, 11), density=True)

        # Combine features
        features = np.concatenate([color_hist, lbp_hist])

        # Heuristic classification based on features
        avg_color = np.mean(image_array, axis=(0, 1))  # Average RGB
        r, g, b = avg_color
        lbp_score = np.mean(lbp_hist)  # Average LBP for texture

        # Initialize response
        result = {"rice_type": None, "message": "No rice type identified"}

        # Classification logic
        if r > 200 and g > 200 and b > 180 and lbp_score < 0.15:  # Jasmine: bright, smooth
            result["rice_type"] = "Jasmine Rice"
        elif r > 180 and g > 180 and b > 160 and lbp_score < 0.2:  # Basmati: off-white, fine
            result["rice_type"] = "Basmati Rice"
        elif r > 150 and g > 120 and b < 100 and lbp_score > 0.2:  # Brown: brownish, rough
            result["rice_type"] = "Brown Rice"
        elif r > 150 and g > 150 and b > 150 and lbp_score > 0.15:  # Glutinous: translucent, sticky
            result["rice_type"] = "Glutinous Rice"
        else:
            result["message"] = "Alert: No rice type detected in the image"

        # If a rice type was identified, update the message
        if result["rice_type"]:
            result["message"] = f"Detected rice type: {result['rice_type']}"

        print(f"Average RGB: ({r:.2f}, {g:.2f}, {b:.2f}), LBP Score: {lbp_score:.4f}")
        print("Response:", result)
        return result
    except HTTPException as e:
        print(f"HTTP error: {str(e)}")
        raise e
    except Exception as e:
        print(f"Error processing file: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Server error: {str(e)}")

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
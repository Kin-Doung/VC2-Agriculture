
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from PIL import Image
import io
import random

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
        # Verify image is valid
        if file.content_type not in ["image/jpeg", "image/png"]:
            raise HTTPException(status_code=400, detail="Invalid file format. Only JPEG or PNG allowed.")
        
        # Read and validate image
        image_data = await file.read()
        try:
            image = Image.open(io.BytesIO(image_data))
            image.verify()  # Verify image integrity
            image = Image.open(io.BytesIO(image_data))  # Reopen for processing
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Invalid image: {str(e)}")

        # Assign 99% to Jasmine Rice, distribute remaining 1% to others
        rice_types = {
            "Jasmine Rice": 99.0,
            "Basmati Rice": round(random.uniform(0.1, 0.7), 2),
            "Brown Rice": round(random.uniform(0.1, 0.7), 2),
            "Glutinous Rice": round(random.uniform(0.1, 0.7), 2),
        }
        remaining = sum(rice_types.values()) - 99.0
        normalized_rice_types = {
            "Jasmine Rice": 99.0,
            "Basmati Rice": round((rice_types["Basmati Rice"] / remaining) * 1.0, 2),
            "Brown Rice": round((rice_types["Brown Rice"] / remaining) * 1.0, 2),
            "Glutinous Rice": round((rice_types["Glutinous Rice"] / remaining) * 1.0, 2),
        }
        print("Response:", normalized_rice_types)
        return {"rice_types": normalized_rice_types}
    except HTTPException as e:
        print(f"HTTP error: {str(e)}")
        raise e
    except Exception as e:
        print(f"Error processing file: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Server error: {str(e)}")

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)

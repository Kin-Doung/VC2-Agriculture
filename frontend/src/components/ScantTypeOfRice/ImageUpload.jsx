import { useRef } from "react";
import { Button } from "../ui/Button";

export default function ImageUpload({ onImageUpload }) {
  const inputRef = useRef(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        onImageUpload(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div>
      <input
        type="file"
        accept="image/*"
        ref={inputRef}
        onChange={handleFileChange}
        className="hidden"
      />
      <Button
        onClick={() => inputRef.current?.click()}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white"
      >
        Upload Image
      </Button>
    </div>
  );
}
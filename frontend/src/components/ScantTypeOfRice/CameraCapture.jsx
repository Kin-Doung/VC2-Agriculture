import { useEffect, useRef, useState } from "react";

export default function CameraCapture({ onImageCapture }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [error, setError] = useState(null);
  const [streamActive, setStreamActive] = useState(false);

  useEffect(() => {
    async function startCamera() {
      setError(null);
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
          audio: false,
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setStreamActive(true);
        }
      } catch (err) {
        setError("Cannot access camera: " + err.message);
      }
    }

    startCamera();

    // Cleanup on unmount: stop all tracks
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const captureImage = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const dataUrl = canvas.toDataURL("image/jpeg");
    if (onImageCapture) onImageCapture(dataUrl);
  };

  return (
    <div className="flex flex-col items-center">
      {error && <p className="text-red-600 mb-2">{error}</p>}

      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        className="w-full max-w-xs rounded-lg border border-gray-300"
        style={{ aspectRatio: "4/3", backgroundColor: "#000" }}
      />

      <canvas ref={canvasRef} style={{ display: "none" }} />

      {streamActive && (
        <button
          onClick={captureImage}
          className="mt-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          type="button"
        >
          Capture
        </button>
      )}
    </div>
  );
}

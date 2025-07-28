import React, { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';

const SeedScanner = ({ language }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const chartRef = useRef(null);
  const [chartInstance, setChartInstance] = useState(null);
  const [error, setError] = useState('');
  const [results, setResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        setError(language === 'en' ? `Failed to access camera: ${err.message}` : `បរាជ័យក្នុងការចូលប្រើកាមេរ៉ា: ${err.message}`);
      }
    };
    startCamera();
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      }
    };
  }, [language]);

  useEffect(() => {
    if (results && chartRef.current) {
      if (chartInstance) chartInstance.destroy();
      const ctx = chartRef.current.getContext('2d');
      if (!ctx) {
        setError(language === 'en' ? 'Failed to get chart context' : 'បរាជ័យក្នុងការទទួលបានបរិបទគំនូសតាង');
        return;
      }
      const newChart = new Chart(ctx, {
        type: 'pie',
        data: {
          labels: Object.keys(results),
          datasets: [{
            data: Object.values(results),
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
          }],
        },
        options: {
          responsive: true,
          plugins: {
            legend: { position: 'top' },
            title: {
              display: true,
              text: language === 'en' ? 'Rice Type Distribution' : 'ការចែកចាយប្រភេទអង្ករ',
            },
          },
        },
      });
      setChartInstance(newChart);
    }
  }, [results, language]);

  const captureImage = async () => {
    setIsLoading(true);
    setError('');
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas || !video) {
      setError(language === 'en' ? 'Canvas or video not available' : 'កាមេរ៉ា ឬ ផ្ទាំងក្រណាត់មិនអាចប្រើបាន');
      setIsLoading(false);
      return;
    }

    try {
      const context = canvas.getContext('2d');
      if (!context) {
        setError(language === 'en' ? 'Failed to get canvas context' : 'បរាជ័យក្នុងការទទួលបានបរិបទផ្ទាំងក្រណាត់');
        setIsLoading(false);
        return;
      }
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      canvas.toBlob(
        async (blob) => {
          if (!blob) {
            setError(language === 'en' ? 'Failed to create image Blob' : 'បរាជ័យក្នុងការបង្កើត Blob រូបភាព');
            setIsLoading(false);
            return;
          }

          const formData = new FormData();
          formData.append('file', blob, 'capture.jpg');

          try {
            console.log('Sending request to:', `${API_URL}/classify-rice`);
            const response = await fetch(`${API_URL}/classify-rice`, {
              method: 'POST',
              body: formData,
            });
            console.log('Response status:', response.status);
            if (!response.ok) {
              const errorText = await response.text();
              console.log('Response error:', errorText);
              throw new Error(`Server error: ${response.status} - ${errorText}`);
            }
            const data = await response.json();
            console.log('Response data:', data);
            if (!data.rice_types) {
              throw new Error('Invalid response format: rice_types missing');
            }
            setResults(data.rice_types);
            setIsLoading(false);
          } catch (err) {
            setError(language === 'en' 
              ? `Failed to process image: ${err.message}` 
              : `បរាជ័យក្នុងការដំណើរការរូបភាព: ${err.message}`);
            setIsLoading(false);
          }
        },
        'image/jpeg',
        0.95
      );
    } catch (err) {
      setError(language === 'en' ? `Error capturing image: ${err.message}` : `កំហុសក្នុងការថតរូបភាព: ${err.message}`);
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (e) => {
    setIsLoading(true);
    setError('');
    const file = e.target.files[0];
    if (!file) {
      setError(language === 'en' ? 'No file selected' : 'គ្មានឯកសារត្រូវបានជ្រើសរើស');
      setIsLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      console.log('Sending request to:', `${API_URL}/classify-rice`);
      const response = await fetch(`${API_URL}/classify-rice`, {
        method: 'POST',
        body: formData,
      });
      console.log('Response status:', response.status);
      if (!response.ok) {
        const errorText = await response.text();
        console.log('Response error:', errorText);
        throw new Error(`Server error: ${response.status} - ${errorText}`);
      }
      const data = await response.json();
      console.log('Response data:', data);
      if (!data.rice_types) {
        throw new Error('Invalid response format: rice_types missing');
      }
      setResults(data.rice_types);
      setIsLoading(false);
    } catch (err) {
      setError(language === 'en' 
        ? `Failed to process image: ${err.message}` 
        : `បរាជ័យក្នុងការដំណើរការរូបភាព: ${err.message}`);
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-green-800 mb-4">
        {language === 'en' ? 'Seed Scanner' : 'ស្កេនគ្រាប់ពូជ'}
      </h1>
      <p className="text-green-600 mb-8">
        {language === 'en' ? 'Identify seeds using your camera or upload an image' : 'កំណត់អត្តសញ្ញាណគ្រាប់ពូជដោយប្រើកាមេរ៉ា ឬផ្ទុកឡើងរូបភាព'}
      </p>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <div className="bg-white rounded-lg p-8 shadow-lg text-center">
        <div className="relative">
          <video ref={videoRef} autoPlay className="w-full max-h-64 mb-4 rounded object-cover"></video>
          <div className="absolute top-0 left-0 w-full h-64 border-2 border-dashed border-green-500 pointer-events-none flex items-center justify-center">
            <p className="text-white bg-black bg-opacity-50 p-2">
              {language === 'en' ? 'Place rice grains here' : 'ដាក់គ្រាប់អង្ករនៅទីនេះ'}
            </p>
          </div>
        </div>
        <canvas ref={canvasRef} className="hidden"></canvas>
        <div className="flex justify-center gap-4 mb-4">
          <button
            onClick={captureImage}
            disabled={isLoading}
            className={`bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isLoading ? (language === 'en' ? 'Processing...' : 'កំពុងដំណើរការ...') : (language === 'en' ? 'Capture & Scan' : 'ថតនិងស្កេន')}
          </button>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            disabled={isLoading}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-blue-500 file:text-white hover:file:bg-blue-600"
          />
        </div>
        {results && (
          <div className="mt-8">
            <p className="text-lg font-bold text-green-800">
              {language === 'en' ? 'Predicted Type' : 'ប្រភេទដែលបានទស្សន៍ទាយ'}: {Object.keys(results).reduce((a, b) => (results[a] > results[b] ? a : b))}
            </p>
            <canvas id="riceChart" ref={chartRef} className="w-full max-w-md mx-auto"></canvas>
            <div className="mt-4">
              {Object.entries(results).map(([type, percentage]) => (
                <p key={type} className="text-gray-700">
                  {type}: {percentage.toFixed(2)}%
                </p>
              ))}
            </div>
            <div className="mt-4">
              <p>{language === 'en' ? 'Is the result correct?' : 'តើលទ្ធផលត្រឹមត្រូវទេ?'}</p>
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mr-2"
                onClick={() => alert('Feedback: Correct')}
              >
                {language === 'en' ? 'Yes' : 'បាទ/ចាស'}
              </button>
              <button
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                onClick={() => alert('Feedback: Incorrect')}
              >
                {language === 'en' ? 'No' : 'ទេ'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SeedScanner;
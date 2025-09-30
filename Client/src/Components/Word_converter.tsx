import React, { useState, useRef } from 'react';
import axios from "../Utils/axios"; // Adjust this path as needed
import loading from "../assets/loading.gif"
import inputicon from "../assets/input.png"

const WordConverter = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [downloadUrl, setDownloadUrl] = useState('');
  const [isConverted, setIsConverted] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // State for loading animation
  const [previewUrl, setPreviewUrl] = useState(''); // State for file preview
  const fileInputRef = useRef(null);

  const handleFileChange = async (event) => {
    event.preventDefault();
    const file = event.target.files?.[0] || event.dataTransfer?.files?.[0];
    setSelectedFile(file);

    if (file) {
      const formData = new FormData();
      formData.append('file', file);

      try {
        setIsLoading(true); // Show loading animation
        const response = await axios.post('/wordconverter', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          responseType: 'blob',
        });

        const blob = new Blob([response.data], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        setDownloadUrl(url);
        setPreviewUrl(url); // Set the preview URL for the file
        setIsConverted(true);
      } catch (error) {
        console.error('Error uploading file:', error);
      } finally {
        setIsLoading(false); // Hide loading animation
      }
    }
  };

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
    handleFileChange(event);
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <h2 className="text-4xl font-bold text-gray-800 mt-10">Word to PDF Converter</h2>
      <div
        className={`w-full p-20 text-center mb-20 ${isDragging ? 'bg-blue-100' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {!isConverted && (
          <div className="mb-6">
            <input
              type="file"
              accept=".doc,.docx"
              onChange={handleFileChange}
              className="hidden"
              id="file-upload"
              ref={fileInputRef}
            />
            <label
              htmlFor="file-upload"
              className="cursor-pointer flex flex-col justify-center items-center p-8 border border-dashed border-blue-400 rounded-lg bg-blue-50 hover:bg-blue-100 transition"
              style={{ height: '250px' }}
            >
              {isLoading ? (
                <div className="flex flex-col items-center">
                  <img
                    src={loading} // Adjust the path to your loading GIF
                    alt="Loading..."
                    className="h-20 w-20"
                  />
                  <p className="ml-4 text-gray-500 mt-2">Processing...</p>
                </div>
              ) : selectedFile ? (
                <span className="text-gray-700">{selectedFile.name}</span>
              ) : (
                <div className="text-blue-500 flex flex-col items-center">
                    <img 
                        src={inputicon}
                        alt="Pricing illustration" 
                        className="object-cover"
                    />
                  <button
                    type="button"
                    className="bg-sky-400 text-white py-2 px-4 rounded hover:bg-blue-600 transition"
                    onClick={handleButtonClick}
                  >
                    Choose File
                  </button>
                  <p className="text-sm text-gray-500 mt-1">or drop files here</p>
                </div>
              )}
            </label>
          </div>
        )}

        {isConverted && (
          <div className="mt-6 flex flex-col justify-center items-center border border-dashed border-blue-400 bg-blue-50 rounded-lg">
            <div className="mt-4">
              <iframe
                src={previewUrl}
                title="Preview"
                width="600"
                height="400"
                className="border border-gray-300 rounded-lg"
              ></iframe>
            </div>
            <a
              href={downloadUrl}
              download="converted.pdf"
              className="bg-sky-400 text-white py-3 px-6 rounded-lg hover:bg-blue-600 transition text-center block mb-4 mt-5"
            >
              Download Converted PDF File
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default WordConverter;

import React, { useState, useRef } from 'react';
import { Upload, CheckCircle, FileSpreadsheet, AlertTriangle } from 'lucide-react';
import Button from './ui/Button';
import Card from './ui/Card';

const FileUpload = ({ onFileUpload, uploadProgress, disabled, isCompleted }) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = async (file) => {
    if (file.type !== 'text/csv') {
      alert('Please select a CSV file');
      return;
    }

    setUploadedFile(file);
    try {
      await onFileUpload(file);
    } catch (error) {
      setUploadedFile(null);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <Card className={`p-6 ${disabled ? 'opacity-50' : ''}`}>
      <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <Upload className="w-5 h-5 text-indigo-600" />
        Upload Leads CSV
        {isCompleted && <CheckCircle className="w-5 h-5 text-green-500" />}
      </h2>

      {disabled && (
        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-yellow-600" />
          <span className="text-sm text-yellow-700">
            Please complete the offer information first
          </span>
        </div>
      )}

      {isCompleted && uploadedFile ? (
        // Completed state
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <div className="flex items-center gap-3">
            <FileSpreadsheet className="w-8 h-8 text-green-600" />
            <div>
              <p className="font-medium text-green-900">{uploadedFile.name}</p>
              <p className="text-sm text-green-700">
                Size: {(uploadedFile.size / 1024).toFixed(1)} KB
              </p>
            </div>
          </div>
        </div>
      ) : (
        // Upload interface
        <div className={`${disabled ? 'pointer-events-none' : ''}`}>
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 ${
              dragActive 
                ? 'border-indigo-500 bg-indigo-50' 
                : 'border-gray-300 hover:border-indigo-400 hover:bg-gray-50'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-lg font-medium text-gray-700 mb-2">
              Drag and drop your CSV file here
            </p>
            <p className="text-sm text-gray-500 mb-4">
              Expected columns: name, role, company, industry, location, linkedin_bio
            </p>
            
            <Button
              onClick={triggerFileInput}
              variant="secondary"
              disabled={disabled}
            >
              <FileSpreadsheet className="w-4 h-4" />
              Choose File
            </Button>
            
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          {/* Upload Progress */}
          {uploadProgress > 0 && uploadProgress < 100 && (
            <div className="mt-4">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Uploading...</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Sample CSV Format */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">Expected CSV Format:</h4>
            <div className="text-xs font-mono text-gray-600 bg-white p-3 rounded border overflow-x-auto">
              <div>name,role,company,industry,location,linkedin_bio</div>
              <div>John Smith,CEO,TechCorp,Technology,San Francisco,Experienced tech leader...</div>
              <div>Jane Doe,VP Sales,StartupInc,SaaS,New York,Sales executive with 10+ years...</div>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};

export default FileUpload;
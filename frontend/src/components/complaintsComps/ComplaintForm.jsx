import React, { useState } from 'react';
import { AlertCircle, Upload, X, FileText, Image, Film } from 'lucide-react';
import axios from 'axios';

export function ComplaintForm({ onSubmit, onClose }) {
  const [formData, setFormData] = useState({
    content: "",
    isAnonymous: false,
    file: null
  });

  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [preview, setPreview] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFileChange = (e) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      setFormData(prev => ({
        ...prev,
        file: file
      }));
      
      // Create preview for image files
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreview(reader.result);
        };
        reader.readAsDataURL(file);
      } else {
        setPreview(null);
      }
    }
  };

  const removeFile = () => {
    setFormData(prev => ({
      ...prev,
      file: null
    }));
    setPreview(null);
  };

  const getFileIcon = () => {
    if (!formData.file) return null;
    
    if (formData.file.type.startsWith('image/')) {
      return <Image className="h-5 w-5 mr-2 text-blue-400" />;
    } else if (formData.file.type.startsWith('video/')) {
      return <Film className="h-5 w-5 mr-2 text-red-400" />;
    } else {
      return <FileText className="h-5 w-5 mr-2 text-yellow-400" />;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    // Validation checks
    if (!formData.content || !formData.file) {
      setError("Content and proof file are required.");
      setIsSubmitting(false);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Authentication token not found");

      const formDataToSend = new FormData();
      formDataToSend.append("content", formData.content);
      formDataToSend.append("isAnonymous", formData.isAnonymous);
      formDataToSend.append("file", formData.file);

      // Let parent component handle the actual submission
      await onSubmit(formDataToSend);
      
      // Reset form on success
      setFormData({ content: "", isAnonymous: false, file: null });
      setPreview(null);
      if (onClose) onClose();
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to submit complaint");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-lg shadow-xl border border-gray-700">
      <h2 className="text-xl font-semibold text-gray-200 mb-2">Submit Complaint</h2>
      
      <div>
        <label htmlFor="content" className="block text-sm font-medium text-gray-300">
          Complaint Content
        </label>
        <textarea
          id="content"
          name="content"
          value={formData.content}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md bg-gray-800 border-gray-700 shadow-sm focus:border-purple-500 focus:ring-purple-500 text-gray-200 sm:text-sm"
          rows={4}
          placeholder="Describe your complaint..."
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Proof (Required)
        </label>
        
        {!formData.file ? (
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-700 border-dashed rounded-md bg-gray-800 hover:bg-gray-750">
            <div className="space-y-1 text-center">
              <Upload className="mx-auto h-12 w-12 text-purple-400" />
              <div className="flex text-sm text-gray-400">
                <label className="relative cursor-pointer bg-transparent rounded-md font-medium text-purple-400 hover:text-purple-300">
                  <span>Upload a file</span>
                  <input
                    type="file"
                    className="sr-only"
                    accept="image/*,video/*"
                    onChange={handleFileChange}
                    required
                  />
                </label>
              </div>
              <p className="text-xs text-gray-500">
                PNG, JPG, GIF, MP4 up to 10MB
              </p>
            </div>
          </div>
        ) : (
          <div className="border rounded-md border-gray-700 bg-gray-800 overflow-hidden">
            {/* File Preview Header */}
            <div className="flex items-center justify-between p-3 border-b border-gray-700">
              <div className="flex items-center text-sm text-gray-300">
                {getFileIcon()}
                <span className="truncate max-w-xs">{formData.file.name}</span>
              </div>
              <button 
                type="button" 
                onClick={removeFile}
                className="p-1 rounded-full hover:bg-gray-700 text-gray-400 hover:text-gray-200"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            
            {/* Image Preview */}
            {preview && (
              <div className="flex justify-center items-center p-4 bg-black">
                <img 
                  src={preview} 
                  alt="Preview" 
                  className="max-h-64 object-contain"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://via.placeholder.com/400x300?text=Preview+Not+Available";
                  }}
                />
              </div>
            )}
          </div>
        )}
      </div>

      <div className="flex items-center">
        <input
          id="isAnonymous"
          name="isAnonymous"
          type="checkbox"
          checked={formData.isAnonymous}
          onChange={handleChange}
          className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-700 rounded bg-gray-700"
        />
        <label htmlFor="isAnonymous" className="ml-2 block text-sm text-gray-300">
          Submit Anonymously
        </label>
      </div>

      {error && (
        <div className="flex items-center text-red-400 bg-red-900/20 p-3 rounded-md">
          <AlertCircle className="h-5 w-5 mr-2" />
          <span>{error}</span>
        </div>
      )}

      <div className="flex justify-end space-x-3 pt-2">
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-300 bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Complaint'}
        </button>
      </div>
    </form>
  );
}
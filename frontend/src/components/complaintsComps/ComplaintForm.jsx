import React, { useState } from 'react';
import { AlertCircle, Upload } from 'lucide-react';

export function ComplaintForm({ onSubmit }) {
  const [content, setContent] = useState('');
  const [proof, setProof] = useState(null);
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!content.trim()) {
      setError('Please enter your complaint');
      return;
    }

    // Mock inappropriate content check
    if (content.toLowerCase().includes('inappropriate')) {
      setError('Inappropriate content detected');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({
        content,
        proof: proof || undefined,
        isAnonymous
      });
      setContent('');
      setProof(null);
      setIsAnonymous(true);
    } catch (err) {
      setError('Failed to submit complaint');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-md">
      <div>
        <label htmlFor="content" className="block text-sm font-medium text-gray-700">
          Complaint Content
        </label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          rows={4}
          placeholder="Describe your complaint..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Proof (Optional)</label>
        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
          <div className="space-y-1 text-center">
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <div className="flex text-sm text-gray-600">
              <label className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500">
                <span>Upload a file</span>
                <input
                  type="file"
                  className="sr-only"
                  accept="image/*,video/*"
                  onChange={(e) => setProof(e.target.files?.[0] || null)}
                />
              </label>
            </div>
            {proof && <p className="text-sm text-gray-500">{proof.name}</p>}
          </div>
        </div>
      </div>

      <div className="flex items-center">
        <input
          id="anonymous"
          type="checkbox"
          checked={isAnonymous}
          onChange={(e) => setIsAnonymous(e.target.checked)}
          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
        />
        <label htmlFor="anonymous" className="ml-2 block text-sm text-gray-900">
          Submit Anonymously
        </label>
      </div>

      {error && (
        <div className="flex items-center text-red-600">
          <AlertCircle className="h-5 w-5 mr-2" />
          <span>{error}</span>
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
      >
        {isSubmitting ? 'Submitting...' : 'Submit Complaint'}
      </button>
    </form>
  );
}

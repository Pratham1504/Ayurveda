import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { server } from '../main';

const CreateEbook = () => {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    description: '',
    fileUrl: '', // For Google Drive or external link
  });

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (!formData.fileUrl.trim()) {
      setError('Please enter the Google Drive link.');
      return;
    }

    setLoading(true);

    try {
      await axios.post(`${server}/api/ebooks`, formData, {
        headers: {
          'Content-Type': 'application/json',
          token: localStorage.getItem('token'),
        },
      });

      setSuccess('Ebook uploaded successfully!');
      setTimeout(() => navigate('/admin/ebooks'), 2000);
    } catch (err) {
      console.error('Error uploading ebook:', err);
      setError('Failed to upload ebook.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white py-8 px-4 mx-auto max-w-screen-xl lg:py-8 lg:px-6">
      <h2 className="text-2xl font-bold text-green-700 mb-4">| Create New Ebook</h2>

      {error && <div className="bg-red-100 text-red-700 p-2 mb-4 rounded">{error}</div>}
      {success && <div className="bg-green-100 text-green-700 p-2 mb-4 rounded">{success}</div>}

      <form onSubmit={handleFormSubmit}>
        <div className="mb-4">
          <label className="block font-bold mb-2">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleFormChange}
            className="w-full border p-2"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block font-bold mb-2">Author</label>
          <input
            type="text"
            name="author"
            value={formData.author}
            onChange={handleFormChange}
            className="w-full border p-2"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block font-bold mb-2">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleFormChange}
            className="w-full border p-2"
          ></textarea>
        </div>

        <div className="mb-6">
          <label className="block font-bold mb-2">Google Drive Link</label>
          <input
            type="url"
            name="fileUrl"
            value={formData.fileUrl}
            onChange={handleFormChange}
            className="w-full border p-2"
            required
            placeholder="https://drive.google.com/..."
          />
        </div>

        <button
          type="submit"
          className="bg-green-500 text-white px-4 py-2 rounded-md"
          disabled={loading}
        >
          {loading ? (
            <span className="loader"></span>
          ) : (
            'Upload Ebook'
          )}
        </button>
      </form>

      <style jsx>{`
        .loader {
          border: 4px solid rgba(255, 255, 255, 0.3);
          border-top: 4px solid white;
          border-radius: 50%;
          width: 20px;
          height: 20px;
          animation: spin 1s linear infinite;
          display: inline-block;
          margin-left: 10px;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default CreateEbook;

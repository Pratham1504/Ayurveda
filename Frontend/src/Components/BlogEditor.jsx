import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { NotificationContext } from '../context/NotificationContext';

const BlogEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    topic: '',
    youtubeLink: '',
    productId: ''
  });
  const [products, setProducts] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const { setMessage } = useContext(NotificationContext);

  useEffect(() => {
    const fetchBlogAndProducts = async () => {
      try {
        if (id) {
          setIsEditMode(true);
          const response = await axios.get(`http://localhost:4000/api/blogs/${id}`);
          const blogData = response.data;
          setFormData({
            title: blogData.title || '',
            description: blogData.description || '',
            topic: blogData.topic || '',
            youtubeLink: blogData.youtubeLink || '',
            productId: blogData.productId || ''
          });
        } else {
          setIsEditMode(false);
        }
        const productResponse = await axios.get('http://localhost:4000/api/products');
        setProducts(productResponse.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching blog or products:', err);
        setLoading(false);
      }
    };

    fetchBlogAndProducts();
  }, [id]);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDescriptionChange = (content) => {
    setFormData((prev) => ({ ...prev, description: content }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditMode) {
        await axios.put(`http://localhost:4000/api/blogs/${id}`, formData);
        setMessage('Blog updated successfully.');
      } else {
        await axios.post('http://localhost:4000/api/blogs', formData);
        setMessage('Blog created successfully.');
      }
      navigate('/admin/blogs');
    } catch (err) {
      console.error('Error submitting form:', err);
      setMessage('Error submitting form.');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="blog-editor-page bg-white py-8 px-4 mx-auto max-w-screen-xl lg:py-8 lg:px-6">
      <h1 className="text-2xl text-green-700 font-bold mb-4">
        {isEditMode ? '| Edit Blog' : '| Create New Blog'}
      </h1>

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

        <div className="mb-10">
          <label className="block font-bold mb-4">Description</label>
          <ReactQuill
            value={formData.description}
            onChange={handleDescriptionChange}
            className="w-full h-64 p-2"
            theme="snow"
          />
        </div>

        <div className="mb-4">
          <label className="block font-bold mb-2">Topic</label>
          <input
            type="text"
            name="topic"
            value={formData.topic}
            onChange={handleFormChange}
            className="w-full border p-2"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block font-bold mb-2">YouTube Link</label>
          <input
            type="text"
            name="youtubeLink"
            value={formData.youtubeLink}
            onChange={handleFormChange}
            className="w-full border p-2"
          />
        </div>

        <div className="mb-4">
          <label className="block font-bold mb-2">Product (Link to Product)</label>
          <select
            name="productId"
            value={formData.productId}
            onChange={handleFormChange}
            className="w-full border p-2"
          >
            <option value="">Select a Product</option>
            {products.map((product) => (
              <option key={product._id} value={product._id}>
                {product.name}
              </option>
            ))}
          </select>
        </div>

        <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded-md">
          {isEditMode ? 'Update Blog' : 'Create Blog'}
        </button>
      </form>
    </div>
  );
};

export default BlogEditor;

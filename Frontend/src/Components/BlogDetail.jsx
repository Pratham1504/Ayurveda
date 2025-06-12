import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment';
import twitterIcon from '../Images/Icons/X.webp';
import whatsappIcon from '../Images/Icons/Whatsapp-logo.webp';
import instagramIcon from '../Images/Icons/Instagram.webp';
import { useBlogs } from '../Context/BlogContext';
import { useProducts } from '../Context/ProductContext';
// import ReactQuill from 'react-quill';
// import 'react-quill/dist/quill.snow.css';

const BlogDetail = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const { blogs, blogLoading, blogError } = useBlogs();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [comments, setComments] = useState([]);
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [commentText, setCommentText] = useState('');
  const { products, productLoading } = useProducts();

  useEffect(() => {
    if (!blogLoading && blogs.length > 0) {
      const selectedBlog = blogs.find(b => b._id === id);
      if (selectedBlog) {
        setBlog(selectedBlog);
        setComments(selectedBlog.comments || []);

        if (!productLoading && selectedBlog.productId && products.length > 0) {
          const linkedProduct = products.find(p => p._id === selectedBlog.productId);
          setProduct(linkedProduct || null);
        }
      }
    }
  }, [id]);

  const handleLike = async () => {
    try {
      const response = await axios.patch(`http://localhost:4000/api/blogs/${id}/like`);
      setBlog(response.data);
    } catch (err) {
      setError(err);
    }
  };

  const handleDislike = async () => {
    try {
      const response = await axios.patch(`http://localhost:4000/api/blogs/${id}/dislike`);
      setBlog(response.data);
    } catch (err) {
      setError(err);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!name || !age || !commentText) {
      alert("Please fill out all fields");
      return;
    }

    try {
      const newComment = { name, age, text: commentText };
      const response = await axios.post(`http://localhost:4000/api/blogs/${id}/comment`, newComment);
      setComments((prevComments) => [...prevComments, response.data.comment]);
      setName('');
      setAge('');
      setCommentText('');
    } catch (err) {
      setError(err);
    }
  };

  if (blogLoading || productLoading) return <div className="text-center py-20 text-gray-500">Loading...</div>;
  if (blogError || error) return <div className="text-red-500 py-10">Error: {(blogError || error).message}</div>;
  if (!blog) return <div className="text-gray-600 py-10 text-center">Blog not found</div>;

  return (
    <section className="font-sans py-4 px-4 mx-auto max-w-screen-xl lg:py-4 lg:px-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-gray-100 p-3 rounded-lg border border-gray-200 shadow-md">
          <h1 className="text-2xl font-bold mb-4">{blog.title}</h1>
          <div className="flex justify-between items-center mb-5 text-gray-500">
            <span className="bg-sky-100 text-sky-800 text-xs font-medium inline-flex items-center px-2.5 py-0.5 rounded">
              {blog.topic}
            </span>
            <span className="text-sm">{new Date(blog.createdAt).toLocaleDateString()}</span>
          </div>

          <div className=" max-w-none text-black-200 mb-4" dangerouslySetInnerHTML={{ __html: blog.description }} />

          <div className="flex items-center space-x-4 mb-4">
            <button
              onClick={handleLike}
              className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
            >
              👍 {blog.likes} Like
            </button>
            <button
              onClick={handleDislike}
              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
            >
              👎 {blog.dislikes} Dislike
            </button>
          </div>

          <div className="flex space-x-4 mt-6">
            <span className="font-semibold">Share this blog:</span>
            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(blog.title)}&url=${encodeURIComponent(window.location.href)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center"
            >
              <img src={twitterIcon} alt="Twitter" className="w-6 h-6 mr-1" />
            </a>
            <a
              href={`https://api.whatsapp.com/send?text=${encodeURIComponent(blog.title)}%0A${encodeURIComponent(window.location.href)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center"
            >
              <img src={whatsappIcon} alt="WhatsApp" className="w-6 h-6 mr-1" />
            </a>
            <a
              href={`https://www.instagram.com/?url=${encodeURIComponent(window.location.href)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center"
            >
              <img src={instagramIcon} alt="Instagram" className="w-6 h-6 mr-1" />
            </a>
          </div>

          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Comments</h2>
            {comments.length > 0 ? (
              comments.map((comment, index) => (
                <div key={index} className="mb-4 bg-white p-4 rounded-lg shadow-md">
                  <div className="flex justify-between items-center">
                    <p className="font-bold text-gray-800">{comment.name}</p>
                    <span className="text-sm text-gray-500">{moment(comment.createdAt).fromNow()}</span>
                  </div>
                  <p className="text-xs text-gray-600">Age: {comment.age}</p>
                  <p className="text-sm text-gray-500 mt-2">{comment.text}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No comments yet. Be the first to comment!</p>
            )}
          </div>

          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-4">Leave a Comment</h2>
            <form onSubmit={handleCommentSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="block w-full border border-gray-300 rounded-md p-2"
                  placeholder="Your name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Age <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="block w-full border border-gray-300 rounded-md p-2"
                  placeholder="Your age"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Comment <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  className="block w-full border border-gray-300 rounded-md p-2"
                  placeholder="Write your comment here..."
                  required
                ></textarea>
              </div>
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Add Comment
              </button>
            </form>
          </div>
        </div>

        <div>
          {blog.youtubeLink && (
            <div className="mb-4">
              <h2 className="text-xl font-semibold mb-4">Watch Video:</h2>
              <iframe
                width="100%"
                src={blog.youtubeLink.replace("watch?v=", "embed/")}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default BlogDetail;

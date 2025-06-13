import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment';
import twitterIcon from '../Images/Icons/X.webp';
import whatsappIcon from '../Images/Icons/Whatsapp-logo.webp';
import instagramIcon from '../Images/Icons/Instagram.webp';
import { useBlogs } from '../Context/BlogContext';
import { useProducts } from '../Context/ProductContext';
import { HandThumbUpIcon, HandThumbDownIcon, ShareIcon, XMarkIcon } from '@heroicons/react/24/solid';
import BlogDescription from './BlogDescription';
import toast from 'react-hot-toast';
import { UserData } from '../Context/UserContext';

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
  const [showAllComments, setShowAllComments] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const { user, isAuth, setModalIsOpen } = UserData();
  const blogUrl = window.location.href;
  const [hasLiked, setHasLiked] = useState(false);
  const [hasDisliked, setHasDisliked] = useState(false);
  const [hasCommented, setHasCommented] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(blogUrl);
    toast.success("Link copied to clipboard!");
  };
  useEffect(() => {
    if (showShareModal) {
      document.body.style.overflow = 'hidden'; // 🚫 prevent scroll
    } else {
      document.body.style.overflow = 'auto'; // ✅ allow scroll
    }

    return () => {
      document.body.style.overflow = 'auto'; // cleanup on unmount
    };
  }, [showShareModal]);

  const copyToClipboard = () => {
    const textToCopy = `${blog.title} - ${blogUrl}`;
    navigator.clipboard.writeText(textToCopy)
      .then(() => toast.success("Link copied to clipboard!"))
      .catch(() => toast.error("Failed to copy link."));
  };



  useEffect(() => {
    if (!blogLoading && blogs.length > 0) {
      const selectedBlog = blogs.find(b => b._id === id);
      if (selectedBlog) {
        setBlog(selectedBlog);
        setComments(selectedBlog.comments || []);
        setHasLiked(selectedBlog.likedUsers?.includes(user?._id));
        setHasDisliked(selectedBlog.dislikedUsers?.includes(user?._id));
        setHasCommented(selectedBlog.comments?.some(comment => comment.userId === user?._id));
        // blog.comments?.some(comment => comment.userId === user._id)

        if (!productLoading && selectedBlog.productId && products.length > 0) {
          const linkedProduct = products.find(p => p._id === selectedBlog.productId);
          setProduct(linkedProduct || null);
        }
      }
    }
  }, [id, blogs, blogLoading,user]);

  const handleLike = async () => {
    if (!isAuth) {
      toast.error("Please login to like the blog.");
      return;
    }
    try {
      const token = localStorage.getItem("token");

      const response = await axios.patch(`http://localhost:4000/api/blogs/${id}/like`, {}, {
        headers: {
          token: localStorage.getItem("token"),
        },
      });

      setBlog(response.data);
    } catch (err) {
      setError(err);
    }
  };

  const handleDislike = async () => {
    if (!isAuth) {
      toast.error("Please login to dislike the blog.");
      return;
    }
    try {
      const response = await axios.patch(`http://localhost:4000/api/blogs/${id}/dislike`, {}, {
        headers: {
          token: localStorage.getItem("token"),
        },
      });
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
      const response = await axios.post(
        `http://localhost:4000/api/blogs/${id}/comment`,
        newComment,
        {
          headers: {
            token: localStorage.getItem("token"),
          },
        }
      );
      setComments((prevComments) => [...prevComments, response.data.comment]);
      setName('');
      setAge('');
      setCommentText('');
    } catch (err) {
      setError(err);
    } finally {
      toast.success("Thanks for Commenting!")
    }
  };

  if (blogLoading || productLoading) return <div className="text-center py-20 text-gray-500">Loading...</div>;
  if (blogError || error) return <div className="text-red-500 py-10">Error: {(blogError || error).message}</div>;
  if (!blog) return <div className="text-gray-600 py-10 text-center">Blog not found</div>;

  return (
    <section className="font-sans px-4 py-10 mx-auto max-w-screen-xl lg:max-w-3/4 lg:mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{blog.title}</h1>

          <div className="flex justify-between items-center mb-6 text-sm text-gray-500">
            <span className="bg-sky-100 text-sky-800 px-3 py-1 rounded-full text-xs font-medium">
              {blog.topic}
            </span>
            <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
          </div>

          {/* <div
            className="prose max-w-none mb-6 text-gray-800 "
            dangerouslySetInnerHTML={{ __html: blog.description }}
          /> */}
          <BlogDescription blog={blog} />

          {/* Interaction Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8 p-4 border border-gray-200 rounded-xl bg-white">
            {/* Likes/Dislikes */}
            <div className="flex items-center gap-3">
              <button
                onClick={handleLike}
                className={`flex items-center gap-2 px-4 py-2 border rounded-full shadow transition ${hasLiked
                  ? 'border-green-500 bg-green-500 text-white hover:bg-green-600'
                  : 'border-green-500 text-green-600 bg-white hover:bg-green-50'
                  }`}
              >
                <HandThumbUpIcon className="w-5 h-5" />
                <span className="font-medium">{blog.likes}</span>
              </button>

              <button
                onClick={handleDislike}
                className={`flex items-center gap-2 px-4 py-2 border rounded-full shadow transition ${hasDisliked
                  ? 'border-red-500 bg-red-500 text-white hover:bg-red-600'
                  : 'border-red-500 text-red-600 bg-white hover:bg-red-50'
                  }`}
              >
                <HandThumbDownIcon className="w-5 h-5" />
                <span className="font-medium">{blog.dislikes}</span>
              </button>
            </div>


            {/* Share */}
            <button
              onClick={() => setShowShareModal(true)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-400 text-gray-700 bg-white rounded-full shadow hover:bg-gray-100 transition"
            >
              <ShareIcon className="w-5 h-5" />
              <span className="text-sm font-medium">Share</span>
            </button>
          </div>

          {/* Share Modal */}
          {showShareModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/30">
              <div className="bg-white w-full max-w-md mx-4 rounded-xl p-6 shadow-xl relative animate-fade-in">
                <button
                  className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition"
                  onClick={() => setShowShareModal(false)}
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>

                <h3 className="text-lg font-semibold text-gray-800 mb-4">Share this blog</h3>

                <div className="flex items-center gap-4 mb-6">
                  {/* Twitter */}
                  <a href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(blogUrl)}&text=${encodeURIComponent(blog.title)}`}
                    onClick={copyToClipboard}
                    target="_blank" rel="noopener noreferrer"
                    className="flex items-center justify-center w-10 h-10 bg-sky-100 rounded-full hover:bg-sky-200 transition">
                    <img src={twitterIcon} alt="Twitter" className="w-5 h-5" />
                  </a>

                  {/* WhatsApp */}
                  <a href={`https://api.whatsapp.com/send?text=${encodeURIComponent(blog.title + " " + blogUrl)}`}
                    onClick={copyToClipboard}
                    target="_blank" rel="noopener noreferrer"
                    className="flex items-center justify-center w-10 h-10 bg-green-100 rounded-full hover:bg-green-200 transition">
                    <img src={whatsappIcon} alt="WhatsApp" className="w-5 h-5" />
                  </a>

                  {/* Facebook */}
                  <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(blogUrl)}`}
                    onClick={copyToClipboard}
                    target="_blank" rel="noopener noreferrer"
                    className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full hover:bg-blue-200 transition">
                    <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M22 12a10 10 0 10-11.5 9.9v-7h-2v-3h2v-2.3c0-2 1.2-3.2 3-3.2.9 0 1.9.2 1.9.2v2.1H15c-1 0-1.3.6-1.3 1.2V12h2.6l-.4 3h-2.2v7A10 10 0 0022 12z" />
                    </svg>
                  </a>

                  {/* Email */}
                  <a href={`mailto:?subject=${encodeURIComponent(blog.title)}&body=${encodeURIComponent(blogUrl)}`}
                    onClick={copyToClipboard}
                    className="flex items-center justify-center w-10 h-10 bg-yellow-100 rounded-full hover:bg-yellow-200 transition">
                    <svg className="w-5 h-5 text-yellow-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v.5l-10 6.5L2 6.5V6c0-1.1.9-2 2-2zm0 4.3v9.7c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8.3l-8 5.2-8-5.2z" />
                    </svg>
                  </a>

                  {/* LinkedIn */}
                  <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(blogUrl)}`}
                    onClick={copyToClipboard}
                    target="_blank" rel="noopener noreferrer"
                    className="flex items-center justify-center w-10 h-10 bg-blue-50 rounded-full hover:bg-blue-100 transition">
                    <svg className="w-5 h-5 text-blue-700" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19 0h-14a5 5 0 00-5 5v14a5 5 0 005 5h14a5 5 0 005-5v-14a5 5 0 00-5-5zM7 19h-3v-9h3v9zm-1.5-10.5c-1 0-1.8-.8-1.8-1.8S4.5 5 5.5 5s1.8.8 1.8 1.8-.8 1.7-1.8 1.7zm14.5 10.5h-3v-4.5c0-1.1-.4-2-1.6-2s-1.9.9-1.9 2v4.5h-3v-9h3v1.2a3 3 0 013-1.3c2 0 3 1.3 3 4v5.1z" />
                    </svg>
                  </a>
                </div>

                <div className="flex items-center gap-2 border border-gray-300 rounded-lg px-3 py-2">
                  <input
                    type="text"
                    value={blogUrl}
                    readOnly
                    className="flex-1 bg-transparent text-sm text-gray-700 outline-none"
                  />
                  <button
                    onClick={handleCopy}
                    className="text-blue-600 text-sm font-medium hover:underline"
                  >
                    Copy
                  </button>
                </div>
              </div>
            </div>
          )}



          <div className="mt-10">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Comments</h2>
            {comments.length > 0 ? (
              <>
                <div className="space-y-4 transition-all duration-300 ease-in-out overflow-hidden">
                  {(showAllComments ? comments : comments.slice(0, 3)).map((comment, index) => (
                    <div
                      key={index}
                      className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-sky-500 text-white text-xs flex items-center justify-center rounded-full font-bold uppercase">
                            {comment.name[0]}
                          </div>
                          <div>
                            <p className="font-medium text-gray-800">{comment.name}</p>
                            <p className="text-xs text-gray-400">Age: {comment.age}</p>
                          </div>
                        </div>
                        <span className="text-xs text-gray-400">{moment(comment.createdAt).fromNow()}</span>
                      </div>
                      <p className="mt-3 text-gray-700 text-sm">{comment.text}</p>
                    </div>
                  ))}
                </div>

                {comments.length > 3 && (
                  <div className="text-center mt-4">
                    <button
                      onClick={() => setShowAllComments(!showAllComments)}
                      className="text-sm text-sky-600 font-medium hover:underline transition"
                    >
                      {showAllComments ? 'Show Less Comments' : `Show ${comments.length - 3} More Comment(s)`}
                    </button>
                  </div>
                )}
              </>
            ) : (
              <p className="text-gray-500">No comments yet. Be the first to comment!</p>
            )}
          </div>


          <div className="mt-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Leave a Comment</h2>

            {!isAuth && (
              <div className="bg-yellow-100 border border-yellow-300 text-yellow-800 rounded-lg p-4 mb-6">
                You need to <span
                  onClick={() => setModalIsOpen(true)}
                  className="text-blue-600 font-medium hover:underline cursor-pointer"
                >
                  login
                </span> to leave a comment.
              </div>
            )}

            {isAuth && (
              blog.comments?.some(comment => comment.userId === user._id) ? (
                <div className="mt-6 p-4 border border-yellow-300 bg-yellow-50 text-yellow-700 rounded-lg shadow-sm">
                  <p className="font-semibold">You have already commented on this blog.</p>
                  <p className="text-sm mt-1">Thank you for sharing your thoughts!</p>
                </div>
              ) : (
                <form onSubmit={handleCommentSubmit} className="space-y-6 mt-4">

                  {/* Name */}
                  <div className="relative">
                    <input
                      type="text"
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder=""
                      className="peer w-full px-3 pt-5 pb-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-400 outline-none"
                      required
                    />
                    <label
                      htmlFor="name"
                      className={`absolute left-3 text-gray-500 text-sm transition-all 
            ${name ? 'top-1 text-sm text-sky-500' : 'top-3.5 text-base text-gray-400 peer-focus:top-1 peer-focus:text-sm peer-focus:text-sky-500'}`}
                    >
                      Name
                    </label>
                  </div>

                  {/* Age */}
                  <div className="relative">
                    <input
                      type="number"
                      id="age"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      placeholder=""
                      className="peer w-full px-3 pt-5 pb-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-400 outline-none"
                      required
                    />
                    <label
                      htmlFor="age"
                      className={`absolute left-3 text-gray-500 text-sm transition-all 
            ${age ? 'top-1 text-sm text-sky-500' : 'top-3.5 text-base text-gray-400 peer-focus:top-1 peer-focus:text-sm peer-focus:text-sky-500'}`}
                    >
                      Age
                    </label>
                  </div>

                  {/* Comment */}
                  <div className="relative">
                    <textarea
                      id="comment"
                      rows="4"
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      placeholder=""
                      className="peer w-full px-3 pt-5 pb-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-400 outline-none resize-none"
                      required
                    ></textarea>
                    <label
                      htmlFor="comment"
                      className={`absolute left-3 text-gray-500 text-sm transition-all 
            ${commentText ? 'top-1 text-sm text-sky-500' : 'top-3.5 text-base text-gray-400 peer-focus:top-1 peer-focus:text-sm peer-focus:text-sky-500'}`}
                    >
                      Comment
                    </label>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="bg-sky-600 hover:bg-sky-700 text-white px-6 py-2 rounded-lg transition w-full md:w-auto"
                  >
                    Comment
                  </button>
                </form>
              )
            )}

          </div>


        </div>

        {/* Sidebar */}
        <div>
          {/* YouTube Video */}
          {blog.youtubeLink && (
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-800 mb-3">Watch Video</h2>
              <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden">
                <iframe
                  src={blog.youtubeLink.replace("watch?v=", "embed/")}
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                ></iframe>
              </div>
            </div>
          )}

          {/* You May Also Like */}
          {blogs && blogs.length > 1 && (
            <div className="bg-white rounded-xl border border-gray-200 shadow p-4">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">You May Also Like</h2>
              <div className="divide-y divide-gray-200">
                {blogs
                  .filter((b) => b._id !== blog._id)
                  .slice(0, 5)
                  .map((otherBlog) => (
                    <Link
                      key={otherBlog._id}
                      to={`/blogs/${otherBlog._id}`}
                      className="flex items-center justify-between py-3 hover:bg-sky-50 px-3 rounded-md transition group"
                    >
                      <span className="text-sm text-gray-800 group-hover:text-sky-700 font-medium">
                        {otherBlog.title}
                      </span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-4 h-4 text-gray-400 group-hover:text-sky-600 transition-sharp shrink-0"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  ))}
              </div>
            </div>
          )}
        </div>



      </div>
    </section>
  );

};

export default BlogDetail;

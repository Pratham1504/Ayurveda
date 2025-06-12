const Blog = require('../models/blogModel');

// Create a new blog post
const createBlog = async (req, res) => {
    try {
        const newBlog = new Blog(req.body);
        const savedBlog = await newBlog.save();
        res.status(201).json(savedBlog);
    } catch (error) {
        res.status(400).json({ message: 'Error creating blog post', error });
    }
};

// Get all blog posts
const getAllBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find();
        res.status(200).json(blogs);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving blogs', error });
    }
};

// Function to get a single blog by ID
const getBlogById = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        if (!blog) {
            return res.status(404).json({ message: 'Blog not found' });
        }
        res.json(blog);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Update a blog post
const updateBlog = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedBlog = await Blog.findByIdAndUpdate(id, req.body, { new: true });
        res.status(200).json(updatedBlog);
    } catch (error) {
        res.status(400).json({ message: 'Error updating blog post', error });
    }
};

// Delete a blog post
const deleteBlog = async (req, res) => {
    try {
        const { id } = req.params;
        await Blog.findByIdAndDelete(id);
        res.status(200).json({ message: 'Blog post deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting blog post', error });
    }
};

// Increment like count
const likeBlog = async (req, res) => {
  const { id } = req.params;
  const userId = req.user?._id;

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized: Login required" });
  }

  try {
    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    const likedIndex = blog.likedUsers.findIndex(uid => uid.toString() === userId.toString());
    const dislikedIndex = blog.dislikedUsers.findIndex(uid => uid.toString() === userId.toString());

    if (likedIndex !== -1) {
      // Already liked → remove like
      blog.likedUsers.splice(likedIndex, 1);
    } else {
      // Add like
      blog.likedUsers.push(userId);
      // Remove from dislikes if present
      if (dislikedIndex !== -1) {
        blog.dislikedUsers.splice(dislikedIndex, 1);
      }
    }

    blog.likes = blog.likedUsers.length;
    blog.dislikes = blog.dislikedUsers.length;

    await blog.save();
    res.json(blog);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error liking the blog", error: err.message });
  }
};

// Increment dislike count
const dislikeBlog = async (req, res) => {
  const { id } = req.params;
  const userId = req.user?._id;

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized: Login required" });
  }

  try {
    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    const dislikedIndex = blog.dislikedUsers.findIndex(uid => uid.toString() === userId.toString());
    const likedIndex = blog.likedUsers.findIndex(uid => uid.toString() === userId.toString());

    if (dislikedIndex !== -1) {
      // Already disliked → remove dislike
      blog.dislikedUsers.splice(dislikedIndex, 1);
    } else {
      // Add dislike
      blog.dislikedUsers.push(userId);
      // Remove from likes if present
      if (likedIndex !== -1) {
        blog.likedUsers.splice(likedIndex, 1);
      }
    }

    blog.likes = blog.likedUsers.length;
    blog.dislikes = blog.dislikedUsers.length;

    await blog.save();
    res.json(blog);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error disliking the blog", error: err.message });
  }
};

// Add new comment function
const addComment = async (req, res) => {
  const { name, age, text } = req.body;
  const { id } = req.params;
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized: Login required to comment" });
  }

  if (!text || !name) {
    return res.status(400).json({ message: "Missing required fields: name and text" });
  }

  try {
    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    // Check if the user already commented
    const alreadyCommented = blog.comments.some(
      (comment) => comment.userId?.toString() === userId
    );

    if (alreadyCommented) {
      return res.status(400).json({ message: "You have already commented on this blog" });
    }

    const newComment = {
      name,
      age: age || null,
      text,
      userId,
      createdAt: new Date(),
    };

    blog.comments.push(newComment);
    await blog.save();

    res.status(201).json({ comment: newComment });
  } catch (err) {
    console.error("Error adding comment:", err);
    res.status(500).json({ message: "Internal server error", error: err.message });
  }
};




module.exports = {
    createBlog,
    getAllBlogs,
    getBlogById,
    updateBlog,
    deleteBlog,
    likeBlog,
    dislikeBlog,
    addComment,
};

import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminProduct = () => {
    const [products, setProducts] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        MRP: '',
        company: '',
        size: '',
        ingredients: '',
        usage: '',
        image: null,
    });
    const [editingProductId, setEditingProductId] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false); // To prevent multiple submissions
    const [message, setMessage] = useState(null); // To display success/error messages
    const [deletedProduct, setDeletedProduct] = useState(null); // To store deleted product for undo
    const [undoTimeout, setUndoTimeout] = useState(null); // For undo timer

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get('http://localhost:4000/api/products');
                setProducts(response.data);
            } catch (err) {
                setMessage({ text: 'Error fetching products', type: 'error' });
            }
        };

        fetchProducts();
    }, []);

    // Automatically remove message after 5 seconds
    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => setMessage(null), 5000);
            return () => clearTimeout(timer);
        }
    }, [message]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        const validImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

        if (file && validImageTypes.includes(file.type)) {
            setFormData((prev) => ({
                ...prev,
                image: file,
            }));
        } else {
            alert('Please select a valid image file (JPEG, JPG, PNG, WEBP)');
            e.target.value = null; // Reset the input
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true); // Prevent multiple submissions
        const form = new FormData();

        // Append only the fields that are present
        for (const key in formData) {
            if (key === 'image' && !formData[key]) continue;
            form.append(key, formData[key]);
        }

        try {
            if (editingProductId) {
                await axios.put(`http://localhost:4000/api/products/${editingProductId}`, form, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                setMessage({ text: 'Product updated successfully', type: 'success' });
            } else {
                await axios.post('http://localhost:4000/api/products', form, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                setMessage({ text: 'Product added successfully', type: 'success' });
            }
            resetForm();
            const response = await axios.get('http://localhost:4000/api/products');
            setProducts(response.data);
        } catch (err) {
            setMessage({ text: 'Error adding/updating product', type: 'error' });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEdit = (product) => {
        setFormData({
            name: product.name,
            description: product.description,
            price: product.price,
            MRP: product.MRP,
            company: product.company,
            size: product.size,
            ingredients: product.ingredients.join(', '),
            usage: product.usage,
            image: null, // Reset image on edit
        });
        setEditingProductId(product._id);
    };

    const handleDelete = async (id) => {
        try {
            const deletedProduct = products.find(product => product._id === id);
            setDeletedProduct(deletedProduct);
            setProducts((prev) => prev.filter(product => product._id !== id));

            setUndoTimeout(setTimeout(async () => {
                await axios.delete(`http://localhost:4000/api/products/${id}`);
                setMessage({ text: 'Product deleted successfully', type: 'success' });
                setDeletedProduct(null);
            }, 5000));
        } catch (err) {
            setMessage({ text: 'Error deleting product', type: 'error' });
        }
    };

    const handleUndoDelete = () => {
        if (undoTimeout) {
            clearTimeout(undoTimeout);
            setUndoTimeout(null);
            setProducts((prev) => [...prev, deletedProduct]);
            setDeletedProduct(null);
            setMessage({ text: 'Product restoration successful', type: 'success' });
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            description: '',
            price: '',
            MRP: '',
            company: '',
            size: '',
            ingredients: '',
            usage: '',
            image: null,
        });
        setEditingProductId(null);
        setIsSubmitting(false); // Enable submission again after reset
    };

    const closeMessage = () => {
        setMessage(null); // Manually close message
    };

    const filteredProducts = products.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        product.company.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="container mx-auto flex flex-col lg:flex-row max-w-screen-xl mx-auto px-4 lg:px-6">
            {/* Top Left - Success/Error Messages */}
            {message && (
                <div className={`fixed top-4 right-4 mt-4 ml-4 p-4 rounded text-white flex items-center ${message.type === 'success' ? 'bg-green-500' : 'bg-red-500'} animate-pulse`}>
                    {message.text}
                    <button onClick={closeMessage} className="ml-4 text-white font-bold">
                        X
                    </button>
                </div>
            )}

            {/* Left Side - List of Products */}
            <div className="w-full lg:w-1/2 p-4">
                <h1 className="text-3xl text-green-700 font-bold mb-6">| Manage Products</h1>
                <div className="bg-white rounded shadow p-4">
                    <h2 className="text-2xl text-green-700 font-bold mb-4">| Product List</h2>
                    <input
                        type="text"
                        placeholder="Search by name or company..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="border rounded p-2 mb-4 w-full"
                    />
                    <ul className="space-y-2">
                        {filteredProducts.map(product => (
                            <li key={product._id} className="flex justify-between items-center bg-gray-100 p-3 rounded">
                                <div>
                                    <h3 className="font-bold">{product.name}</h3>
                                    <p className="text-sm">{product.company}</p>
                                </div>
                                <div>
                                    <button onClick={() => handleEdit(product)} className="bg-yellow-500 text-white px-2 py-1 rounded mr-2">
                                        Edit
                                    </button>
                                    <button onClick={() => handleDelete(product._id)} className="bg-red-500 text-white px-2 py-1 rounded">
                                        Delete
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Right Side - Product Form */}
            <div className="w-full lg:w-1/2 p-4">
                <h1 className="text-3xl text-green-700 font-bold mb-6">{editingProductId ? '| Edit Product' : '| Add Product'}</h1>
                <form onSubmit={handleSubmit} className="bg-white rounded shadow p-4">
                    <div className='flex'>
                        {/* Image Section */}
                        <div className="w-1/4 flex flex-col items-center justify-center">
                            {formData.image && (
                                <img
                                    src={URL.createObjectURL(formData.image)}
                                    alt="Selected"
                                    className="w-32 h-32 object-cover mb-2"
                                />
                            )}
                            {editingProductId && formData.image === null && (
                                <img
                                    src={`${products.find(p => p._id === editingProductId)?.image}`}
                                    alt="Current"
                                    className="w-32 h-32 object-cover mb-2"
                                />
                            )}
                        </div>

                        {/* Input Fields */}
                        <div className="w-2/3 pl-4">
                            <input
                                type="text"
                                name="name"
                                placeholder="Product Name"
                                value={formData.name}
                                onChange={handleInputChange}
                                required
                                className="border rounded p-2 mb-2 w-full"
                            />
                            <input
                                type="text"
                                name="company"
                                placeholder="Company Name"
                                value={formData.company}
                                onChange={handleInputChange}
                                required
                                className="border rounded p-2 mb-2 w-full"
                            />
                            <input
                                type="number"
                                name="price"
                                placeholder="Price"
                                value={formData.price}
                                onChange={handleInputChange}
                                required
                                className="border rounded p-2 mb-2 w-full"
                            />
                            <input
                                type="number"
                                name="MRP"
                                placeholder="MRP"
                                value={formData.MRP}
                                onChange={handleInputChange}
                                required
                                className="border rounded p-2 mb-2 w-full"
                            />
                        </div>
                    </div>
                    <textarea
                        name="description"
                        placeholder="Description"
                        value={formData.description}
                        onChange={handleInputChange}
                        required
                        className="border rounded p-2 mb-4 w-full"
                    />
                    <input
                        type="text"
                        name="size"
                        placeholder="Size"
                        value={formData.size}
                        onChange={handleInputChange}
                        required
                        className="border rounded p-2 mb-2 w-full"
                    />
                    <input
                        type="text"
                        name="usage"
                        placeholder="Usage"
                        value={formData.usage}
                        onChange={handleInputChange}
                        required
                        className="border rounded p-2 mb-2 w-full"
                    />
                    <input
                        type="text"
                        name="ingredients"
                        placeholder="Ingredients (comma separated)"
                        value={formData.ingredients}
                        onChange={handleInputChange}
                        required
                        className="border rounded p-2 mb-4 w-full"
                    />
                    <input
                        type="file"
                        name="image"
                        accept="image/jpeg,image/jpg,image/png,image/webp"
                        onChange={handleFileChange}
                        className="mb-4"
                    />
                    <div className="flex">
                    <button type="submit" disabled={isSubmitting} className={`bg-blue-500 text-white p-2 rounded mr-2 ${isSubmitting ? 'opacity-50' : ''}`}>
                        {editingProductId ? 'Update Product' : 'Add Product'}
                    </button>
                    <button type="button" onClick={resetForm} className="bg-gray-500 text-white p-2 rounded">
                        Clear Form
                    </button>
                    </div>
                </form>
            </div>

            {/* Undo Delete Button */}
            {deletedProduct && (
                <div className="fixed right-4 top-4 p-4 bg-yellow-500 text-white rounded shadow animate-bounce">
                    <p>Product deleted. <button onClick={handleUndoDelete} className="underline">Undo</button></p>
                </div>
            )}
        </div>
    );
};

export default AdminProduct;

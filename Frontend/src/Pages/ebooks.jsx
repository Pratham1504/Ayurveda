import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ArrowDownTrayIcon } from '@heroicons/react/24/solid'; // Download icon
import { ChevronDownIcon, ChevronRightIcon } from '@heroicons/react/24/solid'; // Chevron icons

const Ebooks = () => {
    const [ebooks, setEbooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [expandedRow, setExpandedRow] = useState(null);

    // Fetch all ebooks
    useEffect(() => {
        const fetchEbooks = async () => {
            setLoading(true);
            try {
                const response = await axios.get('http://localhost:4000/api/ebooks');
                setEbooks(response.data);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching ebooks:", err);
                setError('Failed to fetch ebooks.');
                setLoading(false);
            }
        };
        fetchEbooks();
    }, []);

    // Filter ebooks based on search term
    const filteredEbooks = ebooks.filter(ebook =>
        ebook.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ebook.author.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Handle row expansion
    const handleRowClick = (id) => {
        setExpandedRow(expandedRow === id ? null : id);
    };

    if (loading) return <div className="text-center">Loading...</div>;
    if (error) return <div className="text-red-500">{error}</div>;

    return (
        <div className="p-6 bg-white py-8 px-4 mx-auto max-w-screen-xl lg:py-8 lg:px-6">
            <h2 className="text-2xl font-bold text-green-700 mb-4">| Ebooks</h2>
            <input
                type="text"
                placeholder="Search ebooks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="mb-4 p-2 border border-gray-300 rounded w-full"
            />
            <table className="min-w-full bg-white border border-gray-200">
                <thead>
                    <tr>
                        <th className="py-2 px-4 border-b text-center">Title</th>
                        <th className="py-2 px-4 border-b text-center">Author</th>
                        <th className="py-2 px-4 border-b" /> {/* Empty header for download icon */}
                    </tr>
                </thead>
                <tbody>
                    {filteredEbooks.map((ebook, index) => (
                        <React.Fragment key={ebook._id}>
                            <tr onClick={() => handleRowClick(ebook._id)} className={`cursor-pointer hover:bg-gray-100 ${index % 2 === 1 ? 'bg-gray-50' : ''}`} style={{ minHeight: '56px' }}>
                                <td className="py-2 px-4 border-b flex items-center">
                                    {/* Display expansion icon fixed to the left */}
                                    {expandedRow === ebook._id ? (
                                        <ChevronDownIcon className="h-5 w-5 text-black mr-2" />
                                    ) : (
                                        <ChevronRightIcon className="h-5 w-5 text-black mr-2" />
                                    )}
                                    <span className="flex-grow text-center text-sm lg:text-base">{ebook.title}</span>
                                </td>
                                <td className="py-2 px-4 border-b text-center text-sm lg:text-base">{ebook.author}</td>
                                <td className="py-2 px-4 border-b text-right">
                                    <a href={`http://localhost:4000/api/ebooks/download/${ebook.fileName}`} target="_blank" rel="noopener noreferrer">
                                        <ArrowDownTrayIcon className="h-5 w-5 text-blue-500 inline" />
                                    </a>
                                </td>
                            </tr>
                            {expandedRow === ebook._id && (
                                <tr>
                                    <td colSpan="3" className="text-xs lg:text-sm text-gray-500 bg-gray-100 py-2 px-4 border-b">
                                        <p><strong>Description:</strong> {ebook.description}</p>
                                        <p><strong>Uploaded At:</strong> {new Date(ebook.uploadedAt).toLocaleDateString()}</p>
                                    </td>
                                </tr>
                            )}
                        </React.Fragment>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Ebooks;

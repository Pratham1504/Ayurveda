import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ArrowDownTrayIcon, ChevronDownIcon, ChevronRightIcon } from '@heroicons/react/24/solid';

const Ebooks = () => {
    const [ebooks, setEbooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [expandedRow, setExpandedRow] = useState(null);

    useEffect(() => {
        const fetchEbooks = async () => {
            try {
                const response = await axios.get('http://localhost:4000/api/ebooks');
                setEbooks(response.data);
            } catch (err) {
                console.error("Error fetching ebooks:", err);
                setError('Failed to fetch ebooks.');
            } finally {
                setLoading(false);
            }
        };
        fetchEbooks();
    }, []);

    const filteredEbooks = ebooks.filter(ebook =>
        ebook.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ebook.author.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleRowClick = (id) => {
        setExpandedRow(expandedRow === id ? null : id);
    };

    const EbookSkeletonRow = () => (
        <>
            <tr className="animate-pulse bg-white">
                <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                        <div className="h-5 w-5 bg-gray-200 rounded" />
                        <div className="h-4 w-3/4 bg-gray-200 rounded" />
                    </div>
                </td>
                <td className="py-3 px-4">
                    <div className="h-4 w-2/3 bg-gray-200 rounded" />
                </td>
                <td className="py-3 px-4 text-right">
                    <div className="h-6 w-6 bg-gray-200 rounded-md inline-block" />
                </td>
            </tr>
        </>
    );

    if (loading) {
        return (
            <div className="bg-white py-10 px-6 mx-auto max-w-screen-xl font-sans lg:max-w-3/4 lg:mx-auto">
                <h2 className="text-3xl font-bold text-sky-600 mb-6 border-b-2 border-sky-200 inline-block">Ebooks</h2>

                <div className="mb-6 h-10 bg-gray-200 rounded-md w-full animate-pulse" />

                <div className="overflow-x-auto shadow rounded-lg border border-gray-200">
                    <table className="min-w-full bg-white">
                        <thead className="bg-sky-50">
                            <tr>
                                <th className="py-3 px-4 text-left text-gray-700 text-sm font-semibold">Title</th>
                                <th className="py-3 px-4 text-left text-gray-700 text-sm font-semibold">Author</th>
                                <th className="py-3 px-4 text-right text-gray-700 text-sm font-semibold">Download</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Array.from({ length: 6 }).map((_, i) => (
                                <EbookSkeletonRow key={i} />
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }

    if (error) return <div className="text-red-500 text-center">{error}</div>;

    return (
        <div className="bg-white py-10 px-6 mx-auto max-w-screen-xl font-sans">
            <h2 className="text-3xl font-bold text-sky-600 mb-6 border-b-2 border-sky-200 inline-block">Ebooks</h2>

            <input
                type="text"
                placeholder="Search ebooks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="mb-6 p-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-sky-500"
            />

            <div className="overflow-x-auto shadow rounded-lg border border-gray-200">
                <table className="min-w-full bg-white">
                    <thead className="bg-sky-50">
                        <tr>
                            <th className="py-3 px-4 text-left text-gray-700 text-sm font-semibold">Title</th>
                            <th className="py-3 px-4 text-left text-gray-700 text-sm font-semibold">Author</th>
                            <th className="py-3 px-4 text-right text-gray-700 text-sm font-semibold">Download</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredEbooks.map((ebook, index) => (
                            <React.Fragment key={ebook._id}>
                                <tr
                                    onClick={() => handleRowClick(ebook._id)}
                                    className={`cursor-pointer transition hover:bg-sky-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                                >
                                    <td className="py-3 px-4 flex items-center gap-2 text-gray-800">
                                        {expandedRow === ebook._id ? (
                                            <ChevronDownIcon className="h-5 w-5 text-sky-600" />
                                        ) : (
                                            <ChevronRightIcon className="h-5 w-5 text-sky-600" />
                                        )}
                                        {ebook.title}
                                    </td>
                                    <td className="py-3 px-4 text-gray-700">{ebook.author}</td>
                                    <td className="py-3 px-4 text-right">
                                        <a
                                            href={`http://localhost:4000/api/ebooks/download/${ebook.fileName}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center justify-center bg-sky-500 hover:bg-sky-600 text-white p-1.5 rounded-md"
                                        >
                                            <ArrowDownTrayIcon className="h-5 w-5" />
                                        </a>
                                    </td>
                                </tr>
                                {expandedRow === ebook._id && (
                                    <tr className="bg-sky-50">
                                        <td colSpan="3" className="py-4 px-6 text-sm text-gray-700">
                                            <p><span className="font-semibold">Description:</span> {ebook.description}</p>
                                            <p><span className="font-semibold">Uploaded At:</span> {new Date(ebook.uploadedAt).toLocaleDateString()}</p>
                                        </td>
                                    </tr>
                                )}
                            </React.Fragment>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Ebooks;

// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { ArrowDownTrayIcon, ChevronDownIcon, ChevronRightIcon } from '@heroicons/react/24/solid';

// const Ebooks = () => {
//     const [ebooks, setEbooks] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const [searchTerm, setSearchTerm] = useState('');
//     const [expandedRow, setExpandedRow] = useState(null);

//     useEffect(() => {
//         const fetchEbooks = async () => {
//             try {
//                 const response = await axios.get('${server}/api/ebooks');
//                 setEbooks(response.data);
//             } catch (err) {
//                 console.error("Error fetching ebooks:", err);
//                 setError('Failed to fetch ebooks.');
//             } finally {
//                 setLoading(false);
//             }
//         };
//         fetchEbooks();
//     }, []);

//     const filteredEbooks = ebooks.filter(ebook =>
//         ebook.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         ebook.author.toLowerCase().includes(searchTerm.toLowerCase())
//     );

//     const handleRowClick = (id) => {
//         setExpandedRow(expandedRow === id ? null : id);
//     };

//     const EbookSkeletonRow = () => (
//         <>
//             <tr className="animate-pulse bg-white">
//                 <td className="py-3 px-4">
//                     <div className="flex items-center gap-2">
//                         <div className="h-5 w-5 bg-gray-200 rounded" />
//                         <div className="h-4 w-3/4 bg-gray-200 rounded" />
//                     </div>
//                 </td>
//                 <td className="py-3 px-4">
//                     <div className="h-4 w-2/3 bg-gray-200 rounded" />
//                 </td>
//                 <td className="py-3 px-4 text-right">
//                     <div className="h-6 w-6 bg-gray-200 rounded-md inline-block" />
//                 </td>
//             </tr>
//         </>
//     );

//     if (loading) {
//         return (
//             <div className="bg-white py-10 px-6 mx-auto max-w-screen-xl font-sans lg:max-w-3/4 lg:mx-auto">
//                 <h2 className="text-3xl font-bold text-sky-600 mb-6 border-b-2 border-sky-200 inline-block">Ebooks</h2>

//                 <div className="mb-6 h-10 bg-gray-200 rounded-md w-full animate-pulse" />

//                 <div className="overflow-x-auto shadow rounded-lg border border-gray-200">
//                     <table className="min-w-full bg-white">
//                         <thead className="bg-sky-50">
//                             <tr>
//                                 <th className="py-3 px-4 text-left text-gray-700 text-sm font-semibold">Title</th>
//                                 <th className="py-3 px-4 text-left text-gray-700 text-sm font-semibold">Author</th>
//                                 <th className="py-3 px-4 text-right text-gray-700 text-sm font-semibold">Download</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {Array.from({ length: 6 }).map((_, i) => (
//                                 <EbookSkeletonRow key={i} />
//                             ))}
//                         </tbody>
//                     </table>
//                 </div>
//             </div>
//         );
//     }

//     if (error) return <div className="text-red-500 text-center">{error}</div>;

//     return (
//         <div className="bg-white py-10 px-6 mx-auto max-w-screen-xl font-sans">
//             <h2 className="text-3xl font-bold text-sky-600 mb-6 border-b-2 border-sky-200 inline-block">Ebooks</h2>

//             <input
//                 type="text"
//                 placeholder="Search ebooks..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="mb-6 p-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-sky-500"
//             />

//             <div className="overflow-x-auto shadow rounded-lg border border-gray-200">
//                 <table className="min-w-full bg-white">
//                     <thead className="bg-sky-50">
//                         <tr>
//                             <th className="py-3 px-4 text-left text-gray-700 text-sm font-semibold">Title</th>
//                             <th className="py-3 px-4 text-left text-gray-700 text-sm font-semibold">Author</th>
//                             <th className="py-3 px-4 text-right text-gray-700 text-sm font-semibold">Download</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {filteredEbooks.map((ebook, index) => (
//                             <React.Fragment key={ebook._id}>
//                                 <tr
//                                     onClick={() => handleRowClick(ebook._id)}
//                                     className={`cursor-pointer transition hover:bg-sky-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
//                                 >
//                                     <td className="py-3 px-4 flex items-center gap-2 text-gray-800">
//                                         {expandedRow === ebook._id ? (
//                                             <ChevronDownIcon className="h-5 w-5 text-sky-600" />
//                                         ) : (
//                                             <ChevronRightIcon className="h-5 w-5 text-sky-600" />
//                                         )}
//                                         {ebook.title}
//                                     </td>
//                                     <td className="py-3 px-4 text-gray-700">{ebook.author}</td>
//                                     <td className="py-3 px-4 text-right">
//                                         <a
//                                             href={`${server}/api/ebooks/download/${ebook.fileName}`}
//                                             target="_blank"
//                                             rel="noopener noreferrer"
//                                             className="inline-flex items-center justify-center bg-sky-500 hover:bg-sky-600 text-white p-1.5 rounded-md"
//                                         >
//                                             <ArrowDownTrayIcon className="h-5 w-5" />
//                                         </a>
//                                     </td>
//                                 </tr>
//                                 {expandedRow === ebook._id && (
//                                     <tr className="bg-sky-50">
//                                         <td colSpan="3" className="py-4 px-6 text-sm text-gray-700">
//                                             <p><span className="font-semibold">Description:</span> {ebook.description}</p>
//                                             <p><span className="font-semibold">Uploaded At:</span> {new Date(ebook.uploadedAt).toLocaleDateString()}</p>
//                                         </td>
//                                     </tr>
//                                 )}
//                             </React.Fragment>
//                         ))}
//                     </tbody>
//                 </table>
//             </div>
//         </div>
//     );
// };

// export default Ebooks;



import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ArrowDownTrayIcon, ChevronDownIcon, ChevronRightIcon, BookOpenIcon } from '@heroicons/react/24/solid';
import { server } from '../main';

const Ebooks = () => {
    const [ebooks, setEbooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [expandedRow, setExpandedRow] = useState(null);

    useEffect(() => {
        const fetchEbooks = async () => {
            try {
                const response = await axios.get(`${server}/api/ebooks`);
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
    );

    if (loading) {
        return (
            <div className="bg-gradient-to-br from-sky-50 to-white py-12 px-4 sm:px-8 mx-auto lg:max-w-3/4 max-w-screen-xl rounded-3xl shadow-2xl border border-gray-100 mt-8 mb-12">
                <div className="flex items-center gap-3 mb-8">
                    <BookOpenIcon className="h-8 w-8 text-sky-600" />
                    <h2 className="text-3xl font-extrabold text-sky-700 tracking-tight">Ebooks</h2>
                </div>
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
        <div className="bg-gradient-to-br from-sky-50 to-white py-12 px-4 sm:px-8 mx-auto lg:max-w-3/4 max-w-screen-xl rounded-3xl shadow-2xl border border-gray-100 mt-8 mb-12">
            <div className="flex items-center gap-3 mb-8">
                <BookOpenIcon className="h-8 w-8 text-sky-600" />
                <h2 className="text-3xl font-extrabold text-sky-700 tracking-tight">Ebooks</h2>
            </div>

            <input
                type="text"
                placeholder="🔍 Search ebooks by title or author..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="mb-8 p-3 border border-sky-200 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-sky-400 bg-white shadow"
            />

            <div className="overflow-x-auto shadow-lg rounded-2xl border border-sky-100 bg-white">
                <table className="min-w-full bg-white rounded-2xl overflow-hidden">
                    <thead className="bg-sky-100">
                        <tr>
                            <th className="py-3 px-4 text-left text-sky-800 text-base font-semibold">Title</th>
                            <th className="py-3 px-4 text-left text-sky-800 text-base font-semibold">Author</th>
                            <th className="py-3 px-4 text-right text-sky-800 text-base font-semibold">Download</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredEbooks.length === 0 && (
                            <tr>
                                <td colSpan={3} className="py-8 text-center text-gray-500">
                                    No ebooks found.
                                </td>
                            </tr>
                        )}
                        {filteredEbooks.map((ebook, index) => (
                            <React.Fragment key={ebook._id}>
                                <tr
                                    onClick={() => handleRowClick(ebook._id)}
                                    className={`cursor-pointer transition hover:bg-sky-50 ${index % 2 === 0 ? 'bg-white' : 'bg-sky-50'}`}
                                >
                                    <td className="py-3 px-4 flex items-center gap-2 text-gray-900 font-medium">
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
                                            href={`${server}/api/ebooks/download/${ebook.fileName}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center justify-center bg-gradient-to-r from-sky-500 to-sky-400 hover:from-sky-600 hover:to-sky-500 text-white p-2 rounded-lg shadow transition"
                                            title="Download"
                                        >
                                            <ArrowDownTrayIcon className="h-5 w-5" />
                                        </a>
                                    </td>
                                </tr>
                                {expandedRow === ebook._id && (
                                    <tr className="bg-sky-50 transition-all">
                                        <td colSpan="3" className="py-5 px-8 text-sm text-gray-700 border-t border-sky-100">
                                            <div className="mb-2">
                                                <span className="font-semibold text-sky-700">Description:</span>{" "}
                                                {ebook.description || <span className="italic text-gray-400">No description provided.</span>}
                                            </div>
                                            <div>
                                                <span className="font-semibold text-sky-700">Uploaded At:</span>{" "}
                                                {ebook.uploadedAt ? new Date(ebook.uploadedAt).toLocaleDateString() : "N/A"}
                                            </div>
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
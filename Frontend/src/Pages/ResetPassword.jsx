// import React, { useState } from 'react';
// import { useParams } from 'react-router-dom';

// const ResetPassword = () => {
//   const { token } = useParams();
//   const [newPassword, setNewPassword] = useState('');
//   const [showPassword, setShowPassword] = useState(false);
//   const [message, setMessage] = useState('');
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setMessage('');
//     setError('');
//     setLoading(true);

//     try {
//       const response = await fetch(`${server}/api/user/reset?token=${token}`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ password: newPassword }),
//       });

//       const data = await response.json();

//       if (response.ok) {
//         setMessage('✅ Password reset successfully! You can now log in with your new password.');
//         setNewPassword('');
//       } else {
//         setError(data.message || 'Failed to reset password.');
//       }
//     } catch (err) {
//       setError('An error occurred. Please try again.');
//     }
//     setLoading(false);
//   };

//   return (
//     <div className="flex items-center justify-center min-h-screen bg-[#f5faff] px-4">
//       <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md border border-sky-100">
//         <h2 className="text-3xl font-bold text-center text-[#1a365d] mb-6">Reset Your Password</h2>
//         <form onSubmit={handleSubmit} className="space-y-5">
//           <div>
//             <label className="block text-gray-700 font-semibold mb-2" htmlFor="new-password">
//               New Password
//             </label>
//             <div className="relative">
//               <input
//                 id="new-password"
//                 type={showPassword ? "text" : "password"}
//                 placeholder="Enter new password"
//                 value={newPassword}
//                 onChange={(e) => setNewPassword(e.target.value)}
//                 className="w-full border border-sky-200 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400 transition pr-12"
//                 required
//                 minLength={6}
//               />
//               <button
//                 type="button"
//                 className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-sky-600"
//                 onClick={() => setShowPassword((prev) => !prev)}
//                 tabIndex={-1}
//               >
//                 {showPassword ? (
//                   // Eye Off SVG
//                   <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-5 0-9-4.03-9-9 0-1.657.404-3.22 1.125-4.575M6.22 6.22A9.956 9.956 0 0112 5c5 0 9 4.03 9 9 0 1.657-.404 3.22-1.125 4.575M15 12a3 3 0 11-6 0 3 3 0 016 0zM3 3l18 18" />
//                   </svg>
//                 ) : (
//                   // Eye SVG
//                   <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
//                   </svg>
//                 )}
//               </button>
//             </div>
//           </div>
//           {message && <div className="text-green-600 text-center">{message}</div>}
//           {error && <div className="text-red-600 text-center">{error}</div>}
//           <button
//             type="submit"
//             className="w-full bg-sky-600 hover:bg-sky-700 text-white font-semibold py-2 rounded-lg shadow transition"
//             disabled={loading}
//           >
//             {loading ? 'Submitting...' : 'Reset Password'}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default ResetPassword;



import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { server } from '../main';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setLoading(true);

    try {
      const response = await fetch(`${server}/api/user/reset?token=${token}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password: newPassword }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('✅ Password reset successfully! Redirecting to login...');
        setNewPassword('');
        setTimeout(() => {
          // Redirect to home and open login modal
          navigate('/', { state: { openLogin: true } });
        }, 1800);
      } else {
        setError(data.message || 'Failed to reset password.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#f5faff] px-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md border border-sky-100">
        <h2 className="text-3xl font-bold text-center text-[#1a365d] mb-6">Reset Your Password</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-gray-700 font-semibold mb-2" htmlFor="new-password">
              New Password
            </label>
            <div className="relative">
              <input
                id="new-password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full border border-sky-200 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400 transition pr-12"
                required
                minLength={6}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-sky-600"
                onClick={() => setShowPassword((prev) => !prev)}
                tabIndex={-1}
              >
                {showPassword ? (
                  // Eye Off SVG
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-5 0-9-4.03-9-9 0-1.657.404-3.22 1.125-4.575M6.22 6.22A9.956 9.956 0 0112 5c5 0 9 4.03 9 9 0 1.657-.404 3.22-1.125 4.575M15 12a3 3 0 11-6 0 3 3 0 016 0zM3 3l18 18" />
                  </svg>
                ) : (
                  // Eye SVG
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
          </div>
          {message && <div className="text-green-600 text-center">{message}</div>}
          {error && <div className="text-red-600 text-center">{error}</div>}
          <button
            type="submit"
            className="w-full bg-sky-600 hover:bg-sky-700 text-white font-semibold py-2 rounded-lg shadow transition"
            disabled={loading}
          >
            {loading ? 'Submitting...' : 'Reset Password'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
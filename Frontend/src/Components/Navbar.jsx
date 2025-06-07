import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from 'react-modal';
import { UserCircleIcon, ShoppingCartIcon } from '@heroicons/react/24/outline';
import { UserData } from '../Context/UserContext';

Modal.setAppElement('#root'); // Make sure your root element id is 'root'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [isLogin, setIsLogin] = useState(true); // true = login, false = signup
  const [otpModalOpen, setOtpModalOpen] = useState(false);


  const { isAuth, loginUser, registerUser, verifyOtp, btnLoading, logoutUser } = UserData();

  const navigate = useNavigate();

  // Form states
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupMobile, setSignupMobile] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirmPassword, setSignupConfirmPassword] = useState('');
  const [signupError, setSignupError] = useState('');
  const [otp, setOtp] = useState('');
  const [otpError, setOtpError] = useState('');

  // Handle login
  const handleLogin = (e) => {
    e.preventDefault();
    loginUser(loginEmail, loginPassword, () => setModalIsOpen(false));
  };

  // Handle logout
  const handleLogout = () => {
    logoutUser();
    navigate('/');
  };

  // Handle signup
  const handleSignup = async (e) => {
    e.preventDefault();
    if (signupPassword !== signupConfirmPassword) {
      setSignupError("Passwords do not match");
      return;
    }
    setSignupError('');
    // Call registerUser, but don't close modal yet
    await registerUser(signupName, signupEmail, signupMobile, signupPassword, () => {
      setModalIsOpen(false);
      setOtpModalOpen(true); // Open OTP modal
    });
  };

  // Handle OTP verification
  const handleOtpVerify = async (e) => {
    e.preventDefault();
    if (!otp) {
      setOtpError("Please enter the OTP");
      return;
    }
    setOtpError('');
    await verifyOtp(parseInt(otp), () => {
      setOtpModalOpen(false);
      setIsLogin(true);
      setModalIsOpen(false);
    });
  };

  // Resetting all form states
  const resetAuthForms = () => {
    setLoginEmail('');
    setLoginPassword('');
    setSignupName('');
    setSignupEmail('');
    setSignupMobile('');
    setSignupPassword('');
    setSignupConfirmPassword('');
    setSignupError('');
    setOtp('');
    setOtpError('');
  };

  return (
    <nav className="bg-white shadow-lg mb-1">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-around h-16 ">
          <div className="w-full items-center flex justify-between ">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center">
              <a href="/" className="text-xl font-bold text-sky-600 ">
                Ayurveda Clinic
              </a>
            </div>
            {/* Links for larger screens */}
            <div className="hidden md:flex ">
              <a href="/" className="text-gray-800 hover:text-sky-600 px-3 py-2 rounded-md text-sm font-medium">Home</a>
              <a href="/products" className="text-gray-800 hover:text-sky-600 px-3 py-2 rounded-md text-sm font-medium">Products</a>
              <a href="/consulting" className="text-gray-800 hover:text-sky-600 px-3 py-2 rounded-md text-sm font-medium">Consulting</a>
              <a href="/blogs" className="text-gray-800 hover:text-sky-600 px-3 py-2 rounded-md text-sm font-medium">Blogs</a>
              <a href="/ebooks" className="text-gray-800 hover:text-sky-600 px-3 py-2 rounded-md text-sm font-medium">E-Books</a>
              <a href="/about" className="text-gray-800 hover:text-sky-600 px-3 py-2 rounded-md text-sm font-medium">About</a>
            </div>

            {/* Login Button or User/Cart Icons */}
            {!isAuth ? (
              <button
                onClick={() => {
                  resetAuthForms();
                  setModalIsOpen(true);
                  setIsLogin(true);
                }}
                className="hidden md:inline-block bg-sky-600 text-white px-4 py-2 rounded-md hover:bg-sky-700 transition duration-200 ml-10"
              >
                Login
              </button>
            ) : (
              <div className='cart-user-logout flex items-center gap-4 ml-10'>
                <div>
                  <ShoppingCartIcon className="h-6 w-6" />
                </div>
                <div>
                  <UserCircleIcon className="h-6 w-6" />
                </div>
                <div>
                  <button
                    onClick={handleLogout}
                    className="hidden md:inline-block bg-sky-600 text-white px-4 py-2 rounded-md hover:bg-sky-700 transition duration-200"
                  >
                    Logout
                  </button>
                  {/* <a href="/" className="hidden md:inline-block bg-sky-600 text-white px-4 py-2 rounded-md hover:bg-sky-700 transition duration-200">
                    Logout
                  </a> */}
                </div>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="bg-gray-100 p-2 rounded-md inline-flex items-center justify-center text-gray-600 hover:bg-gray-200 focus:outline-none"
            >
              <span className="sr-only">Open main menu</span>
              {!isOpen ? (
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                </svg>
              ) : (
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu items */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <a href="/" className="block text-gray-800 hover:text-sky-600 px-3 py-2 rounded-md text-base font-medium">Home</a>
            <a href="/products" className="block text-gray-800 hover:text-sky-600 px-3 py-2 rounded-md text-base font-medium">Products</a>
            <a href="/consulting" className="block text-gray-800 hover:text-sky-600 px-3 py-2 rounded-md text-base font-medium">Consulting</a>
            <a href="/blogs" className="block text-gray-800 hover:text-sky-600 px-3 py-2 rounded-md text-base font-medium">Blogs</a>
            <a href="/ebooks" className="block text-gray-800 hover:text-sky-600 px-3 py-2 rounded-md text-base font-medium">E-Books</a>
            <a href="/about" className="block text-gray-800 hover:text-sky-600 px-3 py-2 rounded-md text-base font-medium">About</a>
          </div>
        </div>
      )}

      {/* Login/Signup Modal */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        contentLabel="Login/Signup Modal"
        className="max-w-md mx-auto  bg-white px-10 py-12 rounded-2xl shadow-lg outline-none"
        overlayClassName="fixed inset-0 bg-black/60 flex items-center justify-center backdrop-blur-lg z-50"
        bodyOpenClassName="modal-open"
      >
        <div>
          <div className="flex justify-between mb-4">
            <button
              className={`px-4 py-2 rounded ${isLogin ? 'bg-sky-600 text-white' : 'bg-gray-200'}`}
              onClick={() => setIsLogin(true)}
            >
              Login
            </button>
            <button
              className={`px-4 py-2 rounded ${!isLogin ? 'bg-sky-600 text-white' : 'bg-gray-200'}`}
              onClick={() => setIsLogin(false)}
            >
              Sign Up
            </button>
            <button
              onClick={() => setModalIsOpen(false)}
              className="ml-auto text-gray-500 hover:text-black font-bold text-3xl leading-none"
              aria-label="Close modal"
            >
              &times;
            </button>
          </div>
          {isLogin ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <input
                type="email"
                placeholder="Email"
                value={loginEmail}
                onChange={e => setLoginEmail(e.target.value)}
                className="w-full border px-3 py-2 rounded-md"
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={loginPassword}
                onChange={e => setLoginPassword(e.target.value)}
                className="w-full border px-3 py-2 rounded-md"
                required
              />
              <button
                type="submit"
                className="w-full bg-sky-600 text-white py-2 rounded-md hover:bg-sky-700"
                disabled={btnLoading}
              >
                {btnLoading ? 'Logging in...' : 'Login'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleSignup} className="space-y-4">
              <input
                type="text"
                placeholder="Full Name"
                value={signupName}
                onChange={e => setSignupName(e.target.value)}
                className="w-full border px-3 py-2 rounded-md"
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={signupEmail}
                onChange={e => setSignupEmail(e.target.value)}
                className="w-full border px-3 py-2 rounded-md"
                required
              />
              <input
                type="text"
                placeholder="Mobile Number"
                value={signupMobile}
                onChange={e => setSignupMobile(e.target.value)}
                className="w-full border px-3 py-2 rounded-md"
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={signupPassword}
                onChange={e => setSignupPassword(e.target.value)}
                className="w-full border px-3 py-2 rounded-md"
                required
              />
              <input
                type="password"
                placeholder="Confirm Password"
                value={signupConfirmPassword}
                onChange={e => setSignupConfirmPassword(e.target.value)}
                className="w-full border px-3 py-2 rounded-md"
                required
              />
              {signupError && (
                <div className="text-red-500 text-sm">{signupError}</div>
              )}
              <button
                type="submit"
                className="w-full bg-sky-600 text-white py-2 rounded-md hover:bg-sky-700"
                disabled={btnLoading}
              >
                {btnLoading ? 'Signing up...' : 'Sign Up'}
              </button>
            </form>
          )}
        </div>
      </Modal>

      {/* OTP Modal */}
      <Modal
        isOpen={otpModalOpen}
        onRequestClose={() => setOtpModalOpen(false)}
        contentLabel="OTP Verification"
        className="max-w-md mx-auto bg-white px-10 py-12 rounded-2xl shadow-lg outline-none"
        overlayClassName="fixed inset-0 bg-black/60 flex items-center justify-center backdrop-blur-lg z-50"
        bodyOpenClassName="modal-open"
      >
        <div>
          <div className="flex justify-between mb-4">
            <h2 className="text-xl font-bold">OTP Verification</h2>
            <button
              onClick={() => setOtpModalOpen(false)}
              className="ml-auto text-gray-500 hover:text-black font-bold text-3xl leading-none"
              aria-label="Close modal"
            >
              &times;
            </button>
          </div>
          <form onSubmit={handleOtpVerify} className="space-y-4">
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={e => setOtp(e.target.value)}
              className="w-full border px-3 py-2 rounded-md"
              required
            />
            {otpError && (
              <div className="text-red-500 text-sm">{otpError}</div>
            )}
            <button
              type="submit"
              className="w-full bg-sky-600 text-white py-2 rounded-md hover:bg-sky-700"
              disabled={btnLoading}
            >
              {btnLoading ? 'Verifying...' : 'Verify OTP'}
            </button>
          </form>
        </div>
      </Modal>


    </nav>
  );
};

export default Navbar;
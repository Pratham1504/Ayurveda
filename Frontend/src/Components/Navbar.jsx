import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from 'react-modal';
import { UserCircleIcon, ShoppingCartIcon } from '@heroicons/react/24/outline';
import { UserData } from '../Context/UserContext';

Modal.setAppElement('#root'); // Make sure your root element id is 'root'

const Navbar = ({ setCartVisible }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [isLogin, setIsLogin] = useState(true); // true = login, false = signup
  const [otpModalOpen, setOtpModalOpen] = useState(false);


  const { isAuth, loginUser, registerUser, verifyOtp, btnLoading, logoutUser, user } = UserData();

  const [profileCardOpen, setProfileCardOpen] = useState(false);

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

  // Forgot Password states
  const [forgotModalOpen, setForgotModalOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotMsg, setForgotMsg] = useState('');
  const [forgotError, setForgotError] = useState('');

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
                  <ShoppingCartIcon
                    className="h-6 w-6 cursor-pointer"
                    onClick={() => setCartVisible(true)}
                  />
                </div>
                <div className="relative inline-block">
                  <UserCircleIcon
                    className="h-6 w-6 cursor-pointer"
                    onClick={() => setProfileCardOpen((open) => !open)}
                  />
                  {profileCardOpen && (
                    <div className="absolute right-0 mt-2 w-64 bg-white shadow-lg rounded-lg p-4 z-50 border">
                      <button
                        className="absolute top-2 right-2 text-gray-400 hover:text-black font-bold"
                        onClick={() => setProfileCardOpen(false)}
                        aria-label="Close"
                      >
                        &times;
                      </button>
                      <div className="space-y-2 mt-2">
                        <div>
                          <span className="font-semibold">Name:</span> {user.fullName || '-'}
                        </div>
                        <div>
                          <span className="font-semibold">Email:</span> {user.email || '-'}
                        </div>
                        <div>
                          <span className="font-semibold">Mobile:</span> {user.mobileNo || '-'}
                        </div>
                        <button
                          className="mt-4 w-full bg-sky-600 text-white py-2 rounded-md hover:bg-sky-700 transition"
                          onClick={() => {
                            setProfileCardOpen(false);
                            navigate('/my-orders');
                          }}
                        >
                          My Orders
                        </button>
                      </div>
                    </div>
                  )}
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
        className="max-w-md mx-auto h-[70vh] flex flex-col justify-center bg-white px-10 py-12 rounded-2xl shadow-lg outline-none relative"
        overlayClassName="fixed inset-0 bg-black/60 flex items-center justify-center backdrop-blur-lg z-50"
        bodyOpenClassName="modal-open"
      >
        <div className="flex-shrink-0 flex items-center justify-center m-10">
          <a href="/" className="text-4xl font-bold text-sky-600 ">
            Ayurveda Clinic
          </a>
        </div>
        <div className=''>
          <div className="flex flex-col justify-center items-center mb-4">

            
            
            {/* <div className="login-signup-buttons flex justify-center mb-4">
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
            </div> */}
            {isLogin ? (
              <div className='text-2xl font-semibold'>
                Sign in to your account
              </div>
            ) : (
              <div className='text-2xl font-semibold'>
                Create a new account
              </div>
            ) }
          </div>
          <div className='cross-button'>
            <button
              onClick={() => setModalIsOpen(false)}
              className="absolute top-2 right-3 text-gray-500 hover:text-black font-bold text-3xl leading-none z-10"
              aria-label="Close modal"
            >
              &times;
            </button>
          </div>
          {isLogin ? (
            <form onSubmit={handleLogin} className="">
              <input
                type="email"
                placeholder="Email"
                value={loginEmail}
                onChange={e => setLoginEmail(e.target.value)}
                className="w-full border px-3 py-2 rounded-md my-2"
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={loginPassword}
                onChange={e => setLoginPassword(e.target.value)}
                className="w-full border px-3 py-2 rounded-md my-2"
                required
              />
              <button
                type="submit"
                className="w-full mt-4 bg-sky-600 text-white py-2 rounded-md hover:bg-sky-700"
                disabled={btnLoading}
              >
                {btnLoading ? 'Logging in...' : 'Login'}
              </button>
              <div className="text-center">
                <button
                  type="button"
                  className="text-sky-600 text-md hover:underline m-0 mt-8"
                  onClick={() => {
                    setModalIsOpen(false);
                    setForgotModalOpen(true);
                    setForgotMsg('');
                    setForgotError('');
                    setForgotEmail('');
                  }}
                >
                  Forgot Password?
                </button>
              </div>
              <div className='mt-2 text-md text-center'>
                Don't have an account? <span className="text-sky-600 cursor-pointer" onClick={() => { setIsLogin(false); resetAuthForms(); }}>Register here</span>
              </div>
              <div className='text-center mt-4'>
                <button className='types-of-use text-sky-600 text-md hover:underline m-0 mt-6' onClick={() => {
                  window.open('https://www.example.com/terms-of-use', '_blank');
                }}>
                  Terms of Use | Privacy Policy
                </button>
              </div>
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
                className="w-full mt-4 bg-sky-600 text-white py-2 rounded-md hover:bg-sky-700"
                disabled={btnLoading}
              >
                {btnLoading ? 'Signing up...' : 'Sign Up'}
              </button>
              <div className='text-center'>
                Already have an account? <span className="text-sky-600 cursor-pointer" onClick={() => { setIsLogin(true); resetAuthForms(); }}>Login</span>
              </div>

              <div className='text-center mt-6'>
                <div className='text-grey-600'>By signing up, you agree to our </div>
                <button className='types-of-use text-sky-600 text-md hover:underline m-0 mt-1' onClick={() => {
                  window.open('https://www.example.com/terms-of-use', '_blank');
                }}>
                  
                  Terms of Use | Privacy Policy
                </button>
              </div>
              
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

      <Modal
        isOpen={forgotModalOpen}
        onRequestClose={() => setForgotModalOpen(false)}
        contentLabel="Forgot Password"
        className="max-w-md mx-auto bg-white px-10 py-12 rounded-2xl shadow-lg outline-none"
        overlayClassName="fixed inset-0 bg-black/60 flex items-center justify-center backdrop-blur-lg z-50"
      >
        <div>
          <div className="flex justify-between mb-4">
            <h2 className="text-xl font-bold">Forgot Password</h2>
            <button
              onClick={() => setForgotModalOpen(false)}
              className="ml-auto text-gray-500 hover:text-black font-bold text-3xl leading-none"
              aria-label="Close modal"
            >
              &times;
            </button>
          </div>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              setForgotMsg('');
              setForgotError('');
              try {
                const res = await fetch('http://localhost:4000/api/user/forgot', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ email: forgotEmail }),
                });
                const data = await res.json();
                if (res.ok) {
                  setForgotMsg('Reset link sent to your email.');
                } else {
                  setForgotError(data.message || 'Something went wrong.');
                }
              } catch {
                setForgotError('Something went wrong.');
              }
            }}
            className="space-y-4"
          >
            <input
              type="email"
              placeholder="Enter your email"
              value={forgotEmail}
              onChange={e => setForgotEmail(e.target.value)}
              className="w-full border px-3 py-2 rounded-md"
              required
            />
            {forgotMsg && <div className="text-green-600 text-sm">{forgotMsg}</div>}
            {forgotError && <div className="text-red-500 text-sm">{forgotError}</div>}
            <button
              type="submit"
              className="w-full bg-sky-600 text-white py-2 rounded-md hover:bg-sky-700"
            >
              Send Reset Link
            </button>
          </form>
        </div>
      </Modal>


    </nav>
  );
};

export default Navbar;
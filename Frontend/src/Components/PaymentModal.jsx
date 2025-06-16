import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { XMarkIcon, ClipboardIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

const PaymentModal = ({ isOpen, onClose, onConfirm, heading }) => {
    const [txnId, setTxnId] = useState('');
    const upiId = "7009582259@ptsbi";

    const isValidUTR = (utr) => /^\d{12}$/.test(utr);

    const handleCopy = () => {
        navigator.clipboard.writeText(upiId);
        toast.success("UPI ID copied!");
    };

    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === "Escape") onClose();
        };

        if (isOpen) {
            document.addEventListener("keydown", handleEsc);
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.removeEventListener("keydown", handleEsc);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);



    const handleConfirm = () => {
        if (!txnId.trim()) {
            toast.error("Please enter transaction ID");
            return;
        }

        if (!isValidUTR(txnId)) {
            toast.error("Please enter a valid 12-digit UPI reference number.");
            return;
        }

        onConfirm(txnId);
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm pb-safe"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                >
                    <motion.div
                        className="relative w-full max-w-md mx-auto bg-white rounded-3xl shadow-2xl p-6 sm:p-8 border border-gray-100"
                        initial={{ scale: 0.9 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0.9 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Close Button */}
                        <button
                            onClick={onClose}
                            className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
                        >
                            <XMarkIcon className="w-6 h-6" />
                        </button>

                        {/* Title */}
                        <div className="text-center mb-5">
                            <h2 className="text-2xl font-bold text-sky-700">{heading}</h2>
                            <p className="text-sm text-gray-500 mt-1">Use UPI to complete the payment</p>
                        </div>

                        {/* QR Code + UPI ID */}
                        <div className="flex flex-col items-center space-y-3 my-5">
                            <img
                                src="../assets/qr.jpeg"
                                alt="UPI QR"
                                className="w-44 h-44 rounded-lg shadow border border-gray-200  border rounded-xl shadow-md"
                            />
                            <div className="flex items-center bg-gray-100 px-3 py-2 rounded-xl">
                                <span className="text-sm font-medium text-gray-700">{upiId}</span>
                                <button onClick={handleCopy} className="ml-2 text-sky-600 hover:text-sky-800" title="Copy UPI ID">
                                    <ClipboardIcon className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* Transaction ID Field */}
                        <div className="mt-6">
                            <label className="block text-sm font-medium text-gray-600 mb-1">
                                UPI Reference / UTR Number
                            </label>
                            <input
                                type="text"
                                value={txnId}
                                onChange={(e) => setTxnId(e.target.value)}
                                placeholder="Enter 12-digit UPI reference"
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-sky-300 focus:outline-none text-sm"
                            />
                        </div>

                        {/* Confirm Button */}
                        <button
                            onClick={handleConfirm}
                            className="mt-6 w-full flex items-center justify-center gap-2 bg-sky-600 hover:bg-sky-700 text-white font-semibold py-2.5 rounded-xl shadow transition-all"
                        >
                            <CheckCircleIcon className="w-5 h-5" />
                            Confirm Payment
                        </button>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default PaymentModal;

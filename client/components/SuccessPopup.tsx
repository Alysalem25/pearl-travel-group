'use client';

import React from "react";

interface SuccessPopupProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
}

const SuccessPopup: React.FC<SuccessPopupProps> = ({
  isOpen,
  onClose,
  title,
  message
}) => {

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">

      <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center shadow-xl">

        <div className="flex justify-center mb-4">
          <div className="w-14 h-14 flex items-center justify-center rounded-full bg-green-100 text-green-600 text-2xl">
            ✓
          </div>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {title || "Success"}
        </h2>

        <p className="text-gray-600 mb-6">
          {message || "Operation completed successfully."}
        </p>

        <button
          onClick={onClose}
          className="px-6 py-2 bg-blue-900 text-white rounded-full hover:bg-blue-950 transition"
        >
          Close
        </button>

      </div>
    </div>
  );
};

export default SuccessPopup;
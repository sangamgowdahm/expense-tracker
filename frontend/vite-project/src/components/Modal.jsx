import React from "react";

const Modal = ({ children, isOpen, onClose, title }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center bg-black/30 backdrop-blur-sm overflow-y-auto">
      <div className="relative p-4 w-full max-w-2xl">
        {/* Modal content */}
        <div className="bg-white rounded-lg shadow-lg">
          {/* Modal header */}
          <div className="flex items-center justify-between p-5 border-b border-gray-200 rounded-t">
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            <button
              type="button"
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full w-8 h-8 flex items-center justify-center transition"
            >
              ×
            </button>
          </div>

          {/* Modal body */}
          <div className="p-5 text-gray-800">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;

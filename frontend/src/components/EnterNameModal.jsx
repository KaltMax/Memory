// src/EnterNameModal.jsx
import PropTypes from 'prop-types';
import { useState } from 'react';

const EnterNameModal = ({ onSubmit }) => {
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = () => {
    const trimmedName = inputValue.trim();
    onSubmit(trimmedName || 'Unknown Player');
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[#1F1F1F] bg-opacity-50 z-50">
      <div className="bg-white text-black p-6 rounded-xl shadow-lg w-80">
        <h2 className="text-lg font-semibold mb-4">What&apos;s your name?</h2>
        <input
          type="text"
          className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
          placeholder="Enter Your Name..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          autoFocus
        />
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full"
          onClick={handleSubmit}
        >
          Start
        </button>
      </div>
    </div>
  );
};

EnterNameModal.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};

export default EnterNameModal;

import React, { useRef, useEffect } from 'react';

const OTPInput = ({ 
  value = '',
  length = 6,
  onChange,
  disabled = false
}) => {
  const inputRefs = useRef([]);
  
  // Initialize our refs array with the correct length
  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, length);
  }, [length]);

  // Fill the value into the inputs
  useEffect(() => {
    // For each input ref, set its value based on the value string
    for (let i = 0; i < length; i++) {
      const input = inputRefs.current[i];
      if (input) {
        input.value = value[i] || '';
      }
    }
  }, [value, length]);

  const handleChange = (e, index) => {
    const target = e.target;
    const val = target.value;
    
    // Only take the last character if multiple were somehow pasted/entered
    const char = val.slice(-1);
    
    // Generate the new value string by replacing the character at the given index
    const newValue = value.split('');
    newValue[index] = char;
    onChange(newValue.join(''));
    
    // Move focus to next input if a character was entered
    if (char && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    // Handle backspace (move to previous input)
    if (e.key === 'Backspace' && !value[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    
    // Handle left arrow key
    if (e.key === 'ArrowLeft' && index > 0) {
      e.preventDefault();
      inputRefs.current[index - 1]?.focus();
    }
    
    // Handle right arrow key
    if (e.key === 'ArrowRight' && index < length - 1) {
      e.preventDefault();
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text/plain').trim();
    
    // Only use up to 'length' characters from the pasted data
    if (pastedData) {
      const newValue = pastedData.slice(0, length);
      onChange(newValue);
      
      // Focus the next empty input (if any)
      const nextEmptyIndex = newValue.length;
      if (nextEmptyIndex < length) {
        inputRefs.current[nextEmptyIndex]?.focus();
      } else {
        // If all inputs filled, focus the last one
        inputRefs.current[length - 1]?.focus();
      }
    }
  };

  return (
    <div className="flex items-center justify-center space-x-2 sm:space-x-3">
      {Array.from({ length }, (_, i) => (
        <div key={i} className="relative">
          <input
            ref={(el) => inputRefs.current[i] = el}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={1}
            disabled={disabled}
            className="w-10 h-12 sm:w-12 sm:h-14 text-center font-medium text-lg text-white bg-zinc-800/60 
                     border-2 border-zinc-700 focus:border-indigo-500 rounded-lg shadow-inner 
                     focus:outline-none focus:ring-1 focus:ring-indigo-400 focus:ring-opacity-50
                     disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-150
                     backdrop-blur-sm"
            onChange={(e) => handleChange(e, i)}
            onKeyDown={(e) => handleKeyDown(e, i)}
            onPaste={i === 0 ? handlePaste : undefined}
            aria-label={`OTP digit ${i + 1}`}
          />
          {i < length - 1 && i % 3 === 2 && (
            <div className="absolute -right-3 top-1/2 transform -translate-y-1/2 text-zinc-500">-</div>
          )}
        </div>
      ))}
    </div>
  );
};

export default OTPInput;
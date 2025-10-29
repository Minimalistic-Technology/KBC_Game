// 'use client';

// import React, { useState, useRef, ChangeEvent, KeyboardEvent } from 'react';
// import { motion, Variants } from 'framer-motion';
// import { Lock, ArrowRight } from 'lucide-react';

// interface PinModalProps {
//   onVerify: () => void;
//   correctPin: string;
// }

// const PIN_LENGTH = 4;

// export const PinVerificationModal = ({ onVerify, correctPin }: PinModalProps) => {
//   const [pin, setPin] = useState<string[]>(Array(PIN_LENGTH).fill(''));
//   const [error, setError] = useState('');
//   const [isShaking, setIsShaking] = useState(false);
//   const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

//   const handleChange = (e: ChangeEvent<HTMLInputElement>, index: number) => {
//     const value = e.target.value;
//     if (/^\d?$/.test(value)) {
//       const newPin = [...pin];
//       newPin[index] = value;
//       setPin(newPin);
//       setError('');

//       if (value && index < PIN_LENGTH - 1) {
//         inputRefs.current[index + 1]?.focus();
//       }
//     }
//   };

//   const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
//     if (e.key === 'Backspace' && !pin[index] && index > 0) {
//       inputRefs.current[index - 1]?.focus();
//     }
//   };

//   const handleSubmit = () => {
//     const enteredPin = pin.join('');
//     if (enteredPin.length < PIN_LENGTH) {
//       setError(`Please enter a ${PIN_LENGTH}-digit PIN.`);
//       return;
//     }

//     if (enteredPin === correctPin) {
//       onVerify();
//     } else {
//       setError('Incorrect PIN. Please try again.');
//       setPin(Array(PIN_LENGTH).fill(''));
//       setIsShaking(true);
//       setTimeout(() => setIsShaking(false), 500);
//       inputRefs.current[0]?.focus();
//     }
//   };

//   const shakeVariants: Variants = {
//     shake: {
//       x: [0, -10, 10, -10, 10, 0],
//       transition: { duration: 0.4, ease: 'easeInOut' }
//     },
//     initial: { x: 0 }
//   };

//   return (
//     <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
//       <motion.div 
//         initial={{ scale: 0.9, opacity: 0 }}
//         animate={{ scale: 1, opacity: 1 }}
//         transition={{ type: 'spring', stiffness: 300, damping: 20 }}
//         className="bg-white rounded-2xl shadow-2xl w-full max-w-sm"
//       >
//         <div className="p-8 text-center">
//             <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100">
//                 <Lock className="h-8 w-8 text-indigo-600" />
//             </div>
//             <h2 className="mt-6 text-2xl font-bold text-slate-900">Verification Required</h2>
//             <p className="mt-2 text-slate-600">Enter the admin PIN to access this page.</p>

//             <motion.div
//                 variants={shakeVariants}
//                 animate={isShaking ? 'shake' : 'initial'}
//                 className="mt-8"
//             >
//                 <div className="flex justify-center gap-3">
//                     {pin.map((digit, index) => (
//                         <input
//                             key={index}
//                             ref={el => { inputRefs.current[index] = el; }}
//                             type="password" // --- UPDATED THIS LINE ---
//                             inputMode="numeric"
//                             value={digit}
//                             onChange={(e) => handleChange(e, index)}
//                             onKeyDown={(e) => handleKeyDown(e, index)}
//                             maxLength={1}
//                             autoFocus={index === 0}
//                             // --- ADDED styling for password dots ---
//                             className="h-16 w-12 rounded-lg border-2 border-slate-300 bg-slate-50 text-center text-3xl font-bold text-slate-900 transition-colors duration-200 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300 [font-family:monospace] pt-2"
//                         />
//                     ))}
//                 </div>
//                 {error && <p className="text-red-500 text-sm font-semibold mt-4">{error}</p>}
//             </motion.div>

//             <button 
//                 onClick={handleSubmit}
//                 disabled={pin.join('').length < PIN_LENGTH}
//                 className="w-full mt-8 inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-5 h-12 text-md font-semibold text-white shadow-sm transition-all hover:bg-indigo-700 disabled:bg-slate-400 disabled:cursor-not-allowed disabled:shadow-none"
//             >
//                 Verify Access <ArrowRight size={18} />
//             </button>
//         </div>
//       </motion.div>
//     </div>
//   );
// };


'use client';

import React, { useState, useRef, ChangeEvent, KeyboardEvent } from 'react';
import { motion, Variants } from 'framer-motion';
import { Lock, ArrowRight } from 'lucide-react';
import axios from 'axios';
import axiosInstance from '@/utils/axiosInstance';
interface PinModalProps {
  onVerify: () => void; // called on successful verification
}

const PIN_LENGTH = 4;

export const PinVerificationModal = ({ onVerify }: PinModalProps) => {
  const [pin, setPin] = useState<string[]>(Array(PIN_LENGTH).fill(''));
  const [error, setError] = useState('');
  const [isShaking, setIsShaking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value;
    if (/^\d?$/.test(value)) {
      const newPin = [...pin];
      newPin[index] = value;
      setPin(newPin);
      setError('');

      if (value && index < PIN_LENGTH - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && !pin[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async () => {
    const enteredPin = pin.join('');
    if (enteredPin.length < PIN_LENGTH) {
      setError(`Please enter a ${PIN_LENGTH}-digit PIN.`);
      return;
    }

    try {
      setIsLoading(true);
      const res = await axiosInstance.post(
        '/api/pin/verify',
        { pin: enteredPin },
        { withCredentials: true }
      );

      if (res.data.success) {
        onVerify(); // 🔥 Trigger success action (e.g., unlock page)
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Invalid PIN. Please try again.';
      setError(msg);
      setPin(Array(PIN_LENGTH).fill(''));
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
      inputRefs.current[0]?.focus();
    } finally {
      setIsLoading(false);
    }
  };

  const shakeVariants: Variants = {
    shake: {
      x: [0, -10, 10, -10, 10, 0],
      transition: { duration: 0.4, ease: 'easeInOut' },
    },
    initial: { x: 0 },
  };

  return (
    <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-sm"
      >
        <div className="p-8 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100">
            <Lock className="h-8 w-8 text-indigo-600" />
          </div>
          <h2 className="mt-6 text-2xl font-bold text-slate-900">
            Verification Required
          </h2>
          <p className="mt-2 text-slate-600">
            Enter your admin PIN to access this page.
          </p>

          <motion.div
            variants={shakeVariants}
            animate={isShaking ? 'shake' : 'initial'}
            className="mt-8"
          >
            <div className="flex justify-center gap-3">
              {pin.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => {
                    inputRefs.current[index] = el;
                  }}
                  type="password"
                  inputMode="numeric"
                  value={digit}
                  onChange={(e) => handleChange(e, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  maxLength={1}
                  autoFocus={index === 0}
                  className="h-16 w-12 rounded-lg border-2 border-slate-300 bg-slate-50 text-center text-3xl font-bold text-slate-900 transition-colors duration-200 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300 [font-family:monospace] pt-2"
                />
              ))}
            </div>
            {error && (
              <p className="text-red-500 text-sm font-semibold mt-4">{error}</p>
            )}
          </motion.div>

          <button
            onClick={handleSubmit}
            disabled={isLoading || pin.join('').length < PIN_LENGTH}
            className="w-full mt-8 inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-5 h-12 text-md font-semibold text-white shadow-sm transition-all hover:bg-indigo-700 disabled:bg-slate-400 disabled:cursor-not-allowed disabled:shadow-none"
          >
            {isLoading ? 'Verifying...' : 'Verify Access'} <ArrowRight size={18} />
          </button>
        </div>
      </motion.div>
    </div>
  );
};

import React from 'react';

interface PickleMascotProps {
  className?: string;
  size?: number;
}

export const PickleMascot: React.FC<PickleMascotProps> = ({ className = '', size = 44 }) => {
  return (
    <svg
      width={size}
      height={size * 1.35}
      viewBox="0 0 100 135"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Pickle Body */}
      <defs>
        <linearGradient id="pickleGradient" x1="20" y1="10" x2="80" y2="125" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#84cc16" />
          <stop offset="40%" stopColor="#4d7c0f" />
          <stop offset="100%" stopColor="#365314" />
        </linearGradient>
        <radialGradient id="pickleHighlight" cx="35" cy="30" r="40" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#bef264" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#4d7c0f" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Main pickle shape */}
      <path
        d="M50 8
           C68 8 78 24 78 45
           C78 68 76 90 70 110
           C65 125 35 125 30 110
           C24 90 22 68 22 45
           C22 24 32 8 50 8 Z"
        fill="url(#pickleGradient)"
        stroke="#273e0e"
        strokeWidth="3.5"
      />

      {/* Surface 3D Highlight */}
      <path
        d="M50 12
           C64 12 72 26 72 45
           C72 65 70 85 65 105
           C61 116 39 116 35 105
           C30 85 28 65 28 45
           C28 26 36 12 50 12 Z"
        fill="url(#pickleHighlight)"
      />

      {/* Pickle Bumps / Texture Nubs */}
      <ellipse cx="32" cy="30" rx="3.5" ry="2.5" fill="#365314" opacity="0.6" />
      <ellipse cx="68" cy="36" rx="3" ry="2" fill="#365314" opacity="0.6" />
      <ellipse cx="28" cy="62" rx="3.5" ry="2.5" fill="#365314" opacity="0.6" />
      <ellipse cx="72" cy="72" rx="3.5" ry="2.5" fill="#365314" opacity="0.6" />
      <ellipse cx="34" cy="94" rx="3" ry="2" fill="#365314" opacity="0.6" />
      <ellipse cx="65" cy="98" rx="3" ry="2.5" fill="#365314" opacity="0.6" />

      {/* Friendly Big Cartoon Eyes */}
      {/* Left eye */}
      <ellipse cx="40" cy="42" rx="7" ry="9" fill="white" stroke="#1f2937" strokeWidth="2.5" />
      <circle cx="42" cy="42" r="4.5" fill="#15803d" />
      <circle cx="43.5" cy="40.5" r="2.5" fill="#0f172a" />
      <circle cx="41.5" cy="39" r="1.5" fill="white" />

      {/* Right eye */}
      <ellipse cx="60" cy="42" rx="7" ry="9" fill="white" stroke="#1f2937" strokeWidth="2.5" />
      <circle cx="58" cy="42" r="4.5" fill="#15803d" />
      <circle cx="56.5" cy="40.5" r="2.5" fill="#0f172a" />
      <circle cx="58.5" cy="39" r="1.5" fill="white" />

      {/* Rosy Cheeks */}
      <ellipse cx="32" cy="52" rx="4" ry="2.5" fill="#f87171" opacity="0.45" />
      <ellipse cx="68" cy="52" rx="4" ry="2.5" fill="#f87171" opacity="0.45" />

      {/* Cheerful Open Smile */}
      <path
        d="M40 52 Q50 66 60 52"
        fill="#991b1b"
        stroke="#1f2937"
        strokeWidth="2.5"
      />
      {/* Tongue */}
      <path
        d="M44 57 Q50 63 56 57 Q50 61 44 57 Z"
        fill="#f87171"
      />
      {/* White teeth */}
      <path
        d="M42 53 Q50 56 58 53"
        stroke="white"
        strokeWidth="2"
      />
    </svg>
  );
};

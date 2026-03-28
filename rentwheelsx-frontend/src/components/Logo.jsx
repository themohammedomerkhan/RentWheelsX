import React from 'react'

export default function Logo({ size = 'md', showText = true }) {
  const sizes = {
    sm: { icon: 'w-7 h-7', text: 'text-lg' },
    md: { icon: 'w-9 h-9', text: 'text-xl' },
    lg: { icon: 'w-12 h-12', text: 'text-3xl' },
  }
  const s = sizes[size] || sizes.md

  return (
    <div className="flex items-center gap-2">
      <div className={`${s.icon} rounded-xl bg-brand-navy flex items-center justify-center shadow-md`}>
        <svg viewBox="0 0 40 40" className="w-full h-full p-1.5" fill="none">
          <circle cx="20" cy="20" r="18" fill="#1a2b5f" />
          <text x="10" y="27" fontSize="20" fontWeight="bold" fill="white" fontFamily="Inter">R</text>
          <path d="M14 30 Q20 22 28 28" stroke="white" strokeWidth="2.5" strokeLinecap="round" fill="none" strokeDasharray="2 2" />
        </svg>
      </div>
      {showText && (
        <span className={`${s.text} font-extrabold tracking-tight`}>
          <span className="text-brand-navy">RentWheels</span>
          <span className="text-brand-orange">X</span>
        </span>
      )}
    </div>
  )
}
import React, { useState } from 'react';
import { MessageCircle } from 'lucide-react';

interface WhatsAppFloatingButtonProps {
  whatsappNumber?: string;
}

export const WhatsAppFloatingButton: React.FC<WhatsAppFloatingButtonProps> = ({
  whatsappNumber = '231770183894'
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const cleanNumber = (whatsappNumber || '231770183894').replace(/[^0-9]/g, '');
  const prefilledText = encodeURIComponent('Hello Tripple-T Health Center. I would like to make an inquiry.');
  const whatsappUrl = `https://wa.me/${cleanNumber}?text=${prefilledText}`;

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <aside
      aria-label="WhatsApp Support"
      className="fixed bottom-6 right-6 z-40 flex items-center gap-2 pointer-events-auto"
    >
      {/* Desktop hover label — strictly shows "Chat with Us" with NO visible telephone number */}
      <span
        id="whatsapp-label"
        role="tooltip"
        className={`hidden sm:inline-block px-3 py-1.5 rounded-full text-xs font-semibold text-white bg-[#073B5C] shadow-md border border-teal-500/30 transition-all duration-200 pointer-events-none select-none ${
          isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-2'
        }`}
      >
        Chat with Us
      </span>

      {/* Floating Action Button */}
      <a
        href={whatsappUrl}
        onClick={handleClick}
        target="_blank"
        rel="noopener noreferrer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onFocus={() => setIsHovered(true)}
        onBlur={() => setIsHovered(false)}
        className="w-14 h-14 rounded-full bg-[#25D366] hover:bg-[#20ba59] active:scale-95 text-white flex items-center justify-center shadow-lg hover:shadow-emerald-600/40 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-emerald-400/50 cursor-pointer group"
        aria-label="Chat with Tripple-T Health Center on WhatsApp"
        aria-describedby="whatsapp-label"
      >
        {/* SVG WhatsApp Official Glyph */}
        <svg
          className="w-7 h-7 fill-current transition-transform duration-200 group-hover:scale-110"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path d="M12.031 2c-5.516 0-9.999 4.48-10 9.995 0 1.763.459 3.486 1.332 5.004L2 22l5.141-1.349a9.97 9.97 0 004.885 1.265h.005c5.515 0 10-4.48 10-9.996 0-2.671-1.04-5.182-2.929-7.071A9.927 9.927 0 0012.031 2zm0 18.324h-.004a8.31 8.31 0 01-4.238-1.156l-.304-.18-3.146.825.84-3.067-.198-.315a8.293 8.293 0 01-1.275-4.436c.003-4.582 3.731-8.311 8.316-8.311 2.22 0 4.308.865 5.877 2.436a8.267 8.267 0 012.432 5.882c-.004 4.584-3.732 8.322-8.308 8.322zm4.556-6.223c-.25-.125-1.479-.73-1.708-.813-.23-.083-.397-.125-.564.125-.167.25-.646.813-.792.98-.146.167-.292.188-.542.063-.25-.125-1.055-.389-2.01-1.24a7.487 7.487 0 01-1.391-1.728c-.146-.25-.016-.385.109-.51.113-.112.25-.292.375-.438.125-.146.167-.25.25-.417.083-.167.042-.313-.021-.438-.063-.125-.563-1.355-.771-1.855-.204-.488-.411-.422-.564-.43-.146-.008-.313-.01-.479-.01-.167 0-.438.063-.667.313-.23.25-.875.855-.875 2.085s.896 2.418 1.021 2.585c.125.167 1.763 2.693 4.271 3.777.597.258 1.063.412 1.427.528.6.19 1.146.163 1.577.099.48-.072 1.479-.605 1.688-1.189.208-.584.208-1.084.146-1.189-.063-.105-.23-.167-.479-.292z" />
        </svg>
      </a>
    </aside>
  );
};

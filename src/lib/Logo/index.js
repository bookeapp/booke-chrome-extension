import React from "react";

const Logo = () => {
  return (
    <svg viewBox="0 0 18 25" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path fillRule="evenodd" clipRule="evenodd" d="M3.48 6.614v11.984L0 22.078V.675h2.46l3.479 3.48 5.995 5.988-2.466 2.467L3.48 6.614Zm8.454 8.455 2.46-2.46 1.53 1.532c1.772 1.771 2.282 4.323 1.319 6.64-.957 2.325-3.119 3.763-5.627 3.763h-9.15l3.48-3.48h5.67c1.09 0 1.998-.602 2.416-1.615.418-1.007.206-2.077-.567-2.85l-1.53-1.53Z" fill="url(#a)" />
      <path d="m10.68 16.316 1.255-1.254 2.459-2.46 1.53-1.53c1.78-1.779 2.282-4.323 1.319-6.64-.964-2.318-3.119-3.757-5.634-3.757H2.459l3.48 3.48h5.67c1.09 0 1.998.602 2.416 1.616.418 1.013.206 2.076-.567 2.849l-1.53 1.53-2.46 2.46-1.247 1.247-4.741 4.741L0 22.078v2.46h2.459l3.48-3.48 4.741-4.742Z" fill="url(#b)" />
      <defs>
          <linearGradient id="a" x1="3.26" y1="5.565" x2="10.563" y2="22.744" gradientUnits="userSpaceOnUse">
              <stop stopColor="#31D892" />
              <stop offset="1" stopColor="#50EAA9" />
          </linearGradient>
          <linearGradient id="b" x1="4.394" y1="19.881" x2="14.878" y2="4.995" gradientUnits="userSpaceOnUse">
              <stop stopColor="#0267D4" />
              <stop offset="1" stopColor="#3980FF" />
          </linearGradient>
      </defs>
    </svg>
  );
};

export default Logo;

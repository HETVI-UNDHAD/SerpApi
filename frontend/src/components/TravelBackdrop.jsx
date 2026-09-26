import React, { useEffect, useState } from 'react';

const TRAVEL_IMAGES = [
  'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1920&auto=format&fit=crop&q=85',
  'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=1920&auto=format&fit=crop&q=85',
  'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=1920&auto=format&fit=crop&q=85',
  'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=1920&auto=format&fit=crop&q=85'
];

export default function TravelBackdrop({ isDark }) {
  const [imageIndex, setImageIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setImageIndex(index => (index + 1) % TRAVEL_IMAGES.length);
    }, 6500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none" aria-hidden="true">
      {TRAVEL_IMAGES.map((image, index) => (
        <img
          key={image}
          src={image}
          alt=""
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-[1800ms]"
          style={{ opacity: index === imageIndex ? 1 : 0 }}
        />
      ))}
      <div className={`absolute inset-0 transition-colors duration-700 ${
        isDark ? 'bg-[#06111d]/58' : 'bg-[#dff5f2]/22'
      }`} />
      <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/25" />
    </div>
  );
}

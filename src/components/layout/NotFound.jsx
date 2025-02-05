import React, { useEffect, useState } from 'react';
import image from '../../images/notFound.png';
import MetaData from './MetaData';

const NotFound = () => {
  const [dimensions, setDimensions] = useState({ width: 360, height: 277 });

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    const updateDimensions = () => {
      if (window.innerWidth < 600) {
        setDimensions({ width: 180, height: 138.5 });
      } else {
        setDimensions({ width: 360, height: 277 });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-800 px-4">
      <MetaData title="Not Found" />
      <h1 className="text-4xl font-bold mb-4">Oops!</h1>
      <img src={image} alt="Not Found" className="w-auto" style={{ width: dimensions.width, height: dimensions.height }} />
      <p className="mt-4 text-lg text-center">The resource you requested was not found.</p>
    </div>
  );
};

export default NotFound;

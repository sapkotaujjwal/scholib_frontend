// import React, { useState, useEffect } from 'react';
// import {Blurhash} from 'react-blurhash';
// import './blurhash.scss'

// function AnimatedBlurhashImage({ imageUrl, blurhash, width , height }) {
//   const [imageLoaded, setImageLoaded] = useState(false);

//   useEffect(() => {
//     const image = new Image();
//     image.src = imageUrl;

//     image.onload = () => {
//       setImageLoaded(true);
//     };
//   }, [imageUrl]);

//   return (
//     <div className="image-containerx6">
//       <div className={`blurhash-placeholder ${imageLoaded ? 'hidden' : ''}`}>
//         <Blurhash hash={blurhash} width={width} height={height} />
//       </div>
//       <img
//         src={imageUrl}
//         alt="not Loaded"
//         className={`actual-image ${imageLoaded ? 'visible' : 'hidden'}`}
//       />
//     </div>
//   );
// }

// export default AnimatedBlurhashImage;







import React, { useState, useEffect } from "react";
import { Blurhash } from "react-blurhash";

function AnimatedBlurhashImage({ imageUrl, blurhash }) {
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.src = imageUrl;
    img.onload = () => setImageLoaded(true);
  }, [imageUrl]);

  return (
    <div className="relative w-full h-full">
      {/* Blurhash Placeholder */}
      {!imageLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
          <Blurhash hash={blurhash} width="100%" height="100%" />
        </div>
      )}

      {/* Actual Image */}
      <img
        src={imageUrl}
        alt="Loaded content"
        className={`absolute inset-0 w-full h-full object-contain transition-opacity duration-500 ${
          imageLoaded ? "opacity-100" : "opacity-0"
        }`}
      />
    </div>
  );
}

export default AnimatedBlurhashImage;









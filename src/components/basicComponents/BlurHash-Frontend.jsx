import React, { useState, useEffect, useRef } from 'react';
import { Blurhash } from 'react-blurhash';

const BlurhashImage = ({ imageUrl, blurhash, width, height }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [pWidth, setPwidth] = useState(0);
  const [pHeight, setPheight] = useState(0);

  const parentRef = useRef(null);

  useEffect(() => {
    if (parentRef.current) {
      const rect = parentRef.current.getBoundingClientRect();
      setPwidth(rect.width);
      setPheight(rect.height);
    }
  }, []);

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  return (
    <div ref={parentRef} style={{ position: 'relative', width: '100%', paddingTop: `${(height / width) * 100}%`  }}>


      <div className="blsydb" style={{ position: 'absolute', top: '0px', left: '0px', zIndex: 2}} >
      <Blurhash hash={blurhash} width={`${pWidth}px`} height={`${pHeight}px`} style={{ position: 'absolute', top: '0px', left: '0px', zIndex: 999999, transition: 'opacity 0.5s', opacity: imageLoaded ? 0 : 1 }} />
      </div>

      <img
        src={imageUrl}
        alt="Loaded Image"
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: imageLoaded ? 1 : 0, transition: 'opacity 0.5s' }}
        onLoad={handleImageLoad}
      />
    </div>
  );
};

export default BlurhashImage;


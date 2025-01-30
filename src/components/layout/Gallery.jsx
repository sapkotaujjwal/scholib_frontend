import React from 'react';
import './gallery.scss';

const Gallery = () => {
  const imageUrls = [
    'https://source.unsplash.com/collection/190727/800x600',
    'https://source.unsplash.com/collection/190727/600x800',
    'https://source.unsplash.com/collection/190727/1200x750',
    'https://source.unsplash.com/collection/190727/750x1200',
    'https://source.unsplash.com/collection/190727/900x1200',

    'https://source.unsplash.com/collection/190727/800x600',
    'https://source.unsplash.com/collection/190727/600x800',
    'https://source.unsplash.com/collection/190727/1200x750',
    'https://source.unsplash.com/collection/190727/750x1200',
    'https://source.unsplash.com/collection/190727/900x1200',
  ];

  return (
    <section className="gallery">
      <ul className="images">
        {imageUrls.map((url, index) => (
          <img key={index} src={url} alt={`Image ${index + 1}`} />
        ))}
      </ul>
    </section>
  );
};

export default Gallery;

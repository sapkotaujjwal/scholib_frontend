import React, { useState } from 'react';
import './bigImage.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretLeft, faXmark } from '@fortawesome/free-solid-svg-icons';
import { useSelector } from 'react-redux';

const BigImage = ({closeFunction}) => {

  const array = useSelector((state) => state.BigImage.data); 
  const index = useSelector((state) => state.BigImage.index); 

  const handleClose = () => {
    closeFunction();
  };
  

  const [image, setImage] = useState(index);

  function nextImage() {
    setImage((prevImage) => (prevImage + 1) % array.length);
  }

  function previousImage() {
    setImage((prevImage) => (prevImage - 1 + array.length) % array.length);
  }

  //for slide feature


  let startX;
  let deltaX;

  function handleTouchStart(event) {
    startX = event.touches[0].clientX; // Store starting X position
  }
  
  function handleTouchMove(event) {
    const touch = event.touches[0];
    deltaX = touch.clientX - startX; // Calculate X movement
  }
  
  function handleTouchEnd() {
    if (Math.abs(deltaX) > 100) { // Adjust threshold based on needs
      if (deltaX > 0) {
        previousImage(); // Slide right
      } else {
        nextImage(); // Slide left
      }
    }
    startX = null; // Reset starting position
  }


  

  return (
    <div className="pcontainer">
    <div className='bigImage028387 flex1'>
      <div className="maincsf flex1">
        <div className="close flex1" onClick={handleClose} style={{cursor: 'pointer'}}>
          <FontAwesomeIcon icon={faXmark} />
        </div>

        <div className="container">

          <div className="image" onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd}>

            <img src={array[image]} alt="" />

          </div>

          <div className="each left" onClick={previousImage}>
              <FontAwesomeIcon icon={faCaretLeft} />
            </div>

          <div className="each right" onClick={nextImage}>
              <FontAwesomeIcon icon={faCaretLeft} style={{ transform: 'rotate(180deg)' }} />
            </div>

        </div>

      </div>
      </div>
      </div>
  );
}

export default BigImage;

import React, { useState } from 'react'


import './himage.scss'
import { useSelector } from 'react-redux';

const Himage = () => {

  const school = useSelector((state) => state.Home.school.payload);

  let images;

  images = school.images.map((img)=>{
    return img.secure_url;
  });
  
 if(images.length < 1 )
  images = ['https://cdn.pixabay.com/photo/2018/05/12/06/25/harvard-3392567_960_720.jpg','https://images.pexels.com/photos/2565221/pexels-photo-2565221.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1','https://images.pexels.com/photos/887584/pexels-photo-887584.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1','https://cdn.pixabay.com/photo/2017/07/25/01/22/cat-2536662_640.jpg'];

  const [currentImage, setCurrentImage] = useState(images);

  function Handleclicked(number){
    const newArray = [...currentImage];
    [newArray[0], newArray[number]] = [newArray[number], newArray[0]];

    setCurrentImage(newArray);
  }

  return (
    <div className='gdsh78'>

    <div className="imageComp">
      <div className="left flex1">
        <img
          src={currentImage[0]}
          alt="Image"
        />
      </div>
      <div className="right flex1">
        <div className="simage flex1" onClick={()=> Handleclicked(1) }>
          <img
            src={currentImage[1]}
            alt="Image"
          />
        </div>
        <div className="simage flex1" onClick={()=> Handleclicked(2) }>
          <img
            src={currentImage[2]}
            alt="Image"
          />
        </div>
        <div className="simage flex1" onClick={()=> Handleclicked(3) }>
          <img
            src={currentImage[3]}
            alt="Image"
          />
        </div>
      </div>
    </div>


    </div>
  )
}

export default Himage;

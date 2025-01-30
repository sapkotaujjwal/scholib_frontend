import React, { useEffect, useState } from 'react'
import './blurHash.scss'
import BigImage from './BigImage';

const BlurHash = ({images}) => {

    
    // let array = [
    //     "https://cdn.pixabay.com/photo/2018/05/02/09/29/auto-3368094_640.jpg",
    //     "https://cdn.pixabay.com/photo/2015/08/13/17/30/womans-legs-887286_640.jpg",
    //     "https://cdn.pixabay.com/photo/2016/09/11/10/02/renault-juvaquatre-1661009_640.jpg",
    //     "https://cdn.pixabay.com/photo/2014/10/22/17/22/car-498244_640.jpg",
    //     "https://cdn.pixabay.com/photo/2018/05/02/09/29/auto-3368094_640.jpg",
    //     "https://cdn.pixabay.com/photo/2018/05/03/08/52/car-3370706_640.jpg"
    //   ];

    const [array, setArray] = useState([]);

    useEffect(()=>{
        
        if (images && images.length > 0){
            setArray(images.map(obj => obj.secure_url));
        }
        return;

    }, [images]);

      const [bigImage, setBigImage] = useState(false);
      const [imgIndex, setImgIndex] = useState(0);

      function showBigImage (index){
        setBigImage(!bigImage);
        setImgIndex(index);
      }

  return (
    <>

     <div className='blurHashComponent2738'>

     {!bigImage && <div className="main2">
            <div className="container flex4">

                {array.map((image, index)=>{

                    return(
                        <div className="each" onClick={() => showBigImage(index)} key={index}>

                        <img src={image} alt="" />
                        <div className="shadow"></div>
                        </div>
                    )

                })}

            </div>
        </div>}
      
    </div>

    {bigImage && 
    <BigImage array={array} closeFunction={showBigImage} index={imgIndex} />
    }
    </>
  )
}

export default BlurHash;

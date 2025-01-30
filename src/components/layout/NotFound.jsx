import React from 'react'
import './notFound.scss'
import image from '../../images/notFound.png'
import AnimatedBlurhashImage from './blurHash'
import MetaData from './MetaData'
import { useEffect } from 'react'



const NotFound = () => {

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, []);

  let width ;
  let height ;

  if (window.innerWidth < 600){
    width = 180;
    height = 138.5;
  }
  else{
    width = 360;
    height = 277;
  }

  return (
    <div className='notFound'>
      < MetaData title='Not Found' />
      <h1>OOps</h1>
      <div className='blurhashImg'>
      <AnimatedBlurhashImage
        imageUrl={image}
        blurhash='L9IY^S#53SmPHX_Nt:4mCfA0UctQ'
        width={width}
        height={height}
      />
    </div>
      <p> The resource you requested was not found </p>
    </div>
  )
}

export default NotFound;

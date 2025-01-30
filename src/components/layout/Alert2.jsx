import React from 'react';
import './alert2.scss';
import img1 from '../../images/sure svg.svg'
import AnimatedBlurhashImage from './blurHash';

const Alert2 = ({ alert2False, alert2True, text1, text2 }) => {
    function handleClose (){
        alert2True();
    }

    function handleCancelClick(){
        alert2False();
    }

  return (
        <div className='oopete5 flex1'>
          <div className="main">
            <p className="h4 text-center w600">{text1}</p>
            <p className="h6 text-secondary text-secondary haudu text-center my-4"> {text2}  </p>

            <div className="img">

            <AnimatedBlurhashImage imageUrl={img1} blurhash={'LCH,-h=y029t49E1{KofF|JTxCR5'} width ={300} height={300} />

            {/* <img src={img1} alt="" /> */}
            </div>

            <div className="buttons flex2">
          <button className="btn btn-secondary mx-1" onClick={handleCancelClick}> Cancel </button>
          <button className="btn btn-danger mx-1" onClick={handleClose}>
            Confirm
          </button>
        </div>

          </div>
        </div>
  );
};

export default Alert2;

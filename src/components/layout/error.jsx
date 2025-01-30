import React from 'react'
import logo from '../../images/logo.png'
import './error.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTriangleExclamation, faXmark } from '@fortawesome/free-solid-svg-icons';

const Error = ({status,message,errorRemove}) => {

  console.log(errorRemove)

    const handleDismissClick = () => {
      errorRemove();
      };


  return (
    <div className='yddrtd2 flex1'>
        <div className="main flex1">
            <img src={logo} alt="scholib" />
            <p className="h5 w500 text-center" style={{margin: '40px'}}> {status || 'Something Went Wrong'} </p>
            <FontAwesomeIcon icon={faTriangleExclamation} style={{height: '70px', marginBottom: '20px', color: 'red'}} />
            <p className="h6 w400 text-center px-4" style={{marginBottom: '30px', lineHeight: '25px'}}> {message || 'Server failed to respond.. Maybe Network error !!'} </p>
            <p className="h6 w500 text-center" style={{marginBottom: '30px'}}> An Error Occured ! </p>
            <button onClick={handleDismissClick} disabled={errorRemove ? false : true} >
            {errorRemove ? 'Dismiss' : 'Cannot be Dismissed'}  &nbsp;&nbsp;&nbsp;<FontAwesomeIcon icon={faXmark} className={errorRemove ? '' : 'd-none'} />
            </button>

        </div>
    </div>
  )
}

export default Error;







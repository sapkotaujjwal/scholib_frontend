import React, { useEffect } from 'react'
import './library.scss'
import { useSelector } from 'react-redux';
import MetaData from '../layout/MetaData';


const Library = () => {

    const user = useSelector((state) => state.User.user.payload);
    const school = useSelector((state)=> state.Home.school.payload);

    useEffect(() => {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      }, []);


  return (
    <div className='libraryAdmin2838'>
              <MetaData title={`${user && user.role ? "Staff" : "Student"} || Library`} />
        <div className="inside-content">

        <div className="veryTop">
          <p className="h4 text-center" style={{ color: "#133189" }}>
            Library
          </p>
          <p className="h6 text-center"> {school.name} </p>
        </div>


        </div>
      
    </div>
  )
}

export default Library;

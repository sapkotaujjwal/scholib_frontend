import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import './staffPage.scss'
import Dashboard from './Dashboard'
import MiniNav from './MiniNav'
import Header from './Header2'
import SecurityComponent from '../basicComponents/SecurityComponent'
import { Route, Switch } from "react-router-dom";
import NotFound from '../layout/NotFound'
import Staffs from './Staffs'
import Profile from './Profile'
import Tools from './admin/Tools'
import Admission from './Admission'
import Exams from './Exams'
import Students from './Students'
import Account from './Account'
import Attendance from './Attendance'
import Library from './Library'
import SiteTools from './admin/SiteTools'
import { GET_STUDENTS, GET_STUDENTS_FAIL, GET_STUDENTS_SUCCESS } from '../../redux/StudentsSlice'
import { SET_ALERT_GLOBAL } from '../../redux/AlertGlobalSlice'
import axios from 'axios'


const StaffPage = () => {

  // const user = useSelector((state) => state.User.user.payload);
  const school = useSelector((state) => state.Home.school.payload);
  const schoolCode = school.schoolCode;
  const students = useSelector((state) => state.Students.students.payload);

   //for Navbar

  const [showMiniNav, setShowMiniNav] = useState(false);
  function toggleMiniNav (){
    setShowMiniNav(!showMiniNav);
  }

  const dispatch = useDispatch()


  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

    dispatch(GET_STUDENTS());
    axios
      .get(`${process.env.REACT_APP_API_URL}/staff/${schoolCode}/students`, {
        withCredentials: true,
      })
      .then((response) => {
        if (response.data.success) {
          dispatch(GET_STUDENTS_SUCCESS(response.data.data));
        } else {
          dispatch(GET_STUDENTS_FAIL(response.data.data));
          dispatch(SET_ALERT_GLOBAL(response.data.data));
        }
      })
      .catch((error) => {
        const data = {
          message: error.message,
          status: "Cannot communicate with the server",
        };

        if (error.response) {
          dispatch(SET_ALERT_GLOBAL(error.response.data));
          return;
        }
        dispatch(SET_ALERT_GLOBAL(data));
      });
  }, []);

    return (
        <div className='staffPage23728'>
          <Header function={toggleMiniNav} />

          <div className="hawashdusdbsds" style={{position:'fixed',top:'62px', left:'0px', zIndex:'99999999', backgroundColor:"#fff"}}>
            { showMiniNav && <div className="miniNav2"> <MiniNav function24={toggleMiniNav} />
             </div>}
          </div>
    
            <div className="main24537">  
    
             <div className="miniNav"> <MiniNav />
             </div>

            {students && <div className="others">

            <Switch>

            <Route exact path={`/school/${schoolCode}/staff/`} component={Dashboard} />
            <Route exact path={`/school/${schoolCode}/staff/staffs`} component={Staffs} />
            <Route exact path={`/school/${schoolCode}/staff/profile`} component={Profile} />
            <Route exact path={`/school/${schoolCode}/staff/security`} component={SecurityComponent} />
            <Route exact path={`/school/${schoolCode}/staff/admissions`} component={Admission} />
            <Route exact path={`/school/${schoolCode}/staff/exams`} component={Exams} />
            <Route exact path={`/school/${schoolCode}/staff/students`} component={Students} />
            <Route exact path={`/school/${schoolCode}/staff/account`} component={Account} />
            <Route exact path={`/school/${schoolCode}/staff/attendance`} component={Attendance} />
            <Route exact path={`/school/${schoolCode}/staff/library`} component={Library} />

            <Route exact path={`/school/${schoolCode}/staff/tools`} component={Tools} />
            <Route exact path={`/school/${schoolCode}/staff/site`} component={SiteTools} />


            <Route path="" component={NotFound} />
            </Switch>

            </div> } 
    
            </div>
    
        </div>
      )
}

export default StaffPage;



import { Route, Switch } from "react-router-dom";
import Header from "./layout/Header";
import Footer from "./layout/Footer";
import React, { useEffect } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import {
  GET_SCHOOL,
  GET_SCHOOL_SUCCESS,
  GET_SCHOOL_FAIL,
  ERROR_REMOVE,
} from "../redux/HomeSlice";
import { useParams } from "react-router-dom";
import Error from "./layout/error";
import Loading from "./layout/loading";
import Updates from "./updates/Updates";
import Gallery from "./gallery/Gallery";
import Admission from "./admission/Admission";
import NotFound from "./layout/NotFound";

import { ANOTHER_SCHOOL_OPEN, SAME_SCHOOL_OPEN } from "../redux/UserSlice";
import {
  GET_ALL_COURSES_SUCCESS,
  GET_COURSE,
  GET_COURSE_FAIL,
  GET_COURSE_SUCCESS,
} from "../redux/CourseSlice";

//students
import { useRouteMatch } from "react-router-dom/cjs/react-router-dom.min";
import StudentPage from "./students/StudentPage";
import StaffPage from "./staffs/StaffPage";
import AlertAdv from "./test/AlertAdv";
import ConfirmAdv from "./test/ConfirmAdv";
import UpdateSchool from "./registerSchool/UpdateSchool";
import getClassesChain from "../tools/getClassesChain";

function School() {
  const history = useHistory();
  let { schoolCode } = useParams();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.User.user.payload);
  const user0 = useSelector((state) => state.User.user0.payload);
  const alertGlobal = useSelector((state) => state.AlertGlobal.alerts);
  const confirmGlobal = useSelector(
    (state) => state.ConfirmGlobal.confirmGlobal
  );

  const school = useSelector((state) => state.Home.school.payload);

  useEffect(() => {
    dispatch(GET_SCHOOL());
    axios
      .get(`${process.env.REACT_APP_API_URL}/basic/${schoolCode}`, {
        withCredentials: true,
      })
      .then((response) => {
        if (response.data.success) {
          let courseInfo = response.data.data.course;
          let courseIds = getClassesChain(response.data.data.course).flat();
          response.data.data.course = courseIds.map((crc) =>
            courseInfo.find((cbc) => cbc._id.toString() === crc)
          );
          dispatch(GET_SCHOOL_SUCCESS(response.data.data));
        } else {
          dispatch(GET_SCHOOL_FAIL(response.data.data));
        }
      })
      .catch((error) => {
        const data = {
          message: error.message,
          status: "Cannot communicate with the server",
        };

        if (error.response) {
          dispatch(GET_SCHOOL_FAIL(error.response.data));
          return;
        }
        dispatch(GET_SCHOOL_FAIL(data));
      });
  }, [dispatch, schoolCode]);

  useEffect(() => {
    if (!school) return;

    dispatch(GET_COURSE());

    axios
      .get(`${process.env.REACT_APP_API_URL}/basic/${schoolCode}/courses`, {
        withCredentials: true,
      })
      .then((response) => {
        if (response.data.success) {
          let courseData = response.data.data.course.map((crc) => ({
            ...crc,
            groups: crc.groups.map((grp) => ({
              ...grp,
              sections: grp.sections.map((sec) => ({
                ...sec,
                subjects: sec.subjects.map((sub) => {
                  // Find the teacher from the staff list
                  const teacher = school.staffs.find(
                    (sta) => sta._id === sub.teacher
                  );
                  // Return the updated subject with the teacher assigned
                  return {
                    ...sub,
                    teacher: teacher || null, // Ensure there's a fallback if no teacher is found
                  };
                }),
              })),
            })),
          }));

          dispatch(GET_ALL_COURSES_SUCCESS({ course: courseData }));

          let courseDataNew = school.course2.map((item321) => {
            return courseData.find((crc2) => crc2._id.toString() === item321);
          });

          courseData = school.course
            .map((crc) =>
              courseDataNew.find((crc2) => crc2.courseId === crc._id)
            )
            .filter(Boolean);

          dispatch(GET_COURSE_SUCCESS({ course: courseData }));
        } else {
          dispatch(GET_COURSE_FAIL(response.data.data));
        }
      })
      .catch((error) => {
        const data = {
          message: error.message,
          status: "Cannot communicate with the server",
        };

        if (error.response) {
          dispatch(GET_COURSE_FAIL(error.response.data));
          return;
        }
        dispatch(GET_COURSE_FAIL(data));
      });
  }, [dispatch, schoolCode, school]);

  useEffect(() => {
    if (user0) {
      if (user0.schoolCode == schoolCode) {
        dispatch(SAME_SCHOOL_OPEN());
      }
      if (user0.schoolCode != schoolCode) {
        dispatch(ANOTHER_SCHOOL_OPEN());
      }
    }
  }, [schoolCode, dispatch, user0]);

  const loading = useSelector((state) => state.Home.loading);
  const error = useSelector((state) => state.Home.error.payload);

  const course = useSelector((state) => state.Course.course.payload);

  function removeError() {
    dispatch(ERROR_REMOVE());
    history.goBack();
  }

  // to conditionally render footer
  const studentRouteMatch = useRouteMatch(
    `/school/${schoolCode}/student/:path*`
  );

  const staffRouteMatch = useRouteMatch(`/school/${schoolCode}/staff/:path*`);
  const websiteRouteMatch = useRouteMatch(
    `/school/${schoolCode}/website/:path*`
  );

  if (confirmGlobal) {
    document.body.classList.add("dshauda-hidden32");
  } else {
    document.body.classList.remove("dshauda-hidden32");
  }

  return (
    <div className="vsgs672t2772">
      {loading && (
        <div className="fashw">
          <Loading />
        </div>
      )}
      {error && (
        <Error
          status={error.status}
          message={error.message}
          errorRemove={removeError}
        />
      )}

      {school &&
        !staffRouteMatch &&
        !studentRouteMatch &&
        !websiteRouteMatch && <Header />}

      {alertGlobal && <AlertAdv />}

      {confirmGlobal && <ConfirmAdv />}

      {school && !loading && course && !error && (
        <Switch>
          {/* school's basic routes */}

          <Route
            exact
            path={`/school/${schoolCode}/updates`}
            component={Updates}
          />
          <Route
            exact
            path={`/school/${schoolCode}/gallery`}
            component={Gallery}
          />

          <Route
            exact
            path={`/school/${schoolCode}/admission`}
            component={Admission}
          />

          <Route
            path={`/school/${schoolCode}/website/update/`}
            render={(props) => <UpdateSchool {...props} data={school} />}
          />

          {/* routes for students */}

          {user && !user.title && (
            <Route
              path={`/school/${schoolCode}/student/`}
              component={StudentPage}
            />
          )}
          {user && user.title && (
            <Route
              path={`/school/${schoolCode}/staff/`}
              component={StaffPage}
            />
          )}

          <Route path="" component={NotFound} />
        </Switch>
      )}

      {school &&
        !staffRouteMatch &&
        !studentRouteMatch &&
        !websiteRouteMatch && <Footer />}
    </div>
  );
}

export default School;

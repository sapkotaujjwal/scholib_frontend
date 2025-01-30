import { configureStore } from "@reduxjs/toolkit";
import homeSlice from "./redux/HomeSlice";
import userSlice from "./redux/UserSlice";
import updateSlice from "./redux/UpdateSlice";
import scholibSlice from "./redux/scholibSlice";
import gallerySlice from "./redux/GallerySlice";
import bigImageSlice from "./redux/BigImageSlice";
import updateSchoolSlice from "./redux/UpdateSchoolSlice";
import studentAdmissionSlice from "./redux/StudentAdmissionSlice";
import createCourseSlice from "./redux/CreateCourse";
import alertGlobalSlice from "./redux/AlertGlobalSlice";
import confirmGlobalSlice from "./redux/ConfirmGlobalSlice";
import courseSlice from "./redux/CourseSlice";
import studentsSlice from "./redux/StudentsSlice";
import otherInfoSlice from "./redux/OtherInfoSlice";
import studentDataSlice from "./redux/StudentDataSlice";

export const store = configureStore({
  reducer: {
    Home: homeSlice,
    User: userSlice,
    StudentData: studentDataSlice,
    Update: updateSlice,
    Gallery: gallerySlice,
    Scholib: scholibSlice,
    BigImage: bigImageSlice,
    UpdateSchool: updateSchoolSlice,
    StudentAdmission: studentAdmissionSlice,
    CreateCourse: createCourseSlice,
    AlertGlobal: alertGlobalSlice,
    ConfirmGlobal: confirmGlobalSlice,
    Course: courseSlice,
    Students: studentsSlice,
    Other: otherInfoSlice,
  },
});

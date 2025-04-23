import React from "react";
import Home from "../pages/student/Home";
import CoursesList from "../pages/student/CoursesList";
import CourseDetails from "../pages/student/CourseDetails";
import MyEnrollments from "../pages/student/MyEnrollments";
import Player from "../pages/student/Player";
import Loading from "../components/student/Loading";

import Dashboard from "../pages/educator/Dashboard";
import AddCourse from "../pages/educator/AddCourse";
import MyCourses from "../pages/educator/MyCourses";
import StudentsEnrolled from "../pages/educator/StudentsEnrolled";

import About from "../pages/client/About";
import Blog from "../pages/client/Blog";
import Contact from "../pages/client/Contact";

import Error404 from "../pages/Error404";
import LayoutDefault from "../layouts/LayoutDefault";
import UpdateCourse from "../pages/educator/UpdateCourse";

const routes = [
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/course-list/:input",
    element: <CoursesList />,
  },
  {
    path: "/course-list",
    element: <CoursesList />,
  },
  {
    path: "/course/:id",
    element: <CourseDetails />,
  },
  {
    path: "/my-enrollments",
    element: <MyEnrollments />,
  },
  {
    path: "/player/:courseId",
    element: <Player />,
  },
  {
    path: "/loading/:path",
    element: <Loading />,
  },
  {
    path: "/about",
    element: <About />,
  },
  {
    path: "/blog",
    element: <Blog />,
  },
  {
    path: "/contact",
    element: <Contact />,
  },
  {
    path: "/educator",
    element: <LayoutDefault />,
    children: [
      {
        path: "dashboard",
        element: <Dashboard />,
      },
      {
        path: "add-course",
        element: <AddCourse />,
      },
      {
        path: "update-course/:courseId",
        element: <UpdateCourse />,
      },
      {
        path: "my-course",
        element: <MyCourses />,
      },
      {
        path: "student-enrolled",
        element: <StudentsEnrolled />,
      },
    ],
  },
  {
    path: "*",
    element: <Error404 />,
  },
];

export default routes;

import React from "react";
import Navbar from "../../../components/student/Navbar";
import { Helmet } from "react-helmet";

const Blog = () => {
  return (
    <>
      <Helmet>
        <title>Blog</title>
      </Helmet>
      <Navbar />
      <h1>Blog</h1>
    </>
  );
};

export default Blog;

import React from "react";
import Navbar from "../../../components/student/Navbar";
import { Helmet } from "react-helmet";

const Contact = () => {
  return (
    <>
      <Helmet>
        <title>Liên hệ</title>
      </Helmet>
      <Navbar />
      <h1>Contact</h1>
    </>
  );
};

export default Contact;

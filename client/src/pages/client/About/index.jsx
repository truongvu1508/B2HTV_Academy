import React from "react";
import Navbar from "../../../components/student/Navbar";
import Footer from "../../../components/student/Footer";
import BackToTop from "../../../components/client/BackToTop";
import AboutHead from "../../../components/client/AboutHead";
import { Helmet } from "react-helmet";

const About = () => {
  return (
    <>
      <Helmet>
        <title>Về chúng tôi</title>
      </Helmet>
      <Navbar />
      <AboutHead />
      <Footer />
      <BackToTop />
    </>
  );
};

export default About;

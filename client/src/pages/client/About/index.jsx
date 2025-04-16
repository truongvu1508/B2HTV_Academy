import React from "react";
import Navbar from "../../../components/student/Navbar";
import Footer from "../../../components/student/Footer";
import BackToTop from "../../../components/client/BackToTop";
import AboutHead from "../../../components/client/AboutHead";
import { Helmet } from "react-helmet";
import MastFeedback from "../../../components/client/MastFeedback";
import MastCountUp from "../../../components/client/MastCountUp";
import AboutTarget from "../../../components/client/AboutTarget";

const About = () => {
  return (
    <>
      <Helmet>
        <title>Về chúng tôi</title>
      </Helmet>
      <Navbar />
      <AboutHead />
      <AboutTarget />
      <MastFeedback />
      <MastCountUp />
      <Footer />
      <BackToTop />
    </>
  );
};

export default About;

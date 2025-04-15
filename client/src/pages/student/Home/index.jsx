import React from "react";
import Navbar from "../../../components/student/Navbar";
import MastHead from "../../../components/client/MastHead";
import Footer from "../../../components/student/Footer";
import MastMiddle from "../../../components/client/MastMiddle";
import MastContent from "../../../components/client/MastContent";
import MastSteps from "../../../components/client/MastSteps";
import MastFeedback from "../../../components/client/MastFeedback";
import MastCountUp from "../../../components/client/MastCountUp";
import BackToTop from "../../../components/client/BackToTop";

const Home = () => {
  return (
    <>
      <Navbar />
      <MastHead />
      <MastMiddle />
      <MastContent />
      <MastSteps />
      <MastFeedback />
      <MastCountUp />
      <Footer />
      <BackToTop />
    </>
  );
};

export default Home;

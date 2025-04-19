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
import { Helmet } from "react-helmet";
import CoursesSection from "../../../components/student/CoursesSection";

const Home = () => {
  return (
    <>
      <Helmet>
        <title>Trang chủ</title>
      </Helmet>
      <Navbar />
      <MastHead />
      <MastMiddle />
      <MastContent />
      <CoursesSection />
      <MastSteps />
      <MastFeedback />
      <MastCountUp />
      <Footer />
      <BackToTop />
    </>
  );
};

export default Home;

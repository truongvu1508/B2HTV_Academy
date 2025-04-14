import React from "react";
import Navbar from "../../../components/student/Navbar";
import MastHead from "../../../components/client/MastHead";
import Footer from "../../../components/student/Footer";
import MastMiddle from "../../../components/client/MastMiddle";
import MastContent from "../../../components/client/MastContent";
import MastSteps from "../../../components/client/MastSteps";

const Home = () => {
  return (
    <>
      <Navbar />
      <MastHead />
      <MastMiddle />
      <MastContent />
      <MastSteps />
      <Footer />
    </>
  );
};

export default Home;

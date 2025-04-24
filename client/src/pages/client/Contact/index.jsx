import React from "react";
import Navbar from "../../../components/student/Navbar";
import { Helmet } from "react-helmet";
import Footer from "../../../components/student/Footer";

const Contact = () => {
  return (
    <>
      <Helmet>
        <title>Liên hệ</title>
      </Helmet>

      <Navbar />

      <div className="container mt-[80px] mb-[80px] h-screen">
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div class="p-4 col-span-1">
            <div class="text-2xl font-semibold text-dark-1">
              <h3>Liên lạc với chúng tôi</h3>
            </div>
          </div>
          <div class="p-4 col-span-2">Cột 2</div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Contact;

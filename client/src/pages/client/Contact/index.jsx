import React from "react";
import Navbar from "../../../components/student/Navbar";
import { Helmet } from "react-helmet";
import Footer from "../../../components/student/Footer";
import { assets } from "../../../assets/assets";

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
            <div className="flex flex-col gap-5 mt-10">
              <div className="flex items-center gap-5">
                <div className="flex items-center justify-center size-16 rounded-full bg-light">
                  <img src={assets.icon_address} alt="Address" />
                </div>
                <div className="text-sm">TP. Đà Nẵng</div>
              </div>
              <div className="flex items-center gap-5">
                <div className="flex items-center justify-center size-16 rounded-full bg-light">
                  <img src={assets.icon_phone} alt="Phone" />
                </div>
                <div className="text-sm">0987654321</div>
              </div>
              <div className="flex items-center gap-5">
                <div className="flex items-center justify-center size-16 rounded-full bg-light">
                  <img src={assets.icon_mail} alt="Mail" />
                </div>
                <div className="text-sm">B2HTV@gmail.com</div>
              </div>
            </div>
          </div>
          <div class="p-4 col-span-2">
            <div class="text-2xl font-semibold text-dark-1">
              <h3>Gửi tin nhắn</h3>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Contact;

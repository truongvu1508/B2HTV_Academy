import React from "react";
import Navbar from "../../../components/student/Navbar";
import { Helmet } from "react-helmet";
import Footer from "../../../components/student/Footer";
import { assets } from "../../../assets/assets";
import "./Contact.scss";
import BackToTop from "../../../components/client/BackToTop";

const Contact = () => {
  return (
    <>
      <Helmet>
        <title>Liên hệ</title>
      </Helmet>

      <Navbar />

      <div className="container mt-[80px] mb-[80px]">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 col-span-1">
            <div className="text-2xl font-semibold text-dark-1">
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
          <div className="p-4 col-span-2">
            <div className="text-2xl font-semibold text-dark-1">
              <h3>Gửi tin nhắn</h3>
            </div>
            <form
              className="contact-form flex flex-col gap-8 pt-16 lg:pt-10"
              nh-form-contact="3H205VFW1K"
              action="/contact/send-info"
              method="POST"
              autoComplete="off"
              noValidate
            >
              <div className="flex flex-col sm:flex-row gap-6">
                <div className="w-full sm:w-1/2">
                  <label className="text-16 lh-1 fw-500 text-dark-1 mb-10">
                    Họ tên *
                  </label>
                  <input
                    type="text"
                    name="full_name"
                    className="form-control input-cus"
                  />
                </div>
                <div className="w-full sm:w-1/2">
                  <label className="text-16 lh-1 fw-500 text-dark-1 mb-10">
                    Số điện thoại *
                  </label>
                  <input
                    type="phone"
                    name="phone"
                    className="form-control input-cus"
                  />
                </div>
              </div>
              <div className="w-full">
                <label className="text-16 lh-1 fw-500 text-dark-1 mb-10">
                  Tiêu đề
                </label>
                <input
                  type="text"
                  name="full_name"
                  className="form-control input-cus"
                />
              </div>
              <div className="w-full">
                <label className="text-16 lh-1 fw-500 text-dark-1 mb-10">
                  Nội dung
                </label>
                <textarea name="content" id="" className="input-cus"></textarea>
              </div>
              <button className="button w-fit" type="submit">
                Gửi tin nhắn
              </button>
            </form>
          </div>
        </div>
        <div className="mt-10 w-full">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3833.771504114667!2d108.20855337836407!3d16.07734274490404!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3142184792140755%3A0xd4058cb259787dac!2zVHLGsOG7nW5nIMSQ4bqhaSBo4buNYyBTxrAgUGjhuqFtIEvhu7kgdGh14bqtdCAtIMSQ4bqhaSBo4buNYyDEkMOgIE7hurVuZw!5e0!3m2!1svi!2s!4v1745507464518!5m2!1svi!2s"
            className="w-full h-[450px]"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>

      <Footer />
      <BackToTop />
    </>
  );
};

export default Contact;

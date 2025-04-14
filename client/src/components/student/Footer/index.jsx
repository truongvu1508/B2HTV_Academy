import React from "react";
import { Col, Row, Button } from "antd";
import {
  EnvironmentOutlined,
  FacebookFilled,
  InstagramFilled,
  MailOutlined,
  PhoneOutlined,
  YoutubeFilled,
} from "@ant-design/icons";
import "./Footer.scss";
const Footer = () => {
  return (
    <>
      <footer className="footer">
        <div className="container">
          <Row>
            <Col xs={12} sm={12} md={12} lg={6} xl={6}>
              <div className="footer__title">B2HTV Academy</div>
              <div className="footer__content">
                <div className="footer__item">
                  <div className="footer__icon">
                    <PhoneOutlined />
                  </div>
                  <div className="footer__sub">0987654321</div>
                </div>
                <div className="footer__item">
                  <div className="footer__icon">
                    <MailOutlined />
                  </div>
                  <div className="footer__sub">b2htv@gmail.com</div>
                </div>
                <div className="footer__item">
                  <div className="footer__icon">
                    <EnvironmentOutlined />
                  </div>
                  <div className="footer__sub">TP Đà Nẵng</div>
                </div>
              </div>
            </Col>

            <Col xs={12} sm={12} md={12} lg={6} xl={6}>
              <div className="footer__title">VỀ B2HTV</div>
              <div className="footer__content">
                <div className="footer__item">
                  <div className="footer__sub">Về chúng tôi</div>
                </div>
                <div className="footer__item">
                  <div className="footer__sub">Điều khoản dịch vụ</div>
                </div>
                <div className="footer__item">
                  <div className="footer__sub">Chính sách bảo mật</div>
                </div>
              </div>
            </Col>
            <Col xs={12} sm={12} md={12} lg={6} xl={6}>
              <div className="footer__title">THÔNG TIN</div>
              <div className="footer__content">
                <div className="footer__item">
                  <div className="footer__sub">Danh sách khóa học</div>
                </div>
                <div className="footer__item">
                  <div className="footer__sub">Câu hỏi thường gặp</div>
                </div>
                <div className="footer__item">
                  <div className="footer__sub">Góc chia sẻ</div>
                </div>
              </div>
            </Col>
            <Col xs={12} sm={12} md={12} lg={6} xl={6}>
              <div className="footer__title footer__title-media">
                SOCIAL MEDIA
              </div>
              <div className="footer__content">
                <div className="footer__item footer__item-media">
                  <div className="footer__icon footer__icon-media">
                    <FacebookFilled />
                  </div>
                  <div className="footer__icon footer__icon-media">
                    <YoutubeFilled />
                  </div>
                  <div className="footer__icon footer__icon-media">
                    <InstagramFilled />
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </footer>
    </>
  );
};

export default Footer;

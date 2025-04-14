import React from "react";
import "./MastSteps.scss";
import { Col, Row } from "antd";
import { assets } from "../../../assets/assets";

const MastSteps = () => {
  return (
    <section className="mastSteps">
      <div className="container" style={{ padding: "20px" }}>
        <Row justify="center" align="middle" gutter={16}>
          <Col xl={24} lg={24} md={24} style={{ marginBottom: "50px" }}>
            <div className="mastSteps__title">
              <h2>Các bước đăng ký học?</h2>
              <p>Chỉ với 3 bước đăng ký học đơn giản</p>
            </div>
          </Col>

          <Col
            xs={12}
            sm={12}
            md={12}
            lg={8}
            xl={6}
            style={{ padding: "10px", textAlign: "center" }}
          >
            <div className="mastSteps__item">
              <div className="mastSteps__image">
                <img src={assets.click_course} alt="Chọn khóa học" />
                <div className="mastSteps__image-step">
                  <span>01</span>
                </div>
              </div>
            </div>
            <p className="mastSteps__text">Chọn khóa học cần mua</p>
          </Col>
          <Col className="mastSteps__line" xs={0} sm={0} md={0} lg={0} xl={3}>
            <img src={assets.line_1} />
          </Col>
          <Col
            xs={12}
            sm={12}
            md={12}
            lg={8}
            xl={6}
            style={{ padding: "10px" }}
          >
            <div className="mastSteps__item">
              <div className="mastSteps__image">
                <img src={assets.pay_course} alt="Thanh toán khóa học" />
                <div className="mastSteps__image-step">
                  <span>02</span>
                </div>
              </div>
            </div>
            <p className="mastSteps__text">Thanh toán đơn hàng</p>
          </Col>
          <Col className="mastSteps__line" xs={0} sm={0} md={0} lg={0} xl={3}>
            <img src={assets.line_2} />
          </Col>
          <Col
            xs={12}
            sm={12}
            md={12}
            lg={8}
            xl={6}
            style={{ padding: "10px" }}
          >
            <div className="mastSteps__item">
              <div className="mastSteps__image">
                <img src={assets.learn_course} alt="Chọn khóa học" />
                <div className="mastSteps__image-step">
                  <span>03</span>
                </div>
              </div>
            </div>
            <p className="mastSteps__text">Đăng nhập vào học</p>
          </Col>
        </Row>
      </div>
    </section>
  );
};

export default MastSteps;

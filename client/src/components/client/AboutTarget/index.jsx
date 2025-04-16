import React from "react";
import "./AboutTarget.scss";
import { Col, Row } from "antd";
import { assets } from "../../../assets/assets";

const AboutTarget = () => {
  return (
    <section className="aboutTarget">
      <div className="container" style={{ padding: "20px" }}>
        <div className="aboutTarget__title">
          <h2>Mục tiêu của đội ngũ B2HTV Academy!</h2>
          <p className="aboutTarget__sub">B2HTV - Become A Better Developer</p>
        </div>
        <Row justify="center" align="middle">
          <Col
            xs={24}
            sm={24}
            md={12}
            lg={12}
            xl={6}
            style={{ padding: "10px" }}
          >
            <div className="aboutTarget__card">
              <div className="aboutTarget__card-icon">
                <img src={assets.icon_learn} alt="" />
              </div>
              <h4 className="aboutTarget__card-title">Xây dựng cộng đồng</h4>
              <p className="aboutTarget__card-text">
                B2HTV với mong muốn giúp đỡ các bạn sinh viên, lập trình viên
                mới bước vào ngành IT trở thành một lập trình viên giỏi
              </p>
            </div>
          </Col>
          <Col
            xs={24}
            sm={24}
            md={12}
            lg={12}
            xl={6}
            style={{ padding: "10px" }}
          >
            <div className="aboutTarget__card">
              <div className="aboutTarget__card-icon">
                <img src={assets.icon_anything} alt="" />
              </div>
              <h4 className="aboutTarget__card-title">Nâng cao chất lượng</h4>
              <p className="aboutTarget__card-text">
                Đội ngũ B2HTV không ngừng cải thiện trình độ, thái độ, kỹ năng
                sư phạm để từ đó nâng cao chất lượng các khóa học ở hiện tại và
                tương lai
              </p>
            </div>
          </Col>
          <Col
            xs={24}
            sm={24}
            md={12}
            lg={12}
            xl={6}
            style={{ padding: "10px" }}
          >
            <div className="aboutTarget__card">
              <div className="aboutTarget__card-icon">
                <img src={assets.icon_flexible} alt="" />
              </div>
              <h4 className="aboutTarget__card-title">Tận tâm với học viên</h4>
              <p className="aboutTarget__card-text">
                B2HTV luôn tận tâm đồng hành, hỗ trợ học viên hết mình để đạt
                kết quả tốt nhất trên hành trình học tập.
              </p>
            </div>
          </Col>
          <Col
            xs={24}
            sm={24}
            md={12}
            lg={12}
            xl={6}
            style={{ padding: "10px" }}
          >
            <div className="aboutTarget__card">
              <div className="aboutTarget__card-icon">
                <img src={assets.icon_standart} alt="" />
              </div>
              <h4 className="aboutTarget__card-title">
                Sự tin tưởng của học viên
              </h4>
              <p className="aboutTarget__card-text">
                Đây là mục tiêu hàng đầu của B2HTV, mong muốn được kết nối, giúp
                đỡ, nơi đặt niềm tin của các học viên trên toàn quốc.
              </p>
            </div>
          </Col>
        </Row>
      </div>
    </section>
  );
};

export default AboutTarget;

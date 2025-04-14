import React from "react";
import { assets } from "../../../assets/assets";
import { Col, Row, Button } from "antd";
import {
  TrophyOutlined,
  YoutubeOutlined,
  GlobalOutlined,
} from "@ant-design/icons";
import "./MastHead.scss";
import { useClerk } from "@clerk/clerk-react";

const MastHead = () => {
  const { openSignIn } = useClerk();
  return (
    <>
      <section className="masthead">
        <div className="masthead__image">
          <img src={assets.background} alt="image" />
        </div>

        <div className="containe" style={{ padding: "20px" }}>
          <Row justify="center" align="middle">
            <Col
              xs={24}
              sm={24}
              md={24}
              lg={12}
              xl={12}
              style={{ padding: "10px" }}
            >
              <div className="masthead__content">
                <h1 className="masthead__title">
                  Học lập trình C qua 170 video, 320 bài tập Hackerrank và 200
                  bài tập trắc nghiệm.
                </h1>
                <p className="masthead__sub">
                  Đạt được nền tảng kỹ thuật lập trình cực kì vững chắc và tư
                  duy trong việc giải quyết vấn đề. Thành thạo kiến thức về lập
                  trình và quan trọng hơn là vận dụng kiến thức này để giải
                  quyết các bài toán thực tế.
                </p>
                <Button onClick={openSignIn} className="masthead__button">
                  Đăng Ký Tài Khoản
                </Button>
                <Row className="masthead-info">
                  <Col xs={24} sm={24} md={24} lg={8} xl={8}>
                    <div className="masthead-info__item">
                      <div className="masthead-info__icon">
                        <TrophyOutlined />
                      </div>
                      <div className="masthead-info__title">
                        Giảng viên giàu kinh nghiệm
                      </div>
                    </div>
                  </Col>
                  <Col xs={24} sm={24} md={24} lg={8} xl={8}>
                    <div className="masthead-info__item">
                      <div className="masthead-info__icon">
                        <YoutubeOutlined />
                      </div>
                      <div className="masthead-info__title">
                        Khóa học chất lượng
                      </div>
                    </div>
                  </Col>
                  <Col xs={24} sm={24} md={24} lg={8} xl={8}>
                    <div className="masthead-info__item">
                      <div className="masthead-info__icon">
                        <GlobalOutlined />
                      </div>
                      <div className="masthead-info__title">Học bất cứ đâu</div>
                    </div>
                  </Col>
                </Row>
              </div>
            </Col>

            <Col
              xs={24}
              sm={24}
              md={24}
              lg={12}
              xl={12}
              style={{ padding: "10px" }}
              align="center"
            >
              <div className="masthead-image">
                <img src={assets.language_introduction} />
              </div>
            </Col>
          </Row>
        </div>
        <div className="masthead__wave masthead__wave--1"></div>
        <div className="masthead__wave masthead__wave--2"></div>
        <div className="masthead__wave masthead__wave--3"></div>
        <div className="masthead__wave masthead__wave--4"></div>
      </section>
    </>
  );
};

export default MastHead;

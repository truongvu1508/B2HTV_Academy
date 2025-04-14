import { Col, Flex, Row } from "antd";
import React from "react";
import { CheckCircleFilled } from "@ant-design/icons";
import "./MastMiddle.scss";
import { assets } from "../../../assets/assets";
import AOS from "aos";
import "aos/dist/aos.css";

const MastMiddle = () => {
  React.useEffect(() => {
    AOS.init({
      duration: 1500,
      once: false,
      offset: 100,
    });
  }, []);
  return (
    <section className="mastMiddle">
      <div className="container" style={{ padding: "20px" }}>
        <Row
          justify="center"
          align="middle"
          data-aos="fade-up"
          data-aos-anchor-placement="top-bottom"
          data-aos-delay="0"
        >
          <Col
            xs={24}
            sm={24}
            md={24}
            lg={12}
            xl={12}
            style={{ padding: "10px" }}
          >
            <div className="mastMiddle-content">
              <h2
                className="mastMiddle-content__title"
                data-aos="fade-up"
                data-aos-anchor-placement="top-bottom"
                data-aos-delay="100"
              >
                Những kĩ năng mà khóa học đem lại cho học viên
              </h2>
              <p
                className="mastMiddle-content__text"
                data-aos="fade-up"
                data-aos-anchor-placement="top-bottom"
                data-aos-delay="200"
              >
                Với những bài giảng chất lượng và bài tập phong phú,{" "}
                <strong>B2HTV Academy</strong> sẽ đem lại cho người học nhiều kỹ
                năng rất giá trị
              </p>
              <div
                className="mastMiddle-list"
                data-aos="fade-up"
                data-aos-anchor-placement="top-bottom"
                data-aos-delay="300"
              >
                <Flex gap={10} align="center">
                  <div className="mastMiddle-list__icon">
                    <CheckCircleFilled />
                  </div>
                  <div className="mastMiddle-list__title">
                    Sử dụng thành thạo ngôn ngữ lập trình C
                  </div>
                </Flex>
                <Flex gap={10} align="center">
                  <div className="mastMiddle-list__icon">
                    <CheckCircleFilled />
                  </div>
                  <div className="mastMiddle-list__title">
                    Nền tảng kỹ thuật lập trình vững chắc
                  </div>
                </Flex>
                <Flex gap={10} align="center">
                  <div className="mastMiddle-list__icon">
                    <CheckCircleFilled />
                  </div>
                  <div className="mastMiddle-list__title">
                    Nâng cao kỹ năng giải quyết bài toán
                  </div>
                </Flex>
                <Flex gap={10} align="center">
                  <div className="mastMiddle-list__icon">
                    <CheckCircleFilled />
                  </div>
                  <div className="mastMiddle-list__title">
                    Làm quen với các cấu trúc dữ liệu và giải thuật quan trọng
                  </div>
                </Flex>
                <Flex gap={10} align="center">
                  <div className="mastMiddle-list__icon">
                    <CheckCircleFilled />
                  </div>
                  <div className="mastMiddle-list__title">
                    Nâng cao tư duy logic trong lập trình
                  </div>
                </Flex>
              </div>
            </div>
          </Col>
          <Col
            xs={24}
            sm={24}
            md={24}
            lg={12}
            xl={12}
            style={{ padding: "10px" }}
          >
            <div className="mastMiddle-image">
              <img src={assets.bg_software} alt="Background Software" />
            </div>
          </Col>
        </Row>
      </div>
    </section>
  );
};

export default MastMiddle;

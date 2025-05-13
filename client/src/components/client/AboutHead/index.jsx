import React from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { Button, Col, Flex, Row } from "antd";
import { assets } from "../../../assets/assets";
import "./AboutHead.scss";
import { useUser } from "@clerk/clerk-react";
import { useSignInCustom } from "../../../hooks/useSignInCustom";

const AboutHead = () => {
  const handleSignIn = useSignInCustom();
  const { user } = useUser();

  React.useEffect(() => {
    AOS.init({
      duration: 1500,
      once: false,
      offset: 100,
    });
  }, []);
  return (
    <section className="aboutHead">
      <div className="container" style={{ padding: "20px" }}>
        <Row
          justify="center"
          align="middle"
          data-aos="fade-up"
          data-aos-anchor-placement="top-bottom"
          data-aos-delay="0"
        >
          <Col xl={24} lg={24} md={24}>
            <div className="aboutHead__welcome">
              <h2 className="aboutHead__welcome-title">Về chúng tôi</h2>
              <p className="aboutHead__welcome-text">
                <strong>B2HTV Academy</strong> là một đội nhóm gồm sinh viên
                Công nghệ thông tin hiện đang làm việc ở nhiều lĩnh vực khác
                nhau nhưng có chung niềm đam mê với giảng dạy và chia sẻ kiến
                thức. <strong>B2HTV Academy</strong> luôn cố gắng đổi mới, trau
                dồi kỹ năng, đón nhận đóng góp, khắc phúc những điểm chưa tốt để
                mang đến cho các bạn học viên những khóa học lập trình với chất
                lượng cao nhất
              </p>
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
            <div className="aboutHead-image">
              <Row gutter={[16, 16]} align="middle">
                <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                  <div className="image-container">
                    <img
                      src={assets.intro_1}
                      alt="Image 1"
                      style={{ width: "100%", height: "auto" }}
                    />
                  </div>
                </Col>

                <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                  <Row gutter={[0, 16]}>
                    <Col xs={24}>
                      <div className="image-container">
                        <img
                          src={assets.intro_2}
                          alt="Image 2"
                          style={{ width: "70%", height: "auto" }}
                        />
                      </div>
                    </Col>
                    <Col xs={24}>
                      <div className="image-container">
                        <img
                          src={assets.intro_3}
                          alt="Image 3"
                          style={{ width: "90%", height: "auto" }}
                        />
                      </div>
                    </Col>
                  </Row>
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
          >
            <div className="aboutHead-content">
              <h2 className="aboutHead-content__title">
                Chào mừng bạn đến với B2HTV Academy
              </h2>
              <p className="aboutHead-content__text">
                <strong>B2HTV Academy</strong> là đơn vị cung cấp những khóa học
                chất lượng cao về lập trình với mục tiêu lớn nhất là giúp các
                bạn sinh viên IT phát triển kiến thức, sự nghiệp !
              </p>
              {user ? (
                <></>
              ) : (
                <>
                  <Button onClick={handleSignIn} className="aboutHead__button">
                    Đăng Ký Tài Khoản
                  </Button>
                </>
              )}
            </div>
          </Col>
        </Row>
      </div>
    </section>
  );
};

export default AboutHead;

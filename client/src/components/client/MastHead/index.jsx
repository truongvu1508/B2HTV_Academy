import React from "react";
import { assets } from "../../../assets/assets";
import { Col, Row, Button } from "antd";
import {
  TrophyOutlined,
  YoutubeOutlined,
  GlobalOutlined,
} from "@ant-design/icons";
import "./MastHead.scss";
import { useUser } from "@clerk/clerk-react";
import { Cursor, useTypewriter } from "react-simple-typewriter";
import { useSignInCustom } from "../../../hooks/useSignInCustom";

import {
  FaLaptopCode,
  FaMobileAlt,
  FaCloud,
  FaPaintBrush,
} from "react-icons/fa";
import { TbCloudNetwork } from "react-icons/tb";

const MastHead = () => {
  const handleSignIn = useSignInCustom();
  const { user } = useUser();

  const [text] = useTypewriter({
    words: ["B2HTV ACADEMY"],
    loop: true,
    typeSpeed: 100,
    deleteSpeed: 50,
  });

  return (
    <>
      <section className="masthead">
        <div className="masthead__image">
          <img src={assets.background} alt="image" />
        </div>

        <div className="container px-4 sm:px-6 lg:px-8">
          <Row
            justify="center"
            align="middle"
            gutter={[16, 32]}
            className="min-h-screen"
          >
            {/* Content Column */}
            <Col
              xs={24}
              sm={24}
              md={24}
              lg={12}
              xl={12}
              className="order-2 lg:order-1"
            >
              <div className="masthead__content">
                <h1 className="masthead__title">
                  <span>{text}</span>{" "}
                  <span>
                    <Cursor className="text-white" />
                  </span>
                </h1>
                <p className="masthead__sub text-justify">
                  B2HTV Academy là nền tảng đào tạo trực tuyến chuyên sâu về
                  Công nghệ Thông tin, cung cấp các khóa học từ cơ bản đến nâng
                  cao với nội dung thực tiễn và dễ hiểu. Với đội ngũ giảng viên
                  là những chuyên gia giàu kinh nghiệm trong ngành, B2HTV
                  Academy mang đến lộ trình học tập rõ ràng, phù hợp cho cả
                  người mới bắt đầu lẫn lập trình viên muốn nâng cao kỹ năng.
                  Học viên có thể dễ dàng tiếp cận kiến thức ở mọi lúc, mọi nơi
                  và nhanh chóng áp dụng vào công việc thực tế.
                </p>
                <p className="masthead__sub">
                  Đạt được nền tảng kỹ thuật lập trình cực kì vững chắc và tư
                  duy trong việc giải quyết vấn đề. Thành thạo kiến thức về lập
                  trình và quan trọng hơn là vận dụng kiến thức này để giải
                  quyết các bài toán thực tế.
                </p>
                {!user && (
                  <Button onClick={handleSignIn} className="masthead__button">
                    Đăng Ký Tài Khoản
                  </Button>
                )}

                {/* Info Section */}
                <Row className="masthead-info" gutter={[16, 16]}>
                  <Col xs={24} sm={8} md={8} lg={24} xl={8}>
                    <div className="masthead-info__item">
                      <div className="masthead-info__icon">
                        <TrophyOutlined />
                      </div>
                      <div className="masthead-info__title">
                        Giảng viên giàu kinh nghiệm
                      </div>
                    </div>
                  </Col>
                  <Col xs={24} sm={8} md={8} lg={24} xl={8}>
                    <div className="masthead-info__item">
                      <div className="masthead-info__icon">
                        <YoutubeOutlined />
                      </div>
                      <div className="masthead-info__title">
                        Khóa học chất lượng
                      </div>
                    </div>
                  </Col>
                  <Col xs={24} sm={8} md={8} lg={24} xl={8}>
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

            {/* Image Column */}
            <Col
              xs={24}
              sm={24}
              md={24}
              lg={12}
              xl={12}
              className="order-1 lg:order-2 flex justify-center"
            >
              <div className="masthead-image floating-1 relative w-full max-w-md lg:max-w-lg">
                <img
                  src={assets.language_introduction}
                  alt="language introduction"
                  className="rounded-lg w-full h-auto"
                />

                {/* Floating Cards - Responsive positioning */}
                <div className="floating-card floating-card--top-left">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <FaLaptopCode className="text-lg sm:text-2xl text-dark-2" />
                    <div className="whitespace-nowrap text-xs font-semibold text-secondary">
                      Web Developer
                    </div>
                  </div>
                </div>

                <div className="floating-card floating-card--bottom-left">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <FaMobileAlt className="text-lg sm:text-2xl text-dark-2" />
                    <div className="whitespace-nowrap text-xs font-semibold text-secondary">
                      Mobile Developer
                    </div>
                  </div>
                </div>

                <div className="floating-card floating-card--top-right">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <TbCloudNetwork className="text-lg sm:text-2xl text-dark-2" />
                    <div className="whitespace-nowrap text-xs font-semibold text-secondary">
                      Network Engineer
                    </div>
                  </div>
                </div>

                <div className="floating-card floating-card--bottom-right">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <FaPaintBrush className="text-lg sm:text-2xl text-dark-2" />
                    <div className="whitespace-nowrap text-xs font-semibold text-secondary">
                      UX Design
                    </div>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </div>

        {/* Wave animations */}
        <div className="masthead__wave masthead__wave--1"></div>
        <div className="masthead__wave masthead__wave--2"></div>
        <div className="masthead__wave masthead__wave--3"></div>
        <div className="masthead__wave masthead__wave--4"></div>
      </section>
    </>
  );
};

export default MastHead;

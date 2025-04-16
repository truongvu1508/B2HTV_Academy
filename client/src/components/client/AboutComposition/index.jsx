import React from "react";
import "./AboutComposition.scss";
import { Button, Col, Row, Flex } from "antd";
import { CheckCircleFilled } from "@ant-design/icons";
import { useClerk, useUser } from "@clerk/clerk-react";
import { assets } from "../../../assets/assets";

const AboutComposition = () => {
  const { openSignIn } = useClerk();
  const { user } = useUser();
  return (
    <section className="aboutComposition">
      <div className="container" style={{ padding: "20px" }}>
        <Row justify="center" align="middle">
          <Col
            xs={24}
            sm={24}
            md={24}
            lg={12}
            xl={12}
            style={{ padding: "10px" }}
          >
            <h3 className="aboutComposition__title">
              Học tập mọi lúc, mọi nơi
            </h3>
            <p className="aboutComposition__text">
              Những cam kết về khóa học của đội ngũ B2HTV
            </p>
            {user ? (
              <></>
            ) : (
              <>
                <Button
                  onClick={openSignIn}
                  className="aboutComposition__button"
                >
                  Đăng Ký Tài Khoản
                </Button>
              </>
            )}
          </Col>
          <Col
            xs={24}
            sm={24}
            md={24}
            lg={12}
            xl={12}
            style={{ padding: "10px" }}
          >
            <div className="aboutComposition__card">
              <div className="aboutComposition__card-content">
                <Flex gap={10} align="center">
                  <div className="mastMiddle-list__icon">
                    <CheckCircleFilled />
                  </div>
                  <div className="mastMiddle-list__title">
                    Giáo viên tận tâm, trình độ chuyên môn cao
                  </div>
                </Flex>
                <Flex gap={10} align="center">
                  <div className="mastMiddle-list__icon">
                    <CheckCircleFilled />
                  </div>
                  <div className="mastMiddle-list__title">
                    Hỗ trợ học viên 24/24
                  </div>
                </Flex>
                <Flex gap={10} align="center">
                  <div className="mastMiddle-list__icon">
                    <CheckCircleFilled />
                  </div>
                  <div className="mastMiddle-list__title">
                    Kiến thức chặt chẽ
                  </div>
                </Flex>
                <Flex gap={10} align="center">
                  <div className="mastMiddle-list__icon">
                    <CheckCircleFilled />
                  </div>
                  <div className="mastMiddle-list__title">
                    Kho tài liệu phong phú
                  </div>
                </Flex>
              </div>
              <div className="aboutComposition__card-image">
                <img src={assets.bg_student_learn} alt="Background Student" />
              </div>
            </div>
          </Col>
        </Row>
      </div>
    </section>
  );
};

export default AboutComposition;

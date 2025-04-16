import React from "react";
import "./AboutComposition.scss";
import { assets } from "../../../assets/assets";
import { Button, Col, Row } from "antd";
import { useClerk, useUser } from "@clerk/clerk-react";

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
                <img src={assets.icon_learn} alt="" />
              </div>
              <h4 className="aboutComposition__card-title">
                Xây dựng cộng đồng
              </h4>
              <p className="aboutComposition__card-text">
                B2HTV với mong muốn giúp đỡ các bạn sinh viên, lập trình viên
                mới bước vào ngành IT trở thành một lập trình viên giỏi
              </p>
            </div>
          </Col>
        </Row>
      </div>
    </section>
  );
};

export default AboutComposition;

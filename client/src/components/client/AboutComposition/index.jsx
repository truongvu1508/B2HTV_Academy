import React from "react";
import "./AboutComposition.scss";
import { Button, Col, Row, Flex } from "antd";
import { CheckCircleFilled } from "@ant-design/icons";
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

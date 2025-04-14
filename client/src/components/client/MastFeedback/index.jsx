import React from "react";
import "./MastFeedback.scss";
import { Col, Row } from "antd";
import { UserOutlined } from "@ant-design/icons";

const MastFeedback = () => {
  return (
    <section className="mastFeedback">
      <div className="container" style={{ padding: "20px" }}>
        <Row justify="center" align="center" gutter={[16, 16]}>
          <Col xl={24} lg={24} md={24}>
            <div className="mastFeedback__title">
              <h2>Cảm nhận của học viên</h2>
            </div>
          </Col>
          <Col
            xs={24}
            sm={24}
            md={12}
            lg={8}
            xl={8}
            style={{ padding: "10px" }}
          >
            <div className="mastFeedback__card">
              <h4 className="mastFeedback__card-title">Khóa học tuyệt vời</h4>
              <p className="mastFeedback__card-text">
                "Chất lượng giảng dạy tuyệt vời, giảng viên cùng trợ giảng nhiệt
                tình nhiệt huyết, giảng dạy dễ hiểu giúp học viên dễ tiếp thu
                với kiến thức mới. Cảm ơn đã mang tới trải nghiệm tuyệt vời đến
                cho mình và các bạn học viên. Mình sẽ giới thiệu cho bạn bè với
                người thân muốn học lập trình"
              </p>
              <div className="mastFeedback-footer">
                <div className="mastFeedback-footer__image">
                  <UserOutlined />
                </div>
                <div className="mastFeedback-footer__content">
                  <div className="mastFeedback-footer__title">Đỗ Thành Bảo</div>
                  <div className="mastFeedback-footer__text">
                    Lập trình C/C++
                  </div>
                </div>
              </div>
            </div>
          </Col>
          <Col
            xs={24}
            sm={24}
            md={12}
            lg={8}
            xl={8}
            style={{ padding: "10px" }}
          >
            <div className="mastFeedback__card">
              <h4 className="mastFeedback__card-title">Khóa học tuyệt vời</h4>
              <p className="mastFeedback__card-text">
                "Khóa học quá đỉnh, quá chất lượng, quá dễ hiểu quá tuyệt vời;
                Thật không thể tin được !!!. Giảng viên siêu dễ thương, hài
                hước, gần gũi, dạy dễ hiểu và hỗ trợ nhiệt tình. Hiện tại mình
                đang tham gia khóa Java và C++ cơ bản đến nâng cao, cảm thấy rất
                đáng đồng tiền và bát gạo tuy học phí rất phải chăng"
              </p>
              <div className="mastFeedback-footer">
                <div className="mastFeedback-footer__image">
                  <UserOutlined />
                </div>
                <div className="mastFeedback-footer__content">
                  <div className="mastFeedback-footer__title">
                    Nguyễn Xuân Hoàng
                  </div>
                  <div className="mastFeedback-footer__text">
                    Lập trình Java
                  </div>
                </div>
              </div>
            </div>
          </Col>
          <Col
            xs={24}
            sm={24}
            md={12}
            lg={8}
            xl={8}
            style={{ padding: "10px" }}
          >
            <div className="mastFeedback__card">
              <h4 className="mastFeedback__card-title">Khóa học tuyệt vời</h4>
              <p className="mastFeedback__card-text">
                "Chất lượng giảng dạy tuyệt vời, giảng viên cùng trợ giảng nhiệt
                tình nhiệt huyết, giảng dạy dễ hiểu giúp học viên dễ tiếp thu
                với kiến thức mới. Cảm ơn đã mang tới trải nghiệm tuyệt vời đến
                cho mình và các bạn học viên. Mình sẽ giới thiệu cho bạn bè với
                người thân muốn học lập trình"
              </p>
              <div className="mastFeedback-footer">
                <div className="mastFeedback-footer__image">
                  <UserOutlined />
                </div>
                <div className="mastFeedback-footer__content">
                  <div className="mastFeedback-footer__title">
                    Nguyễn Trường Vũ
                  </div>
                  <div className="mastFeedback-footer__text">
                    Lập trình C/C++
                  </div>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </div>
    </section>
  );
};

export default MastFeedback;

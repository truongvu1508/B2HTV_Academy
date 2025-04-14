import { Col, Row } from "antd";
import React from "react";
import { BsFillBagCheckFill } from "react-icons/bs";
import "./MastContent.scss";
import { PiStudentBold } from "react-icons/pi";
import { FaStar } from "react-icons/fa";

const MastContent = () => {
  return (
    <section className="mastContent">
      <div className="container" style={{ padding: "20px" }}>
        <Row
          justify="center"
          align="middle"
          gutter={[16, 16]}
          data-aos="fade-up"
          data-aos-anchor-placement="top-bottom"
        >
          <Col xl={24} lg={24} md={24}>
            <div className="mastContent__title">
              <h2>Tại sao bạn nên học với B2HTV Academy</h2>
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
            <div className="mastContent__card">
              <div className="mastContent__card-icon">
                <FaStar />
              </div>
              <h4 className="mastContent__card-title">01. Chất lượng cao</h4>
              <p className="mastContent__card-text">
                Nội dung của khóa học được đầu tư cả về chất và lượng, giáo viên
                có kinh nghiệm và cực kỳ tâm huyết với công việc giảng dạy
              </p>
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
            <div className="mastContent__card">
              <div className="mastContent__card-icon">
                <PiStudentBold />
              </div>
              <h4 className="mastContent__card-title">01. Chất lượng cao</h4>
              <p className="mastContent__card-text">
                Khi học ngôn ngữ lập trình C bạn không chỉ đơn thuần học ngôn
                ngữ C mà còn học kỹ thuật lập trình, tư duy logic, cách giải
                quyết bài toán, thuật toán... Những kỹ năng sẽ theo bạn mãi
                trong công việc sau này.
              </p>
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
            <div className="mastContent__card">
              <div className="mastContent__card-icon">
                <BsFillBagCheckFill />
              </div>
              <h4 className="mastContent__card-title">01. Chất lượng cao</h4>
              <p className="mastContent__card-text">
                Kỹ thuật lập trình là kỹ năng đầu tiên cần phải học khi bạn muốn
                trở thành một lập trình viên, việc học tốt kỹ thuật lập trình sẽ
                là bước đệm vững chắc cho sự nghiệp của bạn.
              </p>
            </div>
          </Col>
        </Row>
      </div>
    </section>
  );
};

export default MastContent;

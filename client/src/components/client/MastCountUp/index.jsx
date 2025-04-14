import React, { useState, useRef, useEffect } from "react";
import "./MastCountUp.scss";
import CountUp from "react-countup";
import { Col, Row } from "antd";

const MastCountUp = () => {
  const [counterOn, setCounterOn] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setCounterOn(true);
        } else {
          setCounterOn(false);
        }
      },
      {
        threshold: 0.1,
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <section className="mastCountUp" ref={sectionRef}>
      <div className="container" style={{ padding: "20px" }}>
        <Row justify="center" align="middle" gutter={[16, 16]}>
          <Col
            xs={24}
            sm={24}
            md={12}
            lg={8}
            xl={8}
            style={{ padding: "10px" }}
          >
            <div className="mastCountUp__item">
              <h4 className="mastCountUp__title">
                {counterOn && (
                  <CountUp start={0} end={3000} duration={2} delay={0} />
                )}
                +
              </h4>
              <p className="mastCountUp__sub">Học viên toàn quốc</p>
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
            <div className="mastCountUp__item">
              <h4 className="mastCountUp__title">
                {counterOn && (
                  <CountUp start={0} end={30} duration={2} delay={0} />
                )}
                +
              </h4>
              <p className="mastCountUp__sub">Khóa học</p>
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
            <div className="mastCountUp__item">
              <h4 className="mastCountUp__title">
                {counterOn && (
                  <CountUp start={0} end={300} duration={2} delay={0} />
                )}
                +
              </h4>
              <p className="mastCountUp__sub">Đánh giá tích cực</p>
            </div>
          </Col>
        </Row>
      </div>
    </section>
  );
};

export default MastCountUp;

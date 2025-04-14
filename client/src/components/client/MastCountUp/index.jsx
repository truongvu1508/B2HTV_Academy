import React, { useState } from "react";
import "./MastCountUp.scss";
import CountUp from "react-countup";
import ScrollTrigger from "react-scroll-trigger";
import { Col, Row } from "antd";

const MastCountUp = () => {
  const [counterOn, setCounterOn] = useState(false);
  return (
    <>
      <ScrollTrigger
        onEnter={() => setCounterOn(true)}
        onExit={() => setCounterOn(false)}
      >
        <section className="mastCountUp">
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
                <div className="mastCountUp">
                  <h4 className="mastCountUp__title">
                    {counterOn && (
                      <CountUp start={0} end={100} duration={2} delay={0} />
                    )}
                    +
                  </h4>
                  <p className="mastCountUp__sub"></p>
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
                <div className="mastCountUp">
                  <h4 className="mastCountUp__title">
                    {counterOn && (
                      <CountUp start={0} end={100} duration={2} delay={0} />
                    )}
                    +
                  </h4>
                  <p className="mastCountUp__sub"></p>
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
                <div className="mastCountUp">
                  <h4 className="mastCountUp__title">
                    {counterOn && (
                      <CountUp start={0} end={100} duration={2} delay={0} />
                    )}
                    +
                  </h4>
                  <p className="mastCountUp__sub"></p>
                </div>
              </Col>
            </Row>
          </div>
        </section>
      </ScrollTrigger>
    </>
  );
};

export default MastCountUp;

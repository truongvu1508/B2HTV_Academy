import React from "react";
import { assets } from "../../assets/assets";
import { Link } from "react-router-dom";
import { Button } from "antd";
import { Helmet } from "react-helmet";

const Error404 = () => {
  return (
    <>
      <Helmet>
        <title>Error 404</title>
      </Helmet>
      <div className="flex items-center flex-col text-center justify-center min-bs-[100dvh] p-6">
        <div className="flex flex-col gap-2 is-[90vw] sm:is-[unset] mbe-6 mb-30">
          <h1 className="MuiTypography-root MuiTypography-h1 text-8xl mui-b45qbx">
            404
          </h1>
          <h4 className="MuiTypography-root MuiTypography-h4 mui-pwk8c2">
            Page Not Found ⚠️
          </h4>
          <p className="MuiTypography-root MuiTypography-body1 mui-lus6is">
            we couldn't find the page you are looking for.
          </p>
        </div>
        <Button color="cyan" variant="outlined">
          <Link to="/">Quay lại trang chủ</Link>
        </Button>
        <img
          alt="error-404-illustration"
          src={assets.error404}
          className="object-cover bs-[327px] sm:bs-[400px] md:bs-[450px] lg:bs-[500px] mbs-6"
        ></img>
      </div>
    </>
  );
};

export default Error404;

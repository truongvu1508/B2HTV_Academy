import React, { useEffect, useState } from "react";
import { FaChevronCircleUp } from "react-icons/fa";

const BackToTop = () => {
  const [showButton, setShowButton] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleScrolling = () => {
    if (scrollY > 500) {
      setShowButton(true);
    } else {
      setShowButton(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScrolling);
    return () => {
      window.removeEventListener("scroll", handleScrolling);
    };
  }, []);
  return (
    <div>
      <button
        className={`fixed right-8 bottom-8 ${
          showButton ? "visible" : "invisible"
        }`}
      >
        <FaChevronCircleUp
          className="text-3xl text-green-1 animate-bounce"
          onClick={scrollToTop}
        />
      </button>
    </div>
  );
};

export default BackToTop;

import React from "react";
import classNames from "classnames";

const Preloader = ({ className, absolute, fixed }) => {
  return (
    <div
      className={classNames("Preloader", { absolute, fixed }, className)}>
      <div className="animation">
        <span />
        <span />
        <span />
      </div>
    </div>
  );
};

export default Preloader;

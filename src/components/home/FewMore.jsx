import React, { useState } from "react";
import "./fewMore.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretLeft } from "@fortawesome/free-solid-svg-icons";
import { useSelector } from "react-redux";
import BlurhashImage from "../basicComponents/BlurHash-Frontend";

const FewMore = () => {
  const others = useSelector((state) => state.Home.school.payload.others);

  const [current, setCurrent] = useState(others[0]);

  const [cImage, setCImage] = useState(0);

  function changeImage(a) {
    if (a === "add") {
      if (current.images.length > cImage + 1) {
        setCImage(cImage + 1);
      }
    } else {
      if (cImage > 0) {
        setCImage(cImage - 1);
      }
    }
  }

  return (
    <div className="fewMoreu3839">
      {others && others.length > 0 && (
        <div className="container12x">
          <p className="h4 text-primary text-center p-3 w600">
            {" "}
            Few More Things{" "}
          </p>

          <div className="buttons custom-scrollbar">
            {others.map((ind,index) => {
              return (
                <button key={index}
                  onClick={() => {
                    setCurrent(ind);
                    setCImage(0);
                  }}
                  className={`${current._id === ind._id ? "active" : ""}`}
                >
                  {ind.tName}
                </button>
              );
            })}
          </div>

          <div className="box">
            <div className="each left flex1">
              <p className="h5 w600"> {current.title} </p>
              <p className="px-3 py-3 h6 w400">{current.details}</p>
            </div>

            {current.images && current.images.length > 0 && (
              <div className="each right">
                <div className="image">
                  {/* <img
                src={
                  current.images[cImage].secure_url
                }
                alt=""
              /> */}

                  <div className="img">
                    <BlurhashImage
                      imageUrl={current.images[cImage].secure_url}
                      blurhash={current.images[cImage].blurHash}
                      width={current.images[cImage].width}
                      height={current.images[cImage].height}
                    />
                  </div>
                </div>

                <div className="controls flex1">
                  <div
                    className="element icon flex1"
                    onClick={() => changeImage("sub")}
                  >
                    <FontAwesomeIcon icon={faCaretLeft} />
                  </div>
                  <div className="element flex1">
                    {current.images.map((ind, index) => {
                      return (
                        <div
                        key={index}
                          className={`dots ${cImage === index ? "active" : ""}`}
                        ></div>
                      );
                    })}
                  </div>
                  <div
                    className="element icon flex1"
                    onClick={() => changeImage("add")}
                  >
                    <FontAwesomeIcon
                      icon={faCaretLeft}
                      style={{ transform: "rotate(180deg)" }}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FewMore;

import React from "react";
import "./albums2.scss";

import { SET_BIGIMAGE } from "../../redux/BigImageSlice";
import { useDispatch } from "react-redux";

const Albums01 = ({ data, allImages }) => {
  let images_array;

  const dispatch = useDispatch();
  let object = {};

  images_array = data.map((obj) => obj.secure_url);

  function loadBigImage(data) {
    object = {
      index: data,
      data: images_array,
    };

    dispatch(SET_BIGIMAGE(object));

    console.log(images_array);
  }

  return (
    <div className="albums002yejdgh">
      <div className="containeraa">
        <div className="columnaa">
          {data.map((img, index) => {
            if (index >= 4 && !allImages) {
              return null;
            }

            return (
              <div
                key={index}
                onClick={() => loadBigImage(index)}
                className={`image ${
                  data.length === 1 || (data.length === 3 && index === 2)
                    ? "onlyOne"
                    : ""
                }`}
              >
                <img
                  src={img.secure_url}
                  alt={`Image_${index}`}
                  className="image"
                />

                {/* <div className="img">
        <BlurhashImage imageUrl={img.secure_url} blurhash={img.blurHash} width={img.width} height={img.height} />
        </div> */}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Albums01;

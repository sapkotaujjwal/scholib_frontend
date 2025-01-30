import React from "react";
import "./MultipleImages.scss";
import AnimatedBlurhashImage from "../layout/blurHash";
import { Blurhash } from "react-blurhash";

const multipleImages = () => {
  const images = [
    "https://cdn.pixabay.com/photo/2014/11/30/14/11/cat-551554_640.jpg",
    "https://cdn.pixabay.com/photo/2020/03/12/17/29/tiger-4925778_640.jpg",
    "https://cdn.pixabay.com/photo/2014/09/07/22/34/car-race-438467_640.jpg",
  ];

  const imageForTest = [
    {
      blurHash: "U7F=zF_300?H9FWB%Mof00M{-pRj~qt7M{j[",
      secure_url:
        "https://res.cloudinary.com/dodvbotgd/image/upload/v1703069208/oa63c8zhokxbskwwes9n.jpg",
      public_id: "oa63c8zhokxbskwwes9n",
      height: 1280,
      width: 960,
    },
    {
      blurHash: "U7F=zF_300?H9FWB%Mof00M{-pRj~qt7M{j[",
      secure_url:
        "https://res.cloudinary.com/dodvbotgd/image/upload/v1703069180/qayvpdkhnz9z2mtxyeal.jpg",
      public_id: "qayvpdkhnz9z2mtxyeal",
      height: 1280,
      width: 960,
    },
    {
      blurHash: "UKL4$#~q.7IU_2WVxvofS2M_RQxu?caeM{oz",
      secure_url:
        "https://res.cloudinary.com/dodvbotgd/image/upload/v1702193631/fvkue0pcdzvybcqj4sky.jpg",
      public_id: "fvkue0pcdzvybcqj4sky",
      height: 1280,
      width: 960,
    },
    {
      blurHash: "UAHoE~xuNF%M~pjZWBoeRjofWBj[t7ofoKj[",
      secure_url:
        "https://res.cloudinary.com/dodvbotgd/image/upload/v1702193627/kjtwnoyydi6j1o7pdba9.jpg",
      public_id: "kjtwnoyydi6j1o7pdba9",
      height: 1274.7181139081733,
      width: 963.9778289747585,
    },
  ];

  return (
    <div className="multipleImages36737">

    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around' }}>
      {imageForTest.map((image, index) => (
        <div key={index} className="image-container" style={{ margin: '10px', overflow: 'hidden', borderRadius: '8px', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)' }}>
          <Blurhash
            hash={image.blurHash}
            resolutionX={32}
            resolutionY={32}
          >
            <img
              src={image.secure_url}
              alt={`Image ${index + 1}`}
              width={image.width}
              height={image.height}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              loading="lazy"
            />
          </Blurhash>
        </div>
      ))}
    </div>


    //   {/* <div className="container">
    //         {images.map((img)=>{
    //             return(
    //                 <div className="image00">
    //                 <img src={img} />
    //                 <div className="cover"></div>
    //                 </div>
    //             )
    //         })}
    //     </div> */}


    // </div>

        // <div className="multipleImages36737">
    //   <div className="container">
    //     {imageForTest.map((obj) => {
    //       return (
    //         <div className="image00">
    //             <AnimatedBlurhashImage imageUrl={obj.secure_url} blurhash={obj.blurHash} width={obj.width} height={obj.height}  />
    //         </div>
    //       );
    //     })}
    //   </div>

    //   {/* <div className="container">
    //         {images.map((img)=>{
    //             return(
    //                 <div className="image00">
    //                 <img src={img} />
    //                 <div className="cover"></div>
    //                 </div>
    //             )
    //         })}
    //     </div> */}


    // </div>
    
  );
};

export default multipleImages;

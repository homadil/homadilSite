import React, { useContext, useEffect, useRef, useState } from "react";
import "./stylesheet/homeImageSlider.css";
import { DataContext } from "../store";
import { Link } from "react-router-dom";
import CustomSlider from "./CustomSlide";
import bg_blind from "../assets/images/sub_bg.jpg";
export default function HomeImageSlide({ index, item }) {
  const { backend_url, truncateContent } = useContext(DataContext);
  const [width, setWidth] = useState(window.innerWidth);
  const bg = useRef();
  // Update width on window resize
  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    bg.current?.classList.add("from_left");

    // Cleanup listener on unmount
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const stylesheet = {
    dummy: {
      backgroundImage: `url(${backend_url}/${item.show})`,
      backgroundRepeat: "no-repeat",
      backgroundSize: "cover",
      backgroundPosition: "center",
      width: "100%",
      zIndex: "-100",
      position: "absolute",
      filter: "brightness(0.5)",
      height:
        width <= 768
          ? "100vh" // Mobile
          : width <= 1024
          ? "100vh" // Tablet
          : width <= 1440
          ? "100vh" // Desktop
          : width <= 1920
          ? "750px" // TV
          : "900px", // Large screen
    },
    bg: {
      width: "100%",
      position: "relative",
      display: "flex",
      height:
        width <= 768
          ? "100vh" // Mobile
          : width <= 1024
          ? "100vh" // Tablet
          : width <= 1440
          ? "100vh" // Desktop
          : width <= 1920
          ? "750px" // TV
          : "900px", // Large screen
      maxHeight: "900px",
    },
    container: {
      zIndex: "100 !important",
      display: "flex",
      alignItems: "center",
      textAlign: "center",
      justifyContent: "space-between",
      width: "100%",
      height: "100%",
    },
  };

  return (
    <div className="slider-item animate" style={stylesheet.bg}>
      <div style={stylesheet.dummy} className="slide_bg" ref={bg}></div>
      <div style={stylesheet.container}>
        {/* left side */}
        <div className="left">
          {/* Slide Number */}
          <div className="text-outline slide_number slide_text_1 slide_text_active ">
            0{index + 1}
          </div>

          {/* Small Title */}
          <div className="slide_title slide_text_2 slide_text_active ">
            <span className="text-white">{item.title} </span>
          </div>

          {/* Large Title */}
          <div className={`slider-large-title slide_text_3 slide_text_active `}>
            <div className="text-white slide_text">
              {truncateContent(item.description, 10)}
            </div>
          </div>

          <div
            className="slide_text_4 slide_text_active "
            style={{
              display: "flex",
              alignItems: "baseline",
              justifyContent: "flex-start",
            }}
          >
            {/* Button Underline */}
            <hr
              style={{
                color: "#d5dd02",
                width: "50px",
                padding: "0",
                margin: "0",
                border: "2px solid #d5dd02",
              }}
              className={`slider-button-line`}
            />
            {/* Button */}
            <Link
              to={`/project_detail?id=${item.id}`}
              className={`slider-button animate-fade`}
            >
              More About
            </Link>
          </div>
        </div>

        <div className={`slider-image-right `}>
          <CustomSlider mediaItems={item.Media} />
        </div>
      </div>
      <div
        className="blind"
        style={{
          backgroundImage: `url(${bg_blind})`,
        }}
      >
        <div className="blind_container">
          <ul className="blind_links">
            {item?.Urls?.map((url, index) => (
              <li key={index}>
                <a href={url.link} target="black">
                  {url.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

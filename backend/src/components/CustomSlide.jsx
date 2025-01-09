import React, { useState, useContext } from "react";
import { useSpring, animated } from "@react-spring/web";
import { DataContext } from "../store";

const CustomSlider = ({ mediaItems }) => {
  const { backend_url } = useContext(DataContext);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Update the index every 5 seconds
  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % mediaItems.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, [mediaItems.length]);

  const props = useSpring({
    opacity: 1,
    from: { opacity: 0 },
    reset: true,
  });

  return (
    <div style={{ position: "relative", width: "100%", overflow: "hidden" }}>
      <animated.div style={props}>
        {mediaItems.map((media, index) => {
          if (index === currentIndex) {
            return (
              <div key={index} style={{ width: "100%", height: "auto" }}>
                {media.exe === "image" ? (
                  <img
                    src={`${backend_url}/${media.path}`}
                    alt=""
                    className="custom_slide"
                  />
                ) : (
                  <video
                    src={`${backend_url}/${media.path}`}
                    style={{ width: "100%", height: "auto" }}
                    controls
                    autoPlay
                    muted
                  />
                )}
              </div>
            );
          }
          return null; // Only render the current index
        })}
      </animated.div>
    </div>
  );
};

export default CustomSlider;

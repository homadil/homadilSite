import React, { useEffect, useState } from "react";
import apiRequest from "../../../apiRequest";
import Loader from "../../../components/Loader";
import ImageTemplate from "../../../components/ImageTemplate";
import { Helmet } from "react-helmet-async";

export default function UploadMedia() {
  const [medias, setMedias] = useState([]);
  const [blog, setBlog] = useState([]);
  const [project, setProject] = useState([]);
  const [homeHeader, setHomeHeader] = useState([]);
  const [homeGrid, setHomeGrid] = useState([]);
  const [newsHeader, setNewsHeader] = useState([]);
  const [aboutUsHeader, setAboutUsHeader] = useState([]);
  const [aboutUsImage, setAboutUsImage] = useState([]);
  const [contactUsHeader, setContactUsHeader] = useState([]);
  const [projectHeader, setProjectHeader] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    apiRequest.get("/medias").then((res) => {
      const medias = res.media;
      setMedias(medias);
      updateFilteredMedia(medias);
    });
  }, []);

  function updateFilteredMedia(medias) {
    // Filter for different media types
    setBlog(medias.filter((item) => item.type === "blog"));

    setProject(medias.filter((item) => item.type === "project"));
    setHomeHeader(medias.filter((item) => item.type === "home_header"));
    setHomeGrid(medias.filter((item) => item.type === "home_grid"));
    setNewsHeader(medias.filter((item) => item.type === "news_header"));
    setAboutUsHeader(medias.filter((item) => item.type === "about_us_header"));
    setAboutUsImage(medias.filter((item) => item.type === "about_us_image"));
    setContactUsHeader(
      medias.filter((item) => item.type === "contact_us_header")
    );
    setProjectHeader(medias.filter((item) => item.type === "project_header"));
  }

  if (loading) {
    return <Loader />;
  }

  return (
    <div>
      <Helmet>
        <title>Homadil | Admin | Media Upload</title>
      </Helmet>
      <ul style={{ listStyle: "none" }}>
        <li>
          <ImageTemplate
            medias={medias}
            data={blog}
            header="Blog"
            setMedias={setMedias}
            updateFilteredMedia={updateFilteredMedia}
            type={"blog"}
          />
        </li>
        {/* Add similar sections for the other media types as needed */}
        <li>
          <ImageTemplate
            medias={medias}
            data={project}
            header="Project"
            setMedias={setMedias}
            updateFilteredMedia={updateFilteredMedia}
            type={"project"}
          />
        </li>
        <li>
          <ImageTemplate
            medias={medias}
            data={homeHeader}
            header="Home Header"
            setMedias={setMedias}
            updateFilteredMedia={updateFilteredMedia}
            type={"home_header"}
          />
        </li>
        <li>
          <ImageTemplate
            medias={medias}
            data={homeGrid}
            header="Home Grid"
            setMedias={setMedias}
            updateFilteredMedia={updateFilteredMedia}
            type={"home_grid"}
          />
        </li>
        <li>
          <ImageTemplate
            medias={medias}
            data={newsHeader}
            header="News Header"
            setMedias={setMedias}
            updateFilteredMedia={updateFilteredMedia}
            type={"news_header"}
          />
        </li>
        <li>
          <ImageTemplate
            medias={medias}
            data={projectHeader}
            header="Project Header"
            setMedias={setMedias}
            updateFilteredMedia={updateFilteredMedia}
            type={"project_header"}
          />
        </li>
        <li>
          <ImageTemplate
            medias={medias}
            data={aboutUsHeader}
            header="About us Header"
            setMedias={setMedias}
            updateFilteredMedia={updateFilteredMedia}
            type={"about_us_header"}
          />
        </li>
        <li>
          <ImageTemplate
            medias={medias}
            data={aboutUsImage}
            header="About us Image"
            setMedias={setMedias}
            updateFilteredMedia={updateFilteredMedia}
            type={"about_us_image"}
          />
        </li>
        <li>
          <ImageTemplate
            medias={medias}
            data={contactUsHeader}
            header="Contact us Header"
            setMedias={setMedias}
            updateFilteredMedia={updateFilteredMedia}
            type={"contact_us_header"}
          />
        </li>

        {/* You can add the same structure for the other media categories */}
      </ul>
    </div>
  );
}

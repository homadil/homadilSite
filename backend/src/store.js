import React, { createContext, useEffect, useState } from "react";
import apiRequest from "./apiRequest";
// 1. Create the context
export const DataContext = createContext();

// 2. Create the provider component
export const DataProvider = ({ children }) => {
  // 3. State for blogs and projects
  const [blogs, setBlogs] = useState([]);

  const [projects, setProjects] = useState([]);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [partners, setPartners] = useState([]);

  // Function to format the date
  const formatDate = (dateString) => {
    const date = new Date(dateString); // Convert string to Date object

    const day = date.getDate(); // Get day (e.g., 25)
    const month = date.toLocaleString("default", { month: "short" }); // Get month (e.g., "Aug")
    const year = date.getFullYear(); // Get year (e.g., 2024)

    return { day, month, year };
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString); // Convert the string to a Date object
    return date
      .toLocaleString("en-US", {
        year: "numeric",
        month: "long", // Full month name like "March"
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        hour12: true, // 12-hour format (AM/PM)
      })
      .replace(",", " at"); // Replace the first comma with ' at'
  };

  const truncateContent = (desc, wordLimit) => {
    const words = desc.split(" "); // Split desc into an array of words
    if (words.length > wordLimit) {
      return words.slice(0, wordLimit).join(" ") + "..."; // Join the first 'wordLimit' words and add "..."
    }
    return desc; // If the desc is less than the limit, return it as is
  };
  const [homeHeader, setHomeHeader] = useState([]);
  const [homeGrid, setHomeGrid] = useState([]);
  const [newsHeader, setNewsHeader] = useState([]);
  const [aboutUsHeader, setAboutUsHeader] = useState([]);
  const [aboutUsImage, setAboutUsImage] = useState([]);
  const [contactUsHeader, setContactUsHeader] = useState([]);
  const [projectHeader, setProjectHeader] = useState([]);
  const [testimonies, setTestimonies] = useState([]);
  const [teams, setTeams] = useState([]);
  const backend_url = process.env.REACT_APP_BACKEND_URL;
  const [loaders, setLoaders] = useState({
    medias: false,
    testimonies: false,
    teams: false,
    projects: false,
    partners: false,
    blogs: false,
    tags: false,
    categories: false,
  });
  useEffect(() => {
    setLoaders({
      medias: true,
      testimonies: true,
      teams: true,
      projects: true,
      partners: true,
      blogs: true,
      categories: true,
      tags: true,
    });

    apiRequest
      .get("/medias")
      .then((res) => {
        const medias = res.media;
        // Filter for different media types
        setHomeHeader(medias.filter((item) => item.type === "home_header"));
        setHomeGrid(medias.filter((item) => item.type === "home_grid"));
        setNewsHeader(medias.filter((item) => item.type === "news_header"));
        setAboutUsHeader(
          medias.filter((item) => item.type === "about_us_header")
        );
        setAboutUsImage(
          medias.filter((item) => item.type === "about_us_image")
        );
        setContactUsHeader(
          medias.filter((item) => item.type === "contact_us_header")
        );
        setProjectHeader(
          medias.filter((item) => item.type === "project_header")
        );
      })
      .finally(() => setLoaders({ medias: false }));

    apiRequest
      .get("/testimonies")
      .then((res) => {
        setTestimonies(res);
      })
      .finally(() => setLoaders({ testimonies: false }));

    apiRequest
      .get("/teams")
      .then((res) => {
        setTeams(res);
      })
      .finally(() => setLoaders({ teams: false }));

    apiRequest
      .get("/projects")
      .then((res) => {
        setProjects(res);
      })
      .finally(() => setLoaders({ projects: false }));

    apiRequest
      .get("/partners")
      .then((res) => {
        setPartners(res);
      })
      .finally(() => setLoaders({ partners: false }));

    apiRequest
      .get("/blogs")
      .then((res) => {
        setBlogs(res);
      })
      .finally(() => setLoaders({ blogs: false }));

    apiRequest
      .get("/categories")
      .then((res) => {
        setCategories(res);
      })
      .finally(() => setLoaders({ categories: false }));

    apiRequest
      .get("/tags")
      .then((res) => {
        setTags(res);
      })
      .finally(() => setLoaders({ tags: false }));
  }, []);

  // 4. Provide the data and functions
  return (
    <DataContext.Provider
      value={{
        blogs,
        setBlogs,
        projects,
        setProjects,
        formatDate,
        truncateContent,
        formatDateTime,
        homeHeader,
        homeGrid,
        newsHeader,
        aboutUsHeader,
        contactUsHeader,
        projectHeader,
        aboutUsImage,
        backend_url,
        testimonies,
        setTestimonies,
        teams,
        setTeams,
        partners,
        setPartners,
        categories,
        setCategories,
        loaders,
        tags,
        setTags,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

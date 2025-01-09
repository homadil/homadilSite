import React from "react";
import { useLocation } from "react-router-dom";
import UploadMedia from "./Pages/UploadMedia";
import Blog from "./Pages/Blog";
import Project from "./Pages/Project";
import Team from "./Pages/Team";
import Testimony from "./Pages/Testimony";
import Tag from "./Pages/Tag";
import Category from "./Pages/Category";
import Url from "./Pages/Url";
import Comment from "./Pages/Comment";
import Partner from "./Pages/Partner";
import Notification from "./Pages/Notification";
import Estate from "./Pages/Estate";
export default function AdminRouter() {
  const location = useLocation();

  // Create an instance of URLSearchParams
  const params = new URLSearchParams(location.search);

  // Get reset_token and id from the query parameters
  const page = params.get("page");

  switch (page) {
    case "upload_media":
      return <UploadMedia />;

    case "blog":
      return <Blog />;

    case "project":
      return <Project />;

    case "estate":
      return <Estate />;

    case "team":
      return <Team />;

    case "testimony":
      return <Testimony />;

    case "tag":
      return <Tag />;

    case "category":
      return <Category />;

    case "comment":
      return <Comment />;

    case "partner":
      return <Partner />;

    case "notification":
      return <Notification />;

    case "url":
      return <Url />;

    default:
      return <UploadMedia />;
  }
}

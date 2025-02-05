(function ($) {
  "use strict";

  $(document).ready(function () {
    const path = "../assets/js/data.json";

    $.getJSON(path, function (data) {
      const url = data.BackendURL;

      let blog = [];
      const blogsPerPage = 5;
      let currentPage = 1;

      const searchInput = $("#search_input");
      const searchBlogs = $("#searchBlogs");

      searchInput.on("input", function () {
        const searchValue = $(this).val().toLowerCase();
        const filteredBlogs = blog.filter((b) =>
          b.title.toLowerCase().includes(searchValue)
        );
        renderBlogs(filteredBlogs);
      });

      searchBlogs.on("submit", function (e) {
        e.preventDefault();
        const searchValue = searchInput.val().toLowerCase();
        const filteredBlogs = blog.filter((b) =>
          b.title.toLowerCase().includes(searchValue)
        );
        renderBlogs(filteredBlogs);
      });

      function fetchBlogs() {
        $.ajax({
          url: `${url}/blogs`,
          method: "GET",
          success: function (response) {
            blog = response;
            renderBlogsPaginated();
            populateTags();
          },
          error: function (xhr, status, error) {
            console.error("Error fetching blogs:", error);
          },
        });
      }

      function fetchCategories() {
        $.ajax({
          url: `${url}/categories`,
          method: "GET",
          success: function (response) {
            const categoryDisplay = $("#category_display");

            categoryDisplay.empty();
            response.forEach((category) => {
              const categoryHTML = `<li><a href="#" class="category" data-category="${category.id}">${category.name}</a></li>`;
              categoryDisplay.append(categoryHTML);
            });

            categoryDisplay.on("click", ".category", function (e) {
              e.preventDefault();
              const categoryId = $(this).data("category");
              const categorizedBlogs = blog.filter((b) =>
                b.Categories.some((c) => c.id === categoryId)
              );
              renderBlogs(categorizedBlogs);
            });
          },
          error: function (xhr, status, error) {
            console.error("Error fetching categories:", error);
          },
        });
      }

      function renderBlogsPaginated() {
        const start = (currentPage - 1) * blogsPerPage;
        const paginatedBlogs = blog.slice(start, start + blogsPerPage);
        renderBlogs(paginatedBlogs);
        renderPagination();
      }

      function renderBlogs(blogs) {
        const blogDisplay = $("#blog_display");
        blogDisplay.empty();

        blogs.forEach((blog) => {
          const createdAt = new Date(blog.createdAt);
          const blogDate = `${createdAt.toLocaleString("en-US", {
            month: "long",
          })} ${createdAt.getFullYear()} ${createdAt.getDate()}`;

          const blogHTML = `
            <div class="blog-1-block mb_40 wow fadeInLeft" data-wow-delay=".2s" data-wow-duration=".8s">
              <div class="blog-1-image hvr-img-zoom-1">
                <img src="${url + "/" + blog.show}" alt="${blog.title}">
              </div>
              <div class="blog-1-lower-content-alt2 p_relative">
                <div class="d-flex mb_15">
                  <p class="fs_22 fw_bold c_primary mr_40">${blogDate}</p>
                  <p class="blog-1-post-meta">
                    By : ${
                      blog.user.name
                    } <span class="ml_5 mr_5">/</span> Comments ${
            blog.Comments.length || 0
          }
                  </p>
                </div>
                <h4 class="blog-1-title mb_15 fs_34 lh_35">
                  <a href="blog-details.html?id=${blog.id}">${blog.title}</a>
                </h4>
                <p>${blog.description.substring(0, 300)} ...</p>
                <div class="">
                  <a class="ff_sec fw_bold tt_u fs_14 ls_1 c_primary pr_30 p_relative z_1 td_underline" href="blog-details.html?id=${
                    blog.id
                  }">continue reading</a>
                </div>
              </div>
            </div>
          `;
          blogDisplay.append(blogHTML);
        });
      }

      function renderPagination() {
        const totalPages = Math.ceil(blog.length / blogsPerPage);
        const paginationDisplay = $("#pagination_display");
        paginationDisplay.empty();

        for (let i = 1; i <= totalPages; i++) {
          const activeClass = i === currentPage ? "active" : "";
          const pageHTML = `<li class="page-item ${activeClass}"><a href="#" class="page-link" data-page="${i}">${i}</a></li>`;
          paginationDisplay.append(pageHTML);
        }

        paginationDisplay.on("click", ".page-link", function (e) {
          e.preventDefault();
          currentPage = parseInt($(this).data("page"));
          renderBlogsPaginated();
        });
      }

      function populateTags() {
        const allTags = Array.from(
          new Set(blog.flatMap((b) => b.Tags.map((tag) => tag.name)))
        );
        const tagDisplay = $("#tag_display");

        allTags.forEach((tag) => {
          const tagHTML = `<a href="#" class="tag" data-tag="${tag}">${tag}</a>`;
          tagDisplay.append(tagHTML);
        });

        tagDisplay.on("click", ".tag", function (e) {
          e.preventDefault();
          const selectedTag = $(this).data("tag");
          const taggedBlogs = blog.filter((b) =>
            b.Tags.some((t) => t.name === selectedTag)
          );
          renderBlogs(taggedBlogs);
        });
      }

      fetchBlogs();
      fetchCategories();

      $.ajax({
        url: `${url}/projects`,
        method: "GET",
        success: function (response) {
          // Sort by updatedAt descending and get the latest 5

          console.log(response);
          const sortedProjects = response
            .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
            .slice(0, 5);

          // Generate HTML for each project and append it to #project_display
          const projectDisplay = $("#project_display");

          sortedProjects.forEach((project) => {
            const createdAt = new Date(project.createdAt);
            const projectDate = ` ${createdAt.getDate()} ${createdAt.toLocaleString(
              "en-US",
              {
                month: "long",
              }
            )} ${createdAt.getFullYear()}`;
            const projectHTML = `
             <article class="post">
                    <figure class="post-thumb">
                      <a href="project-details.html?id=${project.id}"
                        ><img
                          src="${url + "/" + project.show}"
                          alt=""
                          style="width:150px; height:80px;"
                      /></a>
                    </figure>
                    <div class="text">
                      <a href="project-details.html?id=${project.id}"
                        >${project.plot}</a
                      >
                    </div>
                    <div class="post-info">${projectDate}</div>
                  </article>
            `;
            projectDisplay.append(projectHTML);
          });
        },
        error: function (xhr, status, error) {
          console.error("Error fetching projects:", error);
        },
      });
    });
  });
})(window.jQuery);

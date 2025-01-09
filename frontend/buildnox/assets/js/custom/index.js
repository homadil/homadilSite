(function ($) {
  "use strict";

  $(document).ready(function () {
    const path = "assets/js/data.json";

    $.getJSON(path, function (data) {
      const url = data.BackendURL;

      // Fetch projects from the backend
      $.ajax({
        url: `${url}/projects`,
        method: "GET",
        success: function (response) {
          // Sort by updatedAt descending and get the latest 5
          const sortedProjects = response
            .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
            .slice(0, 5);

          // Generate HTML for each project and append it to #project_display
          const projectDisplay = $("#project_display");
          // clear prev children
          projectDisplay.empty();

          sortedProjects.forEach((project) => {
            const projectHTML = `
              <div class="swiper-slide" >
                <div
                  class="project-1-column wow fadeInUp"
                  data-wow-delay=".2s"
                  data-wow-duration="1.5s"
                >
                  <div class="project-1-block">
                    <div class="project-1-image">
                      <img src="${url}/${
              project.show
            }" style="width:100%; height:350px;"  alt="${project.title}" />
                      <div class="project-1-overlay">
                        <a
                          href="${url}/${project.show}"
                          class="project-1-icon"
                          data-fancybox="project-1"
                          ><i class="flaticon-zoom"></i
                        ></a>
                        <a href="project-details.html?id=${project.id}"
                          ><i class="flaticon-link"></i
                        ></a>
                      </div>
                      <div class="project-1-content">
                        <p class="project-1-cat">${project.title}</p>
                        <h4 class="project-1-title">${project.description.substring(
                          0,
                          20
                        )}...</h4>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            `;
            projectDisplay.append(projectHTML);
          });
        },
        error: function (xhr, status, error) {
          console.error("Error fetching projects:", error);
        },
      });

      $.ajax({
        url: `${url}/blogs`,
        method: "GET",
        success: function (response) {
          // Sort by updatedAt descending and get the latest 5
          const sortedBlogs = response
            .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
            .slice(0, 3);

          const blogDisplay = $("#blog_display");

          // Clear previous children
          blogDisplay.empty();

          sortedBlogs.forEach((blog) => {
            // Extract blog date in the format: "Month Year Day"
            const createdAt = new Date(blog.createdAt);
            const blogDate = `${createdAt.toLocaleString("en-US", {
              month: "long",
            })} ${createdAt.getFullYear()} ${createdAt.getDate()}`;

            // Create the HTML for each blog
            const blogHTML = `
        <div class="col-lg-4 col-md-6">
          <div
            class="blog-1-block wow fadeInLeft"
            data-wow-delay=".2s"
            data-wow-duration=".8s"
          >
            <div class="blog-1-image hvr-img-zoom-1">
              <img src="${url}/${blog.show}" alt="${blog.title}" />
            </div>
            <div class="blog-1-lower-content p_relative">
              <div
                class="blog-1-date fs_20 fw_medium w_80 h_80 theme-bg p_absolute r_25 t_0 text-center text-light pt_15 b_radius_50 lh_25"
              >
                <span class="fs_25 fw_bold">${createdAt.getDate()}</span><br />
                ${createdAt.toLocaleString("en-US", { month: "short" })}
              </div>
              <p class="blog-1-post-meta fs_17 fw_medium">
                Admin <span class="ml_5 mr_5">/</span> Comments ${
                  blog.Comments.length
                }
              </p>
              <h4 class="blog-1-title mb_30 fs_22 lh_35">
                <a href="blog-details.html?id=${blog.id}">${blog.title}</a>
              </h4>
              <div class="blog-1-read-more">
                <a
                  class="ff_sec fw_bold tt_u fs_14 ls_1 c_primary pl_30 pr_30 p_relative z_1"
                  href="blog-details.html?id=${blog.id}"
                  >continue reading</a
                >
              </div>
            </div>
          </div>
        </div>
      `;

            // Append the blog HTML to the display
            blogDisplay.append(blogHTML);
          });
        },
        error: function (xhr, status, error) {
          console.error("Error fetching blogs:", error);
        },
      });

      const footer_form = $("#footer_form");

      const footer_btn = $("#footer_btn");

      footer_form.on("submit", (e) => {
        e.preventDefault();
        const footer_email = $("#footer_email").val();

        // Disable the button and change text
        footer_btn.prop("disabled", true);

        $.ajax({
          url: `${url}/extra/newsletter`,
          method: "POST",
          data: JSON.stringify({ email: footer_email }),
          contentType: "application/json", // Set content type for JSON
          success: function (response) {
            alert(response.msg);
            form[0].reset(); // Reset the form
          },
          error: function (xhr, status, error) {
            console.log(error);
            alert(error.message || error.msg || error);
          },
          complete: function () {
            // Re-enable the button and reset text
            footer_btn.text("Submit now").prop("disabled", false);
          },
        });
      });

      //end
    });
  });
})(window.jQuery);

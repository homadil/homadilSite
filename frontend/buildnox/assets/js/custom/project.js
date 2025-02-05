(function ($) {
  "use strict";

  $(document).ready(function () {
    const path = "../assets/js/data.json";

    $.getJSON(path, function (data) {
      const url = data.BackendURL;

      // Fetch projects from the backend
      $.ajax({
        url: `${url}/estates`,
        method: "GET",
        success: function (response) {
          // Sort by updatedAt descending
          const sortedProjects = response.sort(
            (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
          );

          // Select the project display container
          const projectDisplay = $("#project_display");

          // Clear previous children
          projectDisplay.empty();

          // Generate HTML for each project
          sortedProjects.forEach((project) => {
            // Dynamically generate class list for categories
            const categoryClasses = project.Categories.map(
              (cat) => `cat-${cat.id}`
            ).join(" ");

            const projectHTML = `
              <div class="masonry-item all ${categoryClasses} col-lg-4 col-md-6">
                <div class="project-1-block alt">
                  <div class="project-1-image">
                    <img
                      src="${url + "/" + project.show}"
                      alt="${project.name}"
             
                      style="height:375px !important;"
                    />
                    <div class="project-1-overlay">
                      <a
                        href="${url + "/" + project.show}"
                        class="project-1-icon"
                        data-fancybox="project-1"
                      ><i class="flaticon-zoom"></i></a>
                      <a href="estate-details.html?id=${project.id}"
                      ><i class="flaticon-link"></i></a>
                    </div>
                    <div class="project-1-content">
                      <p class="project-1-cat">${project.description.substring(
                        0,
                        100
                      )} ....</p>
                      <h4 class="project-1-title">${project.name}</h4>
                    </div>
                  </div>
                </div>
              </div>
            `;
            // Append each project's HTML to the display container
            projectDisplay.append(projectHTML);
          });
        },
        error: function (err) {
          console.error("Error fetching projects:", err);
          $("#project_display").html(
            "<p>Failed to load projects. Please try again later.</p>"
          );
        },
      });

      // Fetch categories from the backend
      $.ajax({
        url: `${url}/categories`,
        method: "GET",
        success: function (response) {
          console.log(response);

          // Select #category_display container
          const categoryDisplay = $("#category_display");
          // Generate HTML for each category
          response.forEach((category) => {
            const categoryHTML = `
              <li class="filter" data-role="button" data-filter=".cat-${category.id}">
                ${category.name}
              </li>
            `;

            // Append the generated HTML to the container
            categoryDisplay.append(categoryHTML);
          });
        },
        error: function (xhr, status, error) {
          console.error("Error fetching categories:", error);
        },
      });
    });
  });
})(window.jQuery);

(function ($) {
  "use strict";

  $(document).ready(function () {
    let general_faq = null;
    let general = null;

    // Get the ID from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get("id"); // Extracts the "id" parameter

    const show_display = $("#show_display");
    const show_description = $("#show_description");

    // Wait for both AJAX calls to complete
    $.when(
      $.getJSON("../assets/js/json/faq.json", function (data) {
        general_faq = data;
      }),
      $.getJSON("../assets/js/data.json", function (data) {
        general = data;
      })
    ).then(function () {
      // Both AJAX calls have completed, handle the data
      const url = general.BackendURL;
      $.ajax({
        url: `${url}/projects/${id}`,
        method: "GET",
        success: function (response) {
          // Set the estate title
          console.log(response);
          const formatDate = (date) => {
            const options = { year: "numeric", month: "long", day: "numeric" };
            return new Date(date).toLocaleDateString("en-US", options);
          };

          const button_html = `
  <a
    style="background-color: #a76a67; color: white; font-size: 1.5rem; margin-top: 10px; margin-bottom: 10px;"
    href="offer-letter.html?id=${response?.id}"
    class="btn btn_primary"
  >
    Purchase Plot: ${response.plot}
  </a>
`;

          $("#downloan_btn").html(button_html);

          $("#project_plot").text(`Plot: ${response.plot}`);
          $("#project_room_count").text(`Room Count: ${response.room_count}`);
          $("#project_budget").text(`Price: ${response.budget}`);
          $("#project_client").text(`Client: ${response.client}`);
          $("#project_director").text(`Director: ${response.director}`);

          $("#project_status").text(`Status: ${response.status}`);
          $("#project_sold").text(
            `Sold: ${response.sold ? "Purchased" : "Available"}`
          );
          $("#project_start_date").text(
            `Start Date: ${formatDate(response.start_date)}`
          );
          $("#project_end_date").text(
            `End Date: ${formatDate(response.end_date)}`
          );
          //location

          $("#project_country").text(`Country: ${response?.location?.country}`);
          $("#project_state").text(`State: ${response?.location?.state}`);
          $("#project_city").text(`City: ${response?.location?.city}`);
          $("#project_address").text(`Address: ${response?.location?.address}`);

          //category
          const categoryArray = response?.Categories;
          $("#project_categories").text(``);
          const categoryList = categoryArray
            .map((item) => `<li>${item.name}</li>`)
            .join("");

          $("#project_categories").html(`<ul>${categoryList}</ul>`);

          //tag
          const tagArray = response?.Tags;
          $("#project_tag").text(``);
          const tagList = tagArray
            .map((item) => `<li>${item.name}</li>`)
            .join("");

          $("#project_tags").html(`<ul>${tagList}</ul>`);

          const showMedia = [response.show];
          const additionalMedia = response.Media
            ? response.Media.map((media) => media.url)
            : [];

          const allMedia = [...showMedia, ...additionalMedia];

          initImageViewer(allMedia);

          $(".estate_title").each(function () {
            $(this).text("plot " + response.plot);
          });

          // Check if 'response.show' is valid before setting the image source
          if (response.show) {
            show_display.prop("src", `${url}/${response.show}`);
            show_display.prop("style", `height:300px;`);
          } else {
            show_display.prop("src", "../assets/default-image.png"); // Fallback to a default image
          }

          show_description.text(response.description);

          $("#quote_display").text(response.quote);

          $("#content").html(response.content);

          // Display projects dynamically
          const projectContainer = $("#projectContainer"); // Assuming this is where you want to append the projects
          projectContainer.empty(); // Clear any existing content

          const media = response.Media;

          // Loop through media and dynamically generate HTML
          media.forEach((item, index) => {
            const colClass =
              index % 6 === 0 || (index + 1) % 6 === 0
                ? "col-md-12"
                : "col-md-6";
            const mediaHTML = `
              <div class="${colClass}">
                <div class="mb_30">
                  <img src="${url}/${item.path}" alt="" />
                </div>
              </div>
            `;
            projectContainer.append(mediaHTML);
          });
        },
        error: function (xhr, status, error) {
          console.error("Error fetching teams:", error);
          window.location.href = "../404.html";
        },
      });

      function initImageViewer(images) {
        const imageViewer = document.getElementById("imageViewer");

        // Clear existing images
        imageViewer.innerHTML = "";

        // Append new images dynamically
        images.forEach((image) => {
          const imgElement = document.createElement("a");
          imgElement.href = url + "/" + image;
          imgElement.className = "gallery-item";
          imgElement.innerHTML = `<img src="${
            url + "/" + image
          }" alt="Project Image" style="width: 100px; height: 100px; margin: 5px;">`;
          imageViewer.appendChild(imgElement);
        });

        // Initialize lightGallery
        lightGallery(imageViewer, {
          thumbnail: true,
          animateThumb: true,
          showThumbByDefault: true,
          mode: "lg-fade",
          zoom: true,
        });
      }
    });
  });
})(jQuery);

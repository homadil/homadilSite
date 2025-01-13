console.log(typeof $.fn.lightGallery);

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
        url: `${url}/estates/${id}`,
        method: "GET",
        success: function (response) {
          console.log(response);

          const estateMedia = [response.show];
          const projectMedia = response.projects.map((project) => project.show);
          const additionalMedia = response.Media
            ? response.Media.map((media) => media.url)
            : [];

          const allMedia = [
            ...estateMedia,
            ...projectMedia,
            ...additionalMedia,
          ];

          initImageViewer(allMedia);

          $("#estate_area").text(`Area: ${response.area}`);
          $("#estate_director").text(`Director: ${response.director}`);
          $("#estate_estimate").text(`Estimate: ${response.estimate}`);
          $("#estate_number_of_units").text(
            `Number of units: ${response.number_of_units}`
          );
          $("#estate_price_range").text(`Price Range: ${response.price_range}`);
          $("#estate_status").text(`Status: ${response.status}`);

          //amenities
          const amenitiesArray = response?.amenities
            .split(",")
            .map((item) => item.trim());
          $("#estate_amenities").text(``);

          const amenitiesList = amenitiesArray
            .map((item) => `<li>${item}</li>`)
            .join("");

          $("#estate_amenities").html(`<ul>${amenitiesList}</ul>`);

          //near by location

          const nearByLocationArray = response?.nearbyLocations
            .split(",")
            .map((item) => item.trim());
          $("#nearByLocation").text(``);

          const nearByLocationList = nearByLocationArray
            .map((item) => `<li>${item}</li>`)
            .join("");

          $("#nearByLocation").html(`<ul>${nearByLocationList}</ul>`);

          // Set the estate title
          $(".estate_title").each(function () {
            $(this).text(response.name);
          });

          // Check if 'response.show' is valid before setting the image source
          if (response.show) {
            show_display.prop("src", `${url}/${response.show}`);
            show_display.prop("style", `height:300px;`);
          } else {
            console.error("Image path not found in response.");
            show_display.prop("src", "../assets/default-image.png"); // Fallback to a default image
          }

          show_description.text(response.description);

          $("#content").html(response.content);

          // Display projects dynamically
          const projectContainer = $("#projectContainer"); // Assuming this is where you want to append the projects
          projectContainer.empty(); // Clear any existing content

          response.projects.forEach((project) => {
            const projectStatus = project.sold
              ? `<p style="color:red;">Sold</p>`
              : `<p style="color:green;">Available</p>`;

            const projectHTML = `
  <div class="col-lg-6" >
    <div class="row">
      <div class="col-md-12">
        <div class="mb_30">
          <img style="height:150px; border-radius:20px;" 
               src="${url}/${project.show}" 
               alt="${project.plot}" />
        </div>
      </div>
      <div class="col-md-12">
        <div class="mb_30">
          <div style="display:flex;  align-items:center;">
            <p style="margin-right:60px;">plot ${project.plot}</p>
            <div>${projectStatus}</div>
          </div>
          <h5>${project.description.substring(0, 20)}...</h5>
          <a href="project-details.html?id=${project.id}" 
             class="btn btn-primary">
            <i class="fas fa-link"></i> View Project
          </a>
        </div>
      </div>
    </div>
  </div>
`;

            projectContainer.append(projectHTML);
          });

          // Add fade-in animation
          $(".mb_30").hide().fadeIn(1000);
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
          }" alt="Estate Image" style="width: 100px; height: 100px; margin: 5px;">`;
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

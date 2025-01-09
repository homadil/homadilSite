(function ($) {
  "use strict";

  $(document).ready(function () {
    const path = "../assets/js/data.json";

    $.getJSON(path, function (data) {
      const url = data.BackendURL;

      // Fetch categories from the backend
      $.ajax({
        url: `${url}/testimonies`,
        method: "GET",
        success: function (response) {
          console.log(response);

          // Select #category_display container
          const testimonyDisplay = $("#testimony_display");
          // Generate HTML for each category
          response.forEach((testimony) => {
            const testimonyHTML = `
             <div class="col-lg-4">
              <div class="testimonials-1-block alt">
                <div class="testimonials-1-top-content">
                  <div class="testimonials-1-quote">
                    <i class="flaticon-quotation"></i>
                  </div>
                  <div class="testimonials-1-desc">
                   ${testimony.comment}
                  </div>
                </div>
                <div class="testimonials-1-author">
                  <div class="testimonials-1-author-image">
                    <img src="${url + "/" + testimony.image}" alt="" />
                  </div>
                  <div class="testimonials-1-author-title alt">${
                    testimony.name
                  }</div>
                  <div class="testimonials-1-designation">${
                    testimony.position
                  }</div>
                </div>
              </div>
            </div>
            `;

            // Append the generated HTML to the container
            testimonyDisplay.append(testimonyHTML);
          });
        },
        error: function (xhr, status, error) {
          console.error("Error fetching categories:", error);
        },
      });
    });
  });
})(window.jQuery);

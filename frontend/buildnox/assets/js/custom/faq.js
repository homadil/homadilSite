(function ($) {
  "use strict";

  $(document).ready(function () {
    let general_faq = null;
    let general = null;
    const form = $("#form");
    const submitButton = $("#btn");
    const first_faq_display = $("#first_faq_display");
    const second_faq_display = $("#second_faq_display");

    // Wait for both AJAX calls to complete
    $.when(
      $.getJSON("../assets/js/json/faq.json", function (data) {
        general_faq = data;
      }),
      $.getJSON("../assets/js/data.json", function (data) {
        general = data;
      })
    ).then(function () {
      // This code runs after both general_faq and general have been retrieved

      // Generate HTML for each category
      general_faq.first.forEach((faq, index) => {
        const first_faq_displayHTML = `
                <li class="accordion block ${
                  parseInt(index) === 0 ? "active-block" : ""
                }">
                    <div class="acc-btn c_dark ff_sec fs_22 fw_bold">
                      <div class="icon-outer">
                        <span class="icon icon-plus fa fa-plus"></span>
                        <span class="icon icon-minus fa fa-minus"></span>
                      </div>
                    ${faq.question}
                    </div>
                    <div class="acc-content">
                      <div class="content">
                        <p class="fs_18">
                          ${faq.answer}
                        </p>
                      </div>
                    </div>
                  </li>
              `;
        // Append the generated HTML to the container
        first_faq_display.append(first_faq_displayHTML);
      });

      general_faq.second.forEach((faq, index) => {
        const second_faq_HTML = `
               <li class="accordion block ${
                 parseInt(index) === 0 ? "active-block" : ""
               }">
                    <div class="acc-btn c_dark ff_sec fs_22 fw_bold">
                      <div class="icon-outer">
                        <span class="icon icon-plus fa fa-plus"></span>
                        <span class="icon icon-minus fa fa-minus"></span>
                      </div>
                    ${faq.question}
                    </div>
                    <div class="acc-content">
                      <div class="content">
                        <p class="fs_18">
                          ${faq.answer}
                        </p>
                      </div>
                    </div>
                  </li>
              `;
        // Append the generated HTML to the container
        second_faq_display.append(second_faq_HTML);
      });

      console.log("HTML generation completed!");
    });

    // On form submission
    form.on("submit", function (event) {
      event.preventDefault(); // Prevent the default form submission behavior

      // Get values from form fields
      const email = $("#email").val();
      const subject = $("#subject").val();
      const question = $("#question").val();

      // Validate form data
      if (!email || !subject || !question) {
        alert("All fields are required!");
        return;
      }

      // Disable the button and change text
      submitButton.text("Loading...").prop("disabled", true);

      // Submit data via AJAX
      const dataToSend = { email, subject, question };

      $.ajax({
        url: `${general.BackendURL}/extra/faq`,
        method: "POST",
        data: JSON.stringify(dataToSend),
        contentType: "application/json", // Set content type for JSON
        success: function (response) {
          console.log("Form submitted successfully:", response);
          alert(response.msg);
          form[0].reset(); // Reset the form
        },
        error: function (xhr, status, error) {
          console.error("Error submitting form:", error);
          alert(error.message || error.msg);
        },
        complete: function () {
          // Re-enable the button and reset text
          submitButton.text("Submit now").prop("disabled", false);
        },
      });
    });
  });
})(window.jQuery);

(function ($) {
  "use strict";

  $(document).ready(function () {
    let general = null;
    const form = $("#form");
    const submitButton = $("#btn");

    $.getJSON("../assets/js/data.json", function (data) {
      general = data;
    });

    // On form submission
    form.on("submit", function (event) {
      event.preventDefault(); // Prevent the default form submission behavior

      // Get values from form fields
      const name = $("#name").val();
      const email = $("#email").val();
      const subject = $("#subject").val();
      const question = $("#message").val();

      // Validate form data
      if (!email || !subject || !question || !name) {
        alert("All fields are required!");
        return;
      }

      // Disable the button and change text
      submitButton.text("Loading...").prop("disabled", true);

      // Submit data via AJAX
      const dataToSend = { name, email, subject, question };

      $.ajax({
        url: `${general.BackendURL}/extra/contact`,
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

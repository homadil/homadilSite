(function ($) {
  "use strict";

  $(document).ready(function () {
    const path = "assets/js/data.json";

    $.getJSON(path, function (data) {
      const url = data.BackendURL;

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

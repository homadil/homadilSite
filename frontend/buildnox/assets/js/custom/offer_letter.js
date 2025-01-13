(function ($) {
  "use strict";

  $(document).ready(function () {
    let general = null;

    const form = $("#form");
    const submitButton = $("#btn");

    // Get the ID from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get("id"); // Extracts the "id" parameter

    // Wait for both AJAX calls to complete
    $.when(
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
          $("#plot_display").text(response.plot);

          if (response.sold) {
            $("#name").attr("disabled", true); // input text
            $("#email").attr("disabled", true); // input email
            $("#number").attr("disabled", true); // input tel
            $("#proof").attr("disabled", true); // input file
            $("#message").attr("disabled", true); // textarea
            $("#btn").prop("disabled", true);
            $("#intro_display").text(
              "Plot " + response.plot + " is already taken"
            );

            const back = `
        <a style="cursor:pointer; color:#a76a67;" onclick="window.history.back();">
            Click Me to go Back
        </a>
    `;
            $("#intro_display").append(back);
          }
        },
        error: function (xhr, status, error) {
          console.error("Error fetching teams:", error);
          window.location.href = "../404.html";
        },
        complete: function () {
          // Re-enable the button and reset text
          submitButton.text("Submit now").prop("disabled", false);
        },
      });
    });

    submitButton.on("click", function (event) {
      event.preventDefault(); // Prevent the default form submission behavior
      event.stopImmediatePropagation();

      const newFormData = new FormData();

      // Get values from form fields
      const name = $("#name").val();
      const email = $("#email").val();
      const number = $("#number").val();
      const proof = $("#proof")[0].files[0];
      const message = $("#message").val();

      if (!email || !name || !number || !message || !proof) {
        alert("All fields are required!");
        return;
      }

      newFormData.append("show", proof || "");
      newFormData.append("name", name || "");
      newFormData.append("email", email || "");
      newFormData.append("number", number || "");
      newFormData.append("message", message || "");

      submitButton.text("Loading...").prop("disabled", true);

      $.ajax({
        url: `${general.BackendURL}/extra/offer_letter`,
        method: "POST",
        data: newFormData,
        processData: false,
        contentType: false,
        success: function (response) {
          console.log("Form submitted successfully:", response);
          alert(response.msg);
          form[0].reset(); // Reset the form
        },
        error: function (xhr, status, error) {
          console.error("Error submitting form:", error);
          alert(error.message || error.msg || "Bad Request");
        },
        complete: function () {
          // Re-enable the button and reset text
          submitButton.text("Submit now").prop("disabled", false);
        },
      });
    });
  });
})(jQuery);

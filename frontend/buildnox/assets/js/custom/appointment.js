(function ($) {
  "use strict";

  $(document).ready(function () {
    let general = null;
    const form = $("#form");
    const submitButton = $("#btn");
    const othersDisplay = $("#others_display");
    const others = $("#other");

    // Fetch data from JSON
    $.getJSON("../assets/js/data.json", function (data) {
      general = data;
    });

    // Listen for changes on the checkbox
    others.on("change", function () {
      if (others.is(":checked")) {
        othersDisplay.show(); // Display the field if checkbox is checked
      } else {
        othersDisplay.hide(); // Hide the field if checkbox is unchecked
      }
    });

    // Initial check to ensure the correct state on page load
    if (others.is(":checked")) {
      othersDisplay.show();
    } else {
      othersDisplay.hide();
    }

    // On form submission
    form.on("submit", function (event) {
      event.preventDefault(); // Prevent the default form submission behavior

      // Get values from form fields

      //type
      const home_1 = $("#home-1").is(":checked");
      const your_business = $("#your-business").is(":checked");

      //appointment date and time
      const dobday = parseInt($("#dobday").val(), 10);
      const dobmonth = parseInt($("#dobmonth").val(), 10) - 1; // Month is 0-indexed
      const dobyear = parseInt($("#dobyear").val(), 10);
      const timepicker = $("#timepicker").val();

      const name = $("#f_name").val().trim();
      const email = $("#f_email").val().trim();
      const jobsite_address = $("#f_jobsite_address").val().trim();
      const city = $("#f_city").val().trim();
      const selectpicker = $("#selectpicker").val();
      const f_company = $("#f_company").val();
      const f_zipcode = $("#f_zipcode").val();
      const phn_number = $("#f_phn_number").val().trim();

      //services
      const plumbing = $("#plumbing").is(":checked");
      const drain_cleaning = $("#drain-cleaning").is(":checked");
      const heating_cooling = $("#heating-cooling").is(":checked");
      const water_gas = $("#water-gas").is(":checked");
      const sewer_cleaning = $("#sewer-cleaning").is(":checked");

      //service ends
      const other_message = $("#f_other_message").val();
      const brief_description = $("#f_brief_description").val();
      const newsletter = $("#newsletter").is(":checked");

      // Validate required fields
      if (!name) {
        alert("Name is required!");
        return;
      }
      if (!email) {
        alert("Email is required!");
        return;
      }
      if (!jobsite_address) {
        alert("Jobsite address is required!");
        return;
      }
      if (!city) {
        alert("City is required!");
        return;
      }
      if (!phn_number) {
        alert("Phone number is required!");
        return;
      }
      if (
        isNaN(dobday) ||
        isNaN(dobmonth) ||
        isNaN(dobyear) ||
        dobday <= 0 ||
        dobmonth < 0 ||
        dobyear <= 0
      ) {
        alert("Date of appointment is required!");
        return;
      }

      // Validate date (ensure it's not in the past)
      const selectedDate = new Date(dobyear, dobmonth, dobday);
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Remove time portion for accurate comparison

      if (selectedDate < today) {
        alert("The selected date cannot be in the past!");
        return;
      }

      if (!timepicker) {
        alert("Appointment time is required!");
        return;
      }

      // Disable the button and change text
      submitButton.text("Loading...").prop("disabled", true);

      const otherMessageArray = other_message
        .split(",") // Split the string by commas
        .map((item) => item.trim()) // Trim spaces around each item
        .filter((item) => item); // Remove empty strings (in case of trailing commas)

      // Prepare data for submission
      const dataToSend = {
        type: [
          home_1 ? "home" : null,
          your_business ? "business" : null,
        ].filter(Boolean),
        email,
        date: selectedDate,
        timepicker,
        name,
        jobsite_address,
        city,
        state: selectpicker,
        company: f_company,
        zipcode: f_zipcode,
        phone_number: phn_number,
        service_type: [
          plumbing ? "plumbing" : null,
          drain_cleaning ? "drain_cleaning" : null,
          heating_cooling ? "heating_cooling" : null,
          water_gas ? "water_gas" : null,
          sewer_cleaning ? "sewer_cleaning" : null,
          ...otherMessageArray,
        ].filter(Boolean),
        brief_description,
        newsletter: newsletter ? true : false,
      };

      // Submit data via AJAX
      $.ajax({
        url: `${general.BackendURL}/extra/appointment`,
        method: "POST",
        data: JSON.stringify(dataToSend),
        contentType: "application/json", // Set content type for JSON
        success: function (response) {
          console.log("Form submitted successfully:", response);
          alert(response.msg);
          form[0].reset(); // Reset the form
        },
        error: function (xhr, status, error) {
          console.error(error);
          alert(error.message || error.msg || "An error occurred.");
        },
        complete: function () {
          // Re-enable the button and reset text
          submitButton.text("Request for Appointment").prop("disabled", false);
        },
      });
    });
  });
})(window.jQuery);

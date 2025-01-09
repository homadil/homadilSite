jQuery.extend({
  dobPicker: function (params) {
    // apply defaults
    if (typeof params.dayDefault == "undefined") {
      params.dayDefault = "Day";
    }
    if (typeof params.monthDefault == "undefined") {
      params.monthDefault = "Month";
    }
    if (typeof params.yearDefault == "undefined") {
      params.yearDefault = "Year";
    }
    if (typeof params.minimumAge == "undefined") {
      params.minimumAge = 18;
    }
    if (typeof params.maximumAge == "undefined") {
      params.maximumAge = 100;
    }

    // find elements
    var dayElement = $(params.daySelector);
    var monthElement = $(params.monthSelector);
    var yearElement = $(params.yearSelector);

    // set days
    dayElement.append('<option value="">' + params.dayDefault + "</option>");
    for (var i = 1; i <= 31; i++) {
      var day = "" + i;
      var value = i > 9 ? "" + i : "0" + i;
      dayElement.append('<option value="' + value + '">' + day + "</option>");
    }

    // set months
    var months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    monthElement.append(
      '<option value="">' + params.monthDefault + "</option>"
    );
    for (var i = 1; i <= 12; i++) {
      var month = months[i - 1];
      var value = i > 9 ? "" + i : "0" + i;
      monthElement.append(
        '<option value="' + value + '">' + month + "</option>"
      );
    }

    // Set years
    yearElement.append('<option value="">' + params.yearDefault + "</option>");
    var currentYear = new Date().getFullYear();
    var endYear = currentYear + 5; // 5 years ahead
    for (var i = currentYear; i <= endYear; i++) {
      var year = "" + i;
      yearElement.append('<option value="' + year + '">' + year + "</option>");
    }
  },
});

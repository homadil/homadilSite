(function ($) {
  "use strict";

  $(document).ready(function () {
    const path = "../assets/js/data.json";

    $.getJSON(path, function (data) {
      const url = data.BackendURL;

      // Fetch teams from the backend
      $.ajax({
        url: `${url}/teams`,
        method: "GET",
        success: function (response) {
          // Shuffle the response array and select 4 items randomly
          const shuffledTeams = response.sort(() => 0.5 - Math.random());

          // Select #team_display container
          const teamDisplay = $("#team_display");

          // Clear previous children
          teamDisplay.empty();

          // Generate HTML for each team member
          shuffledTeams.forEach((team) => {
            // Dynamically generate social media links/icons/images
            const socialIcons = team.Urls.map((urlItem) => {
              if (urlItem.image) {
                // Use the image if present
                return `
                  <li>
                    <a href="${urlItem.link}" target="_blank" rel="noopener noreferrer">
                      <img src="${url}/${urlItem.image}" alt="${urlItem.name}" style="width: 24px; height: 24px;" />
                    </a>
                  </li>`;
              } else {
                // Use the Font Awesome icon if no image is provided
                return `
                  <li>
                    <a href="${urlItem.link}" target="_blank" rel="noopener noreferrer">
                      <i class="fab ${urlItem.icon}"></i>
                    </a>
                  </li>  `;
              }
            }).join("");

            // Build HTML for the team member
            const teamHTML = `
              <div class="col-lg-3 col-md-6">
                <div
                  class="team-1-block wow fadeInUp"
                  data-wow-delay=".2s"
                  data-wow-duration="1.5s"
                >
                  <div class="team-1-image">
                    <div class="team-1-image-wrap">
                      <img src="${url}/${team.image}" alt="${team.name}" />
                    </div>
                    <div class="team-1-share-icon-area">
                      <ul class="team-1-social-icon">
                        ${socialIcons}
                      </ul>
                      <div class="team-1-share-icon">
                        <i class="flaticon-share"></i>
                      </div>
                    </div>
                  </div>
                  <div class="team-1-author-info">
                    <h4 class="fs_21 c_light">${team.name}</h4>
                    <p class="fs_13 ff_sec c_light mb_0 tt_u">${team.position}</p>
                  </div>
                </div>
              </div>
            `;

            // Append to the display container
            teamDisplay.append(teamHTML);
          });
        },
        error: function (xhr, status, error) {
          console.error("Error fetching teams:", error);
        },
      });
    });
  });
})(window.jQuery);

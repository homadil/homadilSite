(function ($) {
  "use strict";

  $(document).ready(function () {
    let general_faq = null;
    let general = null;

    // Get the ID from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get("id"); // Extracts the "id" parameter

    $(".service_display").each(function () {
      const formattedText = id
        .replace(/_/g, " ") // Replace underscores with spaces
        .replace(/\b\w/g, (char) => char.toUpperCase()); // Capitalize first letter of each word
      $(this).text(formattedText);
    });

    $.when(
      $.getJSON("../assets/js/json/faq.json", function (data) {
        general_faq = data;
      }),
      $.getJSON("../assets/js/data.json", function (data) {
        general = data;
      })
    ).then(function () {
      const datas = {
        architecture_design: {
          show: "../assets/images/service/architecture_design/show.jpg",
          content_one:
            "Our architectural design services blend creativity with functionality, ensuring that every structure is aesthetically pleasing and highly practical. We employ cutting-edge design principles, 3D modeling, and sustainable practices to craft homes, offices, and commercial buildings that meet modern standards. From conceptualization to blueprint development, we work closely with clients to bring their vision to life, ensuring durability, efficiency, and innovation in every design.",
          type_of_service: [
            "Residential & Commercial Architecture",
            "3D Modeling & Rendering",
            "Sustainable & Green Design",
            "Space Optimization",
            "Structural Analysis",
          ],
          medias: [
            "../assets/images/service/architecture_design/one.jpg",
            "../assets/images/service/architecture_design/two.webp",
            "../assets/images/service/architecture_design/three.webp",
          ],
          benefit: [
            "Visually stunning and functional designs",
            "Optimized space usage for better efficiency",
            "Sustainable and eco-friendly solutions",
            "Increased property value with innovative designs",
            "Enhanced structural integrity and longevity",
          ],
        },
        building_construction: {
          show: "../assets/images/service/building_construction/show.jpg",
          content_one:
            "We provide full-scale building construction services, from foundation to finishing. Our expert team ensures that each project meets the highest quality standards, using durable materials and advanced construction techniques. Whether it's residential, commercial, or industrial projects, we deliver structures that are built to last, offering both strength and style. Our process includes project planning, material sourcing, and on-time execution, guaranteeing customer satisfaction at every stage.",
          type_of_service: [
            "Residential & Commercial Construction",
            "Structural Engineering",
            "Project Management",
            "Material Procurement",
            "Sustainable Construction Practices",
          ],
          medias: [
            "../assets/images/service/building_construction/one.webp",
            "../assets/images/service/building_construction/two.webp",
            "../assets/images/service/building_construction/three.webp",
          ],
          benefit: [
            "Strong, durable, and high-quality structures",
            "Timely project completion with expert supervision",
            "Use of modern, sustainable materials",
            "Increased safety and compliance with building regulations",
            "Cost-effective construction solutions",
          ],
        },
        building_renovation: {
          show: "../assets/images/service/building_renovation/show.png",
          content_one:
            "Revitalizing spaces is our specialty. Whether you need to upgrade an outdated building, improve functionality, or enhance aesthetic appeal, our renovation services bring new life to any property. We focus on quality craftsmanship, modern designs, and cost-effective solutions, ensuring that your renovated space reflects both contemporary trends and long-lasting value. From minor updates to major overhauls, we execute projects with precision and efficiency.",
          type_of_service: [
            "Interior & Exterior Remodeling",
            "Structural Upgrades",
            "Modernization of Facilities",
            "Space Reconfiguration",
            "Energy-Efficient Renovations",
          ],
          medias: [
            "../assets/images/service/building_renovation/one.png",
            "../assets/images/service/building_renovation/two.png",
            "../assets/images/service/building_renovation/three.webp",
          ],
          benefit: [
            "Enhanced property value and appeal",
            "Modern and stylish upgrades",
            "Improved energy efficiency and sustainability",
            "Increased comfort and functionality",
            "Quick and cost-effective solutions",
          ],
        },
        flooring_roofing: {
          show: "../assets/images/service/flooring_roofing/show.webp",
          content_one:
            "Strong foundations start from the ground up, and a reliable roof ensures lasting protection. Our flooring and roofing services focus on durability, style, and safety. Whether it's installing hardwood floors, tiles, or reinforced roofing materials, we use premium materials and expert craftsmanship to deliver long-lasting solutions. We cater to residential, commercial, and industrial spaces, providing customized options that suit individual needs and budgets.",
          type_of_service: [
            "Hardwood, Tile, and Concrete Flooring",
            "Roof Installation & Repairs",
            "Waterproofing & Insulation",
            "Customized Roofing Designs",
            "Eco-Friendly Roofing Solutions",
          ],
          medias: [
            "../assets/images/service/flooring_roofing/one.jpg",
            "../assets/images/service/flooring_roofing/two.jpg",
            "../assets/images/service/flooring_roofing/three.jpg",
          ],
          benefit: [
            "Enhanced durability and longevity",
            "Aesthetic appeal with various design options",
            "Weather-resistant roofing for maximum protection",
            "Improved insulation for energy efficiency",
            "Cost-effective and sustainable solutions",
          ],
        },
        interior_design: {
          show: "../assets/images/service/interior_design/show.webp",
          content_one:
            "Transforming spaces into luxurious and functional areas is our passion. Our interior design services create aesthetically pleasing and highly efficient environments tailored to personal and professional needs. We incorporate modern trends, ergonomic layouts, and sustainable materials to craft interiors that maximize comfort and productivity. Whether for homes, offices, or commercial spaces, we ensure a seamless blend of beauty and practicality.",
          type_of_service: [
            "Space Planning & Layout",
            "Furniture & Decor Selection",
            "Lighting & Color Consultation",
            "Smart Home & Automation Integration",
            "Luxury & Minimalist Interior Solutions",
          ],
          medias: [
            "../assets/images/service/interior_design/one.jpg",
            "../assets/images/service/interior_design/two.jpg",
            "../assets/images/service/interior_design/three.jpg",
          ],
          benefit: [
            "Visually stunning and highly functional spaces",
            "Personalized designs tailored to your needs",
            "Enhanced comfort and productivity",
            "Use of high-quality, sustainable materials",
            "Smart home integration for convenience",
          ],
        },
        repair_expand: {
          show: "../assets/images/service/repair_expand/show.webp",
          content_one:
            "Whether it’s minor repairs or major expansions, we offer comprehensive solutions to enhance the functionality and longevity of your property. Our expert team ensures high-quality repairs, structural reinforcements, and seamless expansion projects tailored to your requirements. We focus on using durable materials, efficient planning, and minimal disruption to your daily operations.",
          type_of_service: [
            "General Repairs & Fixes",
            "Structural Reinforcements",
            "Building Expansion & Additions",
            "Foundation Strengthening",
            "Safety & Compliance Upgrades",
          ],
          medias: [
            "../assets/images/service/repair_expand/one.jpg",
            "../assets/images/service/repair_expand/two.jpg",
            "../assets/images/service/repair_expand/three.jpg",
          ],
          benefit: [
            "Extended lifespan of your property",
            "Enhanced safety and durability",
            "Customized solutions for expansion needs",
            "Minimal disruption with efficient execution",
            "Increased property value and usability",
          ],
        },
        construction_consulting: {
          show: "../assets/images/service/construction_consulting/show.avif",
          content_one:
            "Expert guidance is key to a successful construction project. Our construction consulting services provide professional insights on planning, budgeting, and execution. We help clients make informed decisions, ensuring their projects meet quality, time, and budget expectations. Whether it’s risk assessment, compliance, or innovative solutions, our experts are here to guide you every step of the way.",
          type_of_service: [
            "Project Planning & Feasibility Studies",
            "Cost Estimation & Budgeting",
            "Risk Assessment & Compliance",
            "Quality Control & Supervision",
            "Sustainability & Smart Construction Solutions",
          ],
          medias: [
            "../assets/images/service/construction_consulting/one.avif",
            "../assets/images/service/construction_consulting/two.avif",
            "../assets/images/service/construction_consulting/three.jpg",
          ],
          benefit: [
            "Expert guidance for smooth project execution",
            "Cost-effective and efficient planning",
            "Compliance with industry regulations",
            "Reduced risks and improved project quality",
            "Access to innovative construction techniques",
          ],
        },
        building_maintenance: {
          show: "../assets/images/service/building_maintenance/show.jpg",
          content_one:
            "Regular maintenance ensures the longevity and safety of any property. Our building maintenance services cover everything from plumbing and electrical systems to structural integrity checks. With scheduled inspections and timely repairs, we help clients maintain their properties in top condition, preventing costly damages and ensuring a safe and comfortable environment.",
          type_of_service: [
            "Routine Property Inspections",
            "Electrical & Plumbing Maintenance",
            "Structural Safety Checks",
            "HVAC System Maintenance",
            "Pest Control & Cleaning Services",
          ],
          medias: [
            "../assets/images/service/building_maintenance/one.jpg",
            "../assets/images/service/building_maintenance/two.jpg",
            "../assets/images/service/building_maintenance/three.webp",
          ],
          benefit: [
            "Prolongs the lifespan of the building",
            "Reduces repair costs through preventive care",
            "Enhances safety and efficiency",
            "Ensures compliance with safety standards",
            "Improves overall property value",
          ],
        },
      };
      let data = null;
      switch (id) {
        case "architecture_design":
          data = datas.architecture_design;
          break;
        case "building_construction":
          data = datas.building_construction;
          break;
        case "building_renovation":
          data = datas.building_renovation;
          break;
        case "flooring_roofing":
          data = datas.flooring_roofing;
          break;
        case "interior_design":
          data = datas.interior_design;
          break;
        case "repair_expand":
          data = datas.repair_expand;
          break;
        case "construction_consulting":
          data = datas.construction_consulting;
          break;
        case "building_maintenance":
          data = datas.building_maintenance;
          break;
        default:
          window.location.href = "pages/service.html";
          break;
      }

      $("#content_display").text(data.content_one);

      const service_type = $("#service_type");
      // Append new list items
      data.type_of_service.forEach((service) => {
        service_type.append(
          `<li><i class="flaticon-comment"></i>${service}</li>`
        );
      });

      const show_display = $("#show_display");
      show_display.prop("src", data.show);
      show_display.prop("alt", data.show);

      const image_one = $("#image_one");
      image_one.prop("src", data.medias[0]);
      image_one.prop("alt", data.medias[0]);

      const image_two = $("#image_two");
      image_two.prop("src", data.medias[1]);
      image_two.prop("alt", data.medias[1]);

      const image_three = $("#image_three");
      image_three.prop("src", data.medias[2]);
      image_three.prop("alt", data.medias[2]);

      const benefit_display_one = $("#benefit_display_one");
      const benefit_display_two = $("#benefit_display_two");
      // Split benefits into two halves
      const midIndex = Math.ceil(data.benefit.length / 2);
      const firstHalf = data.benefit.slice(0, midIndex);
      const secondHalf = data.benefit.slice(midIndex);

      // Function to append list items
      const appendBenefits = (container, benefitsArray) => {
        benefitsArray.forEach((benefit) => {
          container.append(`
      <li>
        <img class="mr_15" src="../assets/images/icons/icon-3.png" alt="" />
        ${benefit}
      </li>
    `);
        });
      };

      // Insert benefits into respective lists
      appendBenefits(benefit_display_one, firstHalf);
      appendBenefits(benefit_display_two, secondHalf);
    });
  });
})(window.jQuery);

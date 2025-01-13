const FAQ = require("../database/models/FAQ");
const Contact = require("../database/models/Contact");
const Appointment = require("../database/models/Appointment");
const Newsletter = require("../database/models/Newsletter");
const OfferLetter = require("../database/models/OfferLetter");

// CREATE - Add a new category
const faq = async (req, res) => {
  try {
    const faq = await FAQ.create(req.body);
    res.status(201).json({
      msg: faq.email + " Your Question has been Submitted",
      ...faq.dataValues,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const contact = async (req, res) => {
  try {
    const contact = await Contact.create(req.body);
    res.status(201).json({
      msg: contact.name + " - Your Message has been sent successfully ",
      ...contact.dataValues,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const offer_letter = async (req, res) => {
  const transaction = await OfferLetter.sequelize.transaction(); // Start a transaction
  try {
    const data = req.body;

    // Create the OfferLetter record
    await OfferLetter.create(
      {
        name: data?.name,
        email: data?.email,
        number: data?.number,
        message: data?.message,
        show: req.files?.show
          ? req.files["show"][0].path.replace(/^public[\\/]/, "")
          : null, // Assuming 'show' is a file
      },
      { transaction } // Pass the transaction object to ensure the operation is part of the transaction
    );

    // Commit the transaction
    await transaction.commit();

    // Send success response
    return res.status(201).json({ msg: "Offer Letter created successfully" });
  } catch (error) {
    console.error("Error creating Offer Letter:", error);

    // Rollback transaction on error
    await transaction.rollback();

    // Return error response
    return res.status(500).json({ error: "Offer Letter creation failed" });
  }
};

const appointment = async (req, res) => {
  console.log(res.body);
  try {
    const appointment = await Appointment.create(req.body);
    res.status(201).json({
      msg:
        appointment.name +
        " - Your Appointment has been submitted, We would get back to you shortly",
      ...appointment.dataValues,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
};

const newsletter = async (req, res) => {
  try {
    const newsletter = await Newsletter.create(req.body);
    res.status(201).json({
      msg: "Your Email has Been Added Successfully",
      ...newsletter.dataValues,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  faq,
  contact,
  appointment,
  newsletter,
  offer_letter,
};

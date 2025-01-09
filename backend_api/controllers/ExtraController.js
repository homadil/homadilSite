const FAQ = require("../database/models/FAQ");
const Contact = require("../database/models/Contact");
const Appointment = require("../database/models/Appointment");
const Newsletter = require("../database/models/Newsletter");

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
};

const Notification = require("../database/models/Notification"); // Adjust the path as necessary
const transportMail = require("../config/nodemailer");

// CREATE - Add a new notification
exports.create = async (req, res) => {
  const { content, title, description } = req.body; // Assuming content and user_id are sent in the request body

  try {
    const newNotification = await Notification.create({
      content,
      title,
      description,
      user_id: req.user.id,
    });
    return res.status(201).json({
      msg: "Notification created successfully.",
      notification: newNotification,
    });
  } catch (error) {
    console.error("Error creating notification:", error);
    return res.status(500).json({ msg: "Internal server error." });
  }
};

// READ - Get all notifications
exports.getAll = async (req, res) => {
  try {
    const notifications = await Notification.findAll();
    return res.status(200).json(notifications);
  } catch (error) {
    console.error("Error retrieving notifications:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

// READ - Get a single notification by ID
exports.getById = async (req, res) => {
  const { id } = req.params;

  try {
    const notification = await Notification.findByPk(id);
    if (!notification) {
      return res.status(404).json({ message: "Notification not found." });
    }
    return res.status(200).json(notification);
  } catch (error) {
    console.error("Error retrieving notification:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

// UPDATE (PUT) - Update an entire notification by ID
exports.update = async (req, res) => {
  const { id } = req.params;
  const { content, title, description } = req.body;

  try {
    const notification = await Notification.findByPk(id);
    if (!notification) {
      return res.status(404).json({ message: "Notification not found." });
    }

    // Update the notification
    notification.content = content || notification.content;
    notification.title = title || notification.title;
    notification.description = description || notification.description;

    await notification.save();
    return res
      .status(200)
      .json({ msg: "Notification updated successfully.", notification });
  } catch (error) {
    console.error("Error updating notification:", error);
    return res.status(500).json({ msg: "Internal server error." });
  }
};

// PARTIAL UPDATE (PATCH) - Partially update a notification by ID
exports.partialUpdate = async (req, res) => {
  const { id } = req.params;
  const { content, user_id } = req.body;

  try {
    const notification = await Notification.findByPk(id);
    if (!notification) {
      return res.status(404).json({ message: "Notification not found." });
    }

    // Update only the fields that are provided
    if (content) notification.content = content;
    if (user_id) notification.user_id = user_id;

    await notification.save();
    return res.status(200).json({
      message: "Notification partially updated successfully.",
      notification,
    });
  } catch (error) {
    console.error("Error partially updating notification:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

// DELETE - Remove a notification by ID
exports.delete = async (req, res) => {
  const { id } = req.params;

  try {
    const notification = await Notification.findByPk(id);
    if (!notification) {
      return res.status(404).json({ message: "Notification not found." });
    }

    await notification.destroy();
    return res
      .status(200)
      .json({ message: "Notification deleted successfully.", notification });
  } catch (error) {
    console.error("Error deleting notification:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

exports.send = async (req, res) => {
  const { emails, content, title } = req.body;

  if (!emails || emails.length === 0) {
    return res.status(400).json({ message: "Emails are required." });
  }

  if (!content) {
    return res.status(400).json({ message: "Content is required." });
  }

  // Split emails if they are comma-separated
  const emailList = Array.isArray(emails) ? emails : emails.split(",");

  // Configure email options
  const mailOptions = {
    from: process.env.EMAIL, // Sender email
    to: emailList, // Multiple recipients
    subject: title,
    html: content, // Email content as HTML
  };

  try {
    // Send the email
    const info = await transportMail.sendMail(mailOptions);

    // Respond with success
    res.status(200).json({
      msg: "Notification sent successfully",
      info: info.response,
    });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ msg: "Error sending notification", error });
  }
};

exports.contact_us = async (req, res) => {
  const { name, email, message } = req.body;

  // Validate form data
  if (!name || !email || !message) {
    return res.status(400).json({
      message: "All fields (name, email, message) are required.",
    });
  }

  // Configure email options
  const mailOptions = {
    from: email, // Sender's email (user's email)
    to: process.env.ADMIN_EMAIL, // Admin's email address
    subject: `Contact Us Form Submission from ${name}`, // Dynamic subject line
    html: `
      <h3>You have a new message from ${name}</h3>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Message:</strong></p>
      <p>${message}</p>
    `, // HTML email content
  };

  try {
    // Send the email to the admin
    const info = await transportMail.sendMail(mailOptions);

    // Respond with success message
    res.status(200).json({
      msg: "Your message has been sent successfully.",
      info: info.response,
    });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({
      msg: "There was an error sending your message. Please try again.",
      error,
    });
  }
};

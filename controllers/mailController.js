// controllers/mailController.js
const Mail = require("../models/mail"); // no {}

exports.addMail = async (req, res) => {
  try {
    const { firstName, lastName, email, subject, message } = req.body || {};

    // basic validation
    if (!firstName || !lastName || !email || !subject || !message) {
      return res.status(400).json({ error: "missing data" });
    }

    const created = await Mail.create({
      firstName: String(firstName).trim(),
      lastName:  String(lastName).trim(),
      email:     String(email).trim(),
      subject:   String(subject).trim(),
      message:   String(message).trim(),
    });

    return res.status(201).json({ ok: true, id: created.id, message: "mail created" });
  } catch (error) {
    console.error("addMail error:", error);
    // Sequelize validation errors come with error.errors[]
    return res.status(400).json({
      error: error?.message || "Invalid data",
      issues: error?.errors?.map(e => ({ field: e.path, message: e.message })) || undefined,
    });
  }
};

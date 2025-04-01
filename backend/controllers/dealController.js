const { validationResult } = require("express-validator");
const Deal = require("../models/Deal");

const getDeals = async (req, res) => {
  try {
    const { userId } = req.user;
    const deals = await Deal.find({
      $or: [{ buyer: userId }, { seller: userId }],
    }).populate("buyer seller", "name email");
    res.json(deals);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

const getDeal = async (req, res) => {
  try {
    const deal = await Deal.findById(req.params.id).populate(
      "buyer seller",
      "name email"
    );
    console.log("deal", deal);
    res.json(deal);
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Server error" });
  }
};

const createDeal = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  try {
    const { role } = req.user;
    const userKey = role === "buyer" ? "seller" : "buyer";
    const data = {
      title: req.body.title,
      description: req.body.description,
      price: req.body.price,
      [userKey]: req.body.selectedId,
    };
    const deal = new Deal({ ...data, [role]: req.user.userId });
    await deal.save();
    res.status(201).json(deal);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

const updateDeal = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  try {
    const updatedDeal = await Deal.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    if (!updatedDeal) {
      return res.status(404).json({ message: "Deal not found" });
    }

    res
      .status(200)
      .json({ message: "Deal updated successfully", data: updatedDeal });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};

const deleteDeal = async (req, res) => {
  try {
    const deletedDeal = await Deal.findByIdAndDelete(req.params.id);

    if (!deletedDeal) {
      return res.status(404).json({ message: "Deal not found" });
    }

    console.log("Deal deleted successfully:", deletedDeal);
    res
      .status(200)
      .json({ message: "Deal deleted successfully", data: deletedDeal });
  } catch (error) {
    console.error("Error deleting Deal:", error);
    res.status(500).json({ msg: "Server error" });
  }
};

const uploadDocuments = async (req, res) => {
  try {
    const { dealId, userId } = req.body;

    // Find the deal
    const deal = await Deal.findById(dealId);
    if (!deal) return res.status(404).json({ error: "Deal not found" });

    // Save file details
    const fileDetails = {
      filename: req.file.filename,
      path: `/uploads/${req.file.filename}`, // Relative file path
      uploadedBy: userId,
    };

    deal.documents.push(fileDetails);
    await deal.save();

    res.json({ message: "File uploaded successfully", file: fileDetails });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = {
  getDeals,
  getDeal,
  createDeal,
  updateDeal,
  deleteDeal,
  uploadDocuments,
};


const router = require("express").Router();
const Doubt = require("../models/Doubt");
const Subject = require("../models/Subject");
const verify = require("../verifyToken");

// Create
router.post("/", verify, async (req, res) => {
  try {
    const newDoubt = new Doubt({
      ...req.body,
      poster: req.user.id,
      private: true
    });

    const savedDoubt = await newDoubt.save();
    await savedDoubt.populate([
      { path: "subject", select: "name" },
      { path: "poster", select: ["fullname", "profilePic"] }
    ]);

    res.status(201).json(savedDoubt);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Get All (for teachers) or Get Own (for students)
router.get("/:subject", verify, async (req, res) => {
  try {
    let query = {};
    
    if (!req.user.isTeacher) {
      query.poster = req.user.id;
    }

    if (req.params.subject !== "all") {
      const subject = await Subject.findOne({ name: req.params.subject });
      query.subject = subject._id;
    }

    const doubts = await Doubt.find(query)
      .sort({ _id: -1 })
      .populate({
        path: "subject",
        select: "name",
      })
      .populate({
        path: "poster",
        select: ["fullname", "profilePic"],
      })
      .populate({
        path: "responses",
        populate: {
          path: "poster",
          select: ["fullname", "profilePic"],
        }
      });

    res.status(200).json(doubts);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Get One
router.get("/find/:id", verify, async (req, res) => {
  try {
    const doubt = await Doubt.findById(req.params.id)
      .populate({
        path: "subject",
        select: "name",
      })
      .populate({
        path: "poster",
        select: ["fullname", "profilePic"],
      })
      .populate({
        path: "responses",
        populate: {
          path: "poster",
          select: ["fullname", "profilePic"]
        }
      });

    if (!doubt) {
      return res.status(404).json("Doubt not found");
    }

    if (!req.user.isTeacher && doubt.poster.toString() !== req.user.id) {
      return res.status(403).json("You can only view your own doubts");
    }

    res.status(200).json(doubt);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Add Response (For teachers on doubts, and original posters on responses)
router.post("/:id/responses", verify, async (req, res) => {
  try {
    const doubt = await Doubt.findById(req.params.id);
    if (!doubt) {
      return res.status(404).json("Doubt not found");
    }

    // Check if user is teacher or original poster
    const originalDoubt = doubt.isResponse ? await Doubt.findOne({ responses: doubt._id }) : doubt;
    const isTeacher = req.user.isTeacher;
    const isOriginalPoster = doubt.poster.toString() === req.user.id;
    
    // Allow if user is teacher or original poster
    if (!isTeacher && !isOriginalPoster) {
      return res.status(403).json("Only teachers and the original poster can respond");
    }

    const parentDoubt = await Doubt.findById(req.params.id);
    if (!parentDoubt) {
      return res.status(404).json("Doubt not found");
    }

    const response = new Doubt({
      ...req.body,
      poster: req.user.id,
      isResponse: true
    });

    const savedResponse = await response.save();
    parentDoubt.responses.push(savedResponse._id);
    await parentDoubt.save();

    const populatedDoubt = await Doubt.findById(parentDoubt._id)
      .populate({
        path: "subject",
        select: "name",
      })
      .populate({
        path: "poster",
        select: ["fullname", "profilePic"],
      })
      .populate({
        path: "responses",
        populate: {
          path: "poster",
          select: ["fullname", "profilePic"]
        }
      });

    res.status(200).json(populatedDoubt);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Delete
router.delete("/:id", verify, async (req, res) => {
  try {
    const doubt = await Doubt.findById(req.params.id);
    if (!doubt) {
      return res.status(404).json("Doubt not found");
    }

    if (doubt.poster.toString() !== req.user.id && !req.user.isTeacher) {
      return res.status(403).json("You can only delete your own doubts");
    }

    // Delete all responses associated with this doubt
    if (doubt.responses.length > 0) {
      await Doubt.deleteMany({ _id: { $in: doubt.responses } });
    }

    await doubt.delete();
    res.status(200).json("Doubt has been deleted");
  } catch (err) {
    res.status(500).json(err);
  }
});

// Update
router.put("/:id", verify, async (req, res) => {
  try {
    const doubt = await Doubt.findById(req.params.id);
    if (!doubt) {
      return res.status(404).json("Doubt not found");
    }

    if (doubt.poster.toString() !== req.user.id && !req.user.isTeacher) {
      return res.status(403).json("You can only update your own doubts");
    }

    const updatedDoubt = await Doubt.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    ).populate([
      { path: "subject", select: "name" },
      { path: "poster", select: ["fullname", "profilePic"] },
      {
        path: "responses",
        populate: {
          path: "poster",
          select: ["fullname", "profilePic"]
        }
      }
    ]);

    res.status(200).json(updatedDoubt);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;

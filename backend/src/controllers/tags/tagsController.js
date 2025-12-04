import asyncHandler from "express-async-handler";
import Tags from "../../models/tags/TagsModel.js";

// Create a new tag
export const createTag = asyncHandler(async (req, res) => {
  try {
    const userId = req.user._id;
    const { name } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "Not Authotised! Please Login" });
    }

    if (!name || name === "") {
      return res.status(400).json({ message: "Tag name is required" });
    }

    const tag = await Tags.create({
      name,
      user: userId,
    });

    await tag.save();

    return res.status(201).json(tag);
  } catch (error) {
    console.log("Error in createTag", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

export const getTags = asyncHandler(async (req, res) => {
  try {
    const tags = await Tags.find({});

    return res.status(200).json(tags);
  } catch (error) {
    console.log("Error in getTags", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

export const getTagById = asyncHandler(async (req, res) => {
  try {
    const tag = await Tags.findById(req.params.id);

    if (!tag) {
      return res.status(404).json({ message: "Tag not found" });
    }

    return res.status(200).json(tag);
  } catch (error) {
    console.log("Error in getTagById", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

export const deleteTag = asyncHandler(async (req, res) => {
  try {
    const tag = await Tags.findById(req.params.id);

    if (!tag) {
      return res.status(404).json({ message: "Tag not found" });
    }

    return res.status(200).json({ message: "Tag deleted" });
  } catch (error) {
    console.log("Error in deleteTag", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

// Bulk add tags --> only admin can do this
export const bulkAddTags = asyncHandler(async (req, res) => {
  try {
    const userId = req.user._id;

    const { tags } = req.body; // expecting an array of tag names

    if (!userId) {
      return res.status(400).json({ message: "Not Authotised! Login" });
    }

    if (!tags || tags.length === 0 || !Array.isArray(tags)) {
      return res.status(400).json({ message: "No tags provided" });
    }

    // craete an array of tag objects
    const tagsDoc = tags.map((tag) => ({
      name: tag,
      user: userId,
    }));

    // Insert all tags in bulk
    const createdTags = await Tags.insertMany(tagsDoc);

    return res.status(201).json({ message: "Tags added", createdTags });
  } catch (error) {
    console.log("Error in bulkAddTags", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

import { Field } from "../models/fields.model.js";
import { User } from "../models/user.model.js";
import { Document } from "../models/document.model.js";



export const handleSendSignerEvent = async (req, res) => {
  const { docId } = req.params;
  const { field } = req.body;

  console.log(field);

  try {
    const results = await Promise.all(

      field.map(async (f) => {
        // console.log(f.field_id ,"field id")
        const existingField = await Field.findOne({field_id: f.field_id });
        // console.log(existingField)

        if (existingField) {
          // Update existing field by its _id
          return await Field.findByIdAndUpdate(existingField._id, { $set: f }, { new: true });
        } else {
          // Create new field
          return await new Field({ ...f, documentId: docId }).save();
        }
      })
    );

    res.status(200).json({ message: "Fields saved successfully", data: results });
  } catch (error) {
    console.error("error in upda5te event:",error);
    res.status(500).json({ error: "Failed to save fields" });
  }
};





export const getAllDocumentsForUser = async (req, res) => {
  try {
    const userId = req.user._id;


    // assuming req.user is set by auth middleware

    // Optionally verify the user exists
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const documents = await Document.find({ uploadedBy: userId }).populate('signers');

    res.status(200).json({ message: "Documents fetched successfully", documents });
  } catch (error) {
    console.error("Error fetching user documents:", error);
    res.status(500).json({ message: "Server error" });
  }
};


export const getFieldsByDocumentId = async (req, res) => {
  try {
    const { id } = req.params;

    const fields = await Field.find({ documentId: id });

    res.status(200).json({ message: "Fields fetched successfully", fields });
  } catch (error) {
    console.error("Error fetching fields:", error);
    res.status(500).json({ message: "Server error" });
  }
};




export const getDocumentWithFields = async (req, res) => {
  try {
    const { id } = req.params;

    console.log('Function getDocumentWithFields is called');

    // Get document
    const document = await Document.findById(id).populate('signers');
    if (!document) {
      return res.status(404).json({ message: "Document not found" });
    }

    // Get fields related to this document
    const rawFields = await Field.find({ documentId: id });

    // Map fields: convert `field_id` to `id` for frontend consistency
    const fields = rawFields.map(field => {
      const obj = field.toObject();
      obj.id = obj.field_id;  // copy field_id to id
      delete obj.field_id;    // optionally delete field_id
      return obj;
    });

    res.status(200).json({
      message: "Document and fields fetched successfully",
      document,
      fields,
    });
  } catch (error) {
    console.error("Error fetching document and fields:", error);
    res.status(500).json({ message: "Server error" });
  }
};



export const getDocumnetAssignedToUser = async (req, res) => {
  const userId = req.user._id;

  try {
    // Step 1: Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Step 2: Find documents where this user is a signer
    const documents = await Document.find({
      signers: { $in: [userId] }
    }).populate('uploadedBy');

    if (!documents || documents.length === 0) {
      return res.status(404).json({ success: false, message: "No document found for this user." });
    }

    // Step 3: For each document, get fields assigned to this user
    const result = await Promise.all(
      documents.map(async (doc) => {
        const fields = await Field.find({
          $and: [
            { signer: user.email }, // or { assignedTo: user.email } depending on your schema
            { documentId: doc._id }
          ]
        });

        return {
          document: doc,
          fields
        };
      })
    );

    // Step 4: Respond with documents and their filtered fields
    return res.status(200).json({
      success: true,
      data: result
    });

  } catch (error) {
    console.error("Error in getDocumnetAssignedToUser:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};


 export const deletefield = async (req, res) => {
  try {
    const { field_id } = req.params;

    // Find and delete the field by field_id
    const deletedField = await Field.findOneAndDelete({field_id: field_id });

    if (!deletedField) {
      return res.status(404).json({ success: false, message: "Field not found" });
    }

    return res.status(200).json({ success: true, message: "Field deleted successfully" });
  } catch (error) {
    console.error("Error deleting field:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};
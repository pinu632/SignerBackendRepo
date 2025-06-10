import cloudinary from "../config/Cloudinary.config.js";
import { sendError, sendSuccess } from "../helpers/APIhelpers.js";
import { Document } from "../models/document.model.js";
import { User } from "../models/user.model.js";

export const UploadFile = async (req, res) => {

  console.log(req.body)
  const { documentName } = req.body;
  const file = req.file
  const user = req.user;


  const signers = JSON.parse(req.body.signers)


  try {
    // Validate required fields

    console.log(documentName, "doc")
    console.log(signers, "signer")


    if (!documentName || !signers || !Array.isArray(signers) || signers.length < 1) {
      return sendError(res, "All fields are necessary", 400);
    }

    if (!file) return sendError(res, "No file provided", 400);

    console.log(user._id.toString())

    const currentUser = await User.findById(user._id.toString());
    if (!currentUser) return sendError(res, "Invalid user", 401);

    // Upload file to Cloudinary
    const result = await cloudinary.uploader.upload(file.path, {
      folder: "signerApp",
    });

    // Collect valid signer IDs
    const signerIds = [];
    for (const el of signers) {
      const foundUser = await User.findOne({ email: el.email });
      if (foundUser) {
        signerIds.push(foundUser._id);
      }
    }

    if (signerIds.length === 0) {
      return sendError(res, "No valid signers found", 400);
    }

    // Create and save the document
    const document = new Document({
      fileName: documentName,
      fileUrl: result.secure_url,
      signers: signerIds,
      uploadedBy: currentUser._id,
    });

    await document.save();
    await document.populate('signers uploadedBy'); // ✅ populate correctly


    return sendSuccess(res, document, "Document uploaded", 201);
  } catch (error) {
    console.error(error);
    return sendError(res, "Error in upload file API", 500);
  }
};

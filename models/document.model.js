import mongoose from 'mongoose';

const DocumentSchema = new mongoose.Schema({
  fileName: { type: String, required: true },
  fileUrl: { type: String, required: true },
  fields: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Field' }],
  signers:[{type: mongoose.Schema.Types.ObjectId, ref:'User'}],
  uploadedBy:{
    type: mongoose.Schema.Types.ObjectId,
     ref: 'User' 
  },
  sendCopyTo:{
    type:String
  },

  
  createdAt: { type: Date, default: Date.now },
});

export const Document = mongoose.model('Document', DocumentSchema);

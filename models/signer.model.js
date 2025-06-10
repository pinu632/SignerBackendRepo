import mongoose from 'mongoose';

const SignerSchema = new mongoose.Schema({
  email: { type: String, required: true },
  documentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Document' },
  hasSigned: { type: Boolean, default: false },
  signedAt: { type: Date },
});

export const Signer = mongoose.model('Signer', SignerSchema);

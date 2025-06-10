import mongoose from 'mongoose';

const FieldSchema = new mongoose.Schema({
  documentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Document' },
  content:{type:String},
  type: { type: String, enum: ['signature', 'text','image'], required: true },
  page: { type: Number},
 
  x: Number,
  y: Number,
  
  width: Number,
  field_id:Number,
  height: Number,
  rotatio:Number,
  signer: { type: String, required: true }, // email
  color:String,
  fontFamily:String,
  fontSize:Number,
  signatureMode:{type:String,enum:['type','draw'],default:'type'},
 

  status: { type: String, enum: ['pending', 'completed'], default: 'pending' },
});

export const Field = mongoose.model('Field', FieldSchema);

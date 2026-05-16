import mongoose, { Document, Schema } from 'mongoose';

export interface ILead extends Document {
  name: string;
  email: string;
  status: 'new' | 'contacted' | 'qualified' | 'lost';
  source: 'website' | 'instagram' | 'referral';
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
}

const leadSchema = new Schema<ILead>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    status: {
      type: String,
      enum: ['new', 'contacted', 'qualified', 'lost'],
      default: 'new',
    },
    source: {
      type: String,
      enum: ['website', 'instagram', 'referral'],
      required: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model<ILead>('Lead', leadSchema);
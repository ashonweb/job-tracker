import mongoose from 'mongoose';

const ApplicationSchema = new mongoose.Schema({
  userId:      { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  company:     { type: String, required: true },
  role:        { type: String, required: true },
  location:    { type: String, default: '' },
  jobUrl:      { type: String, default: '' },
  salary:      { type: String, default: '' },
  status:      { type: String, enum: ['Applied', 'Screening', 'Interview', 'Offer', 'Rejected'], default: 'Applied' },
  dateApplied: { type: Date, default: Date.now },
  notes:       { type: String, default: '' },
}, { timestamps: true });

export default mongoose.models.Application || mongoose.model('Application', ApplicationSchema);

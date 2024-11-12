import { IsEqualCustomizer } from "lodash";
import mongoose, { Document, Schema, Model } from "mongoose";

interface IShift extends Document {
  shiftName: string | null;
  wage: number | null;
  location: string | null;
  date: Date | null;
  startTime: Date | null;
  endTime: Date | null;
  jobDescription: string | null;
  status: "active" | "inactive" | "pending";
  recruiter: mongoose.Schema.Types.ObjectId | null;
  applicants: mongoose.Schema.Types.ObjectId[] | null;
}

const ShiftSchema: Schema<IShift> = new mongoose.Schema({
  shiftName: { type: String },
  wage: { type: Number },
  location: { type: String },
  date: { type: Date },
  startTime: { type: Date },
  endTime: { type: Date },
  jobDescription: { type: String },
  status: {
    type: String,
    enum: ["active", "inactive", "pending"],
    required: true,
  },
  recruiter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  applicants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
});

const ShiftModel: Model<IShift> = mongoose.model<IShift>("Shift", ShiftSchema);

export const createShift = (values: Omit<IShift, "_id">) =>
  new ShiftModel(values).save().then((shift) => shift.toObject());

export const findShift = (id: string): Promise<IShift | null> =>
  ShiftModel.findById(id);

export const findRecruiterShifts = (id: string): Promise<IShift[]> =>
  ShiftModel.find({ recruiter: id });

export const updateShift = (
  id: string,
  values: Partial<IShift>
): Promise<IShift | null> =>
  ShiftModel.findByIdAndUpdate(id, values, { new: true });

import mongoose, { Schema, Document, Model } from "mongoose";

export interface ISubject {
  name: string;
  score: number;
  grade: string;
}

export interface IResult extends Document {
  studentId: string;
  studentName: string;
  session: string;
  term: "1st" | "2nd" | "3rd";
  className: string;
  subjects: ISubject[];
  createdBy: string;
  createdAt: Date;
}

const SubjectSchema = new Schema<ISubject>(
  {
    name: { type: String, required: true },
    score: { type: Number, required: true, min: 0, max: 100 },
    grade: { type: String, required: true },
  },
  { _id: false }
);

const ResultSchema = new Schema<IResult>(
  {
    studentId: { type: String, required: true, index: true },
    studentName: { type: String, required: true },
    session: { type: String, required: true },
    term: { type: String, enum: ["1st", "2nd", "3rd"], required: true },
    className: { type: String, required: true },
    subjects: { type: [SubjectSchema], required: true },
    createdBy: { type: String, required: true },
  },
  { timestamps: true }
);

const Result: Model<IResult> =
  mongoose.models.Result || mongoose.model<IResult>("Result", ResultSchema);

export default Result;

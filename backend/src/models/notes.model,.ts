import { Schema, model, Document } from "mongoose";

export interface INote extends Document {
  userId: string;
  title: string;
  content: string;
}

const noteSchema = new Schema<INote>(
  {
    userId: { type: String, required: true },
    title: { type: String, required: true },
    content: { type: String, required: true }
  },
  { timestamps: true }
);

export const Note = model<INote>("Note", noteSchema);

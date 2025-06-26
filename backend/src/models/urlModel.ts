import { Schema, model, Document, Types } from "mongoose";

export interface IUrl extends Document {
  userId: Types.ObjectId;
  originalUrl: string;
  shortCode: string;
  clicks:number;
  shortUrl:string;
  createdAt: Date;
}

const UrlSchema = new Schema<IUrl>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  originalUrl: { type: String, required: true },
  shortCode: { type: String, required: true, unique: true },
    clicks: { type: Number, default: 0 },
    shortUrl: { type: String, required: true }, 

  createdAt: { type: Date, default: Date.now },
});

export default model<IUrl>("Url", UrlSchema);

import { Document } from "mongoose";

interface IApiKey extends Document {
  key: string;
  status: boolean;
  permissions: string[];
}
import { Document } from "mongoose";

interface IShop extends Document {
    name: string;
    email: string;
    password: string;
    status: "active" | "inactive";
    verify: boolean;
    roles: string[];
}

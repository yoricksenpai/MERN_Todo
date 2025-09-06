import mongoose, { Schema } from "mongoose";
import { ICategory } from '../types/index.ts';

const categorySchema = new Schema<ICategory>({
    name: { type: String, required: true },
    author: {type: mongoose.Schema.Types.ObjectId, ref:'User', required: true }
})
const Category = mongoose.model<ICategory>("Category", categorySchema)
export default Category;
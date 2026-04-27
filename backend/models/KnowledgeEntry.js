import mongoose from "mongoose";

const KnowledgeEntrySchema = new mongoose.Schema(
  {
    text: { type: String, required: true },
  },
  { timestamps: true }
);

export const KnowledgeEntry =
  mongoose.models.KnowledgeEntry || mongoose.model("KnowledgeEntry", KnowledgeEntrySchema);


import mongoose from "mongoose";

const ruleSchema = new mongoose.Schema(
  {
    field: {
      type: String,
      required: true
    },
    operator: {
      type: String,
      enum: ["equals", "not_equals", "in", "contains"],
      required: true
    },
    value: {
      type: mongoose.Schema.Types.Mixed,
      required: true
    },
    serveValue: {
      type: mongoose.Schema.Types.Mixed,
      required: true
    }
  },
  { _id: false }
);

const featureFlagSchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
      index: true
    },

    key: {
      type: String,
      required: true,
      trim: true
    },

    type: {
      type: String,
      enum: ["boolean", "string", "number", "json"],
      required: true
    },

    enabled: {
      type: Boolean,
      default: true
    },

    defaultValue: {
      type: mongoose.Schema.Types.Mixed,
      required: true
    },

    rollout: {
      percentage: {
        type: Number,
        min: 0,
        max: 100,
        default: 100
      }
    },

    rules: [ruleSchema],

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  {
    timestamps: true
  }
);

/* Prevent duplicate flags per project */
featureFlagSchema.index({ projectId: 1, key: 1 }, { unique: true });

export default mongoose.model("FeatureFlag", featureFlagSchema);

const mongoose = require("mongoose");

const watercartSchema = mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        amount: { 
            type: Number, 
            required: true 
        },
        date: { 
            type: String,  // Store date as a string in YYYY-MM-DD format
            required: true,
            default: () => new Date().toISOString().split('T')[0], // Default to today's date
        }
    },
    {
        timestamps: {
            createdAt: 'createdAt',
            updatedAt: 'updatedAt',
        },
    }
);

const Water = mongoose.model("Water", watercartSchema);

module.exports = { Water };

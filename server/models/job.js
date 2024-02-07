import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema({
    companyId: String,
    title: String,
    description: String
}, 
{  timestamps: { createdAt: true, updatedAt: true }, versionKey: false, strict: false  });

export const Job = mongoose.model('graphql-job', jobSchema, 'graphql-job');
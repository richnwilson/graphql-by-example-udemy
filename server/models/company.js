import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    id: String,
    name: String,
    description: String
}, 
{  timestamps: { createdAt: true, updatedAt: true }, versionKey: false, strict: false  });


export const Company =  mongoose.model('graphql-company', userSchema, 'graphql-company');
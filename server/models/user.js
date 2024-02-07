import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
    companyId: String,
    email: { 
        type: String,
        trim: true
    },
    password: {
        type: String,
        trim: true}
}, 
{  timestamps: { createdAt: true, updatedAt: true }, versionKey: false, strict: false  });

userSchema.pre("save", async function (next) {
    const user = this;
    if (user.isModified("password")) {
        user.password = await bcrypt.hash(user.password, 10)
    }
})
export const User =  mongoose.model('graphql-user', userSchema, 'graphql-user');
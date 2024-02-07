import { User } from '../models/user.js';

export const getUser = async (_id) => {
    try {
        return await User.findOne({_id}).lean().exec();
    } catch(e) {
        return null
    }
}
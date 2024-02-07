import { Job } from '../models/job.js';

export const getJobs = async ({ limit, skip }) => {
    try {
        const items = await Job.find().limit(limit ?? 0).skip(skip ?? 0).lean().exec();
        const totalCount = await Job.find().count();
        return { items, totalCount }
    } catch(e) {
        console.log(e)
        return null
    }
}

export const getJobsByCompany = async (id) => {
    try {
        return await Job.find({companyId: id}).lean().exec();
    } catch(e) {
        console.log(e)
        return null
    }
}

export const getJob = async (id) => {
    try {
        return await Job.findOne({_id: id}).lean().exec();
    } catch(e) {
        return null
    }
}

export const createJob = async (data) => {
    try {
        return await Job.create(data);
    } catch(e) {
        return {}
    }
}

export const deleteJob = async (_id, companyId) => {
    try {
        const job = await Job.findOne({_id, companyId}).lean().exec();
        if (!job) {
            return null;
        }
        await Job.deleteOne({_id});
        return job;
    } catch(e) {
        console.log(e)
        return {}
    }
}
    
export const updateJob = async ({_id, title, description}, companyId) => {
    try {
        const job = await Job.findOne({_id, companyId}).lean().exec();
        if (!job) {
           return null;
        }
        await Job.findOneAndUpdate({_id},{ title, description});
        return {...job, ...{title, description}}
    } catch(e) {
        return {}
    }
}      
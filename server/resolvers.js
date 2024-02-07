import { getJobs, getJob, getJobsByCompany, createJob, deleteJob, updateJob } from './db/jobs.js';
import { getCompany, companyLoader } from './db/companys.js';
import common from './utils/common.js'
import moment  from 'moment';

export const resolvers = {
    Query: {
       jobs: (_root, params) => getJobs(params),
       job: async (_root, { _id }) => {
        const job = await getJob(_id)
        if (!job) {
            common.graphQLError(`No job for id ${_id}`,'NOT_FOUND')
        }
        return job;
       },
       company: async (_root, { id }) => {
        const company = await getCompany(id);
        if (!company) {
            common.graphQLError(`No company for id ${id}`,'NOT_FOUND')
        }
        return company;
       }
    },
   
    // When trying to execute this in  Apollo UI - http://localhost:5000/graphql 
    // - will need to find the auth token and then in the UI, click 'Headers' and use
    // - Type = Authorization
    // - Value - Bearer <token>
    // Will need a clever way to figure out Admin for Apollo UI and authenticated user for frontend UI
    // Maybe we should have http handle the authentication with cookies and not rely on GraphQL to handle it
    //  - this is definitly true if in the same app we use different protocols i.e. http and websocket
    //  - the protocols should handle own authentication so that the graphQL is consistent across all protocols
    Mutation: {
        createJob: async (_root, { input }, { user }) => {
            if (!user) {
                common.graphQLError(`Missing Authentication`,'NOT_AUTHENTICATED')
            }
            return await createJob({companyId: user.companyId, ...input})
        },
        deleteJob: async (_root, { _id }, { user }) => {
            if (!user) {
                common.graphQLError(`Missing Authentication`,'NOT_AUTHENTICATED')
            }
            // Check that only an authenticated user from a given company can delete
            // jobs from their own company only
            const job = await deleteJob(_id,user.companyId);
            if (!job) {
                common.graphQLError(`No job found for id ${_id}`,'NOT_FOUND')
            }
            return job;
        },
        updateJob: async (_root, { input }, { user }) => { 
            if (!user) {
                common.graphQLError(`Missing Authentication`,'NOT_AUTHENTICATED')
            }
            // Check that only an authenticated user from a given company can update
            // jobs from their own company only
            const job = await updateJob(input,user.companyId);
            if (!job) {
                common.graphQLError(`No job found for id ${input._id}`,'NOT_FOUND')
            }            
            return job;
        }
    },
    Company: {
        jobs: (company) => getJobsByCompany(company.id)
    },
    Job: {
        company: (job) => {
            return companyLoader.load(job.companyId)
        },
        date: (job) => moment(job.createdAt).format("MMM, DD YYYY")
    }
}
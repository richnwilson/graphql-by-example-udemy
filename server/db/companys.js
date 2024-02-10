import DataLoader from 'dataloader';
import { Company } from '../models/company.js';

export const getCompany = async (id) => {
    try {
        return await Company.findOne({id}).lean().exec();
    } catch(e) {
        console.log(e)
        return null
    }
}

/* Not 100% sure how this works.
    - somehow after all the job data is pulled it passes in just the ids of the companies 
    - then we grab all that company data
    - it has to preserver the order of the ids, hence the map function
    - This code is only triggered the first time the data is requested, then it's cached to improve performance
    - If need to skip cache, need to add the companyLoader instance into the query context - like User authentation
       - See 10.4 of the IBM Udemy for details
    - it is meant to save on # of data calls
*/
export const companyLoader = new DataLoader(async (ids) => {
    console.log('[companyLoader] ids:', ids);
    const companies = await Company.find({id: ids}).lean().exec();
    return ids.map((id) => companies.find((company) => company.id === id));
})
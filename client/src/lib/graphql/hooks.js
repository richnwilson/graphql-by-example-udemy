import { companyByIdQuery,jobByIdQuery, jobsByQuery, createJobMutation } from './queries.js';
import { useMutation } from '@apollo/client';
import { useQuery } from '@apollo/client';

export const useCompany = (id) => {
  const { data : { company } = {}, loading, error } = useQuery(companyByIdQuery, {
    variables: {id}
  });
  return { company, loading, error}
}

export const useJobs = (input) => {
    const { data : { jobs } = {}, loading, error } = useQuery(jobsByQuery, {
      variables: {...input}
    });
    return { jobs, loading, error}
}

export const useJob = (id) => {
    const { data : { job } = {}, loading, error } = useQuery(jobByIdQuery, {
      variables: {id},
      fetchPolicy: 'cache-first'
    });
    return { job, loading, error}
}

export const useCreateJob = () => { 
  const [ mutate, { loading, error } ] = useMutation(createJobMutation);
  
  const createJob = async (input) => {
    const { data: { job } = {} } = await mutate({
      variables: { input } ,
      update: (cache, { data }) => {
        cache.writeQuery({
          query: jobByIdQuery,
          variables: { id: data.job._id },
          data
        })
      }
    })
    return job
  };

  return { 
    createJob,
    loading,
    error
  }
}
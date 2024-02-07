import { useParams } from 'react-router';
import JobList from '../components/JobList';
import { useCompany } from '../lib/graphql/hooks.js';
import common from '../helpers/common';

// We have moved all the Apollo graphQL queries out of React component to keep it clean

function CompanyPage() {
  const { companyId } = useParams();
  const { company, loading, error } = useCompany(companyId)

  if (error?.message) {
    console.log(`Error - ${error.message}`)
    common.displayMessage('error',`Unable to retrieve company: ${error.message}`)
  }

  if (loading)  {
    return (
      <div className="dot-pulse"></div>
    )
  }

  return (
    <>
    { error ? 
      <div>No data available</div>
      :
      <div>
        <h1 className="title">
          {company?.name}
        </h1>
        <div className="box">
          {company?.description}
        </div>
        <h2 className='title is-5'/>
          Jobs at {company?.name}
          <JobList jobs={company?.jobs}/>
      </div>
    }
    </>
  );
}

export default CompanyPage;

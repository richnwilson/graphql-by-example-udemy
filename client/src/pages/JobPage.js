import { useParams } from 'react-router';
import { Link } from 'react-router-dom';
import { useJob } from '../lib/graphql/hooks';
import common from '../helpers/common';

function JobPage() {
  const { jobId } = useParams();
  const { job, loading, error } = useJob(jobId);

  if (error?.message) {
    console.log(`Error - ${error.message}`)
    common.displayMessage('error',`Unable to retrieve job: ${error.message}`)
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
        <h1 className="title is-2">
        {job?.title}
        </h1>
        <h2 className="subtitle is-4">
          <Link to={`/companies/${job?.company?.id}`}>
            {job?.company?.name}
          </Link>
        </h2>
        <div className="box">
          <div className="block has-text-grey">
            Posted: {job?.date}
          </div>
          <p className="block">
            {job?.description}
          </p>
        </div>
      </div>
    }    
    </>
  );
}

export default JobPage;

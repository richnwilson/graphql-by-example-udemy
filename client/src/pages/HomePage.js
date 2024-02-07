import { useState } from 'react';
import JobList from '../components/JobList';
import common from '../helpers/common.js';
import { useJobs } from '../lib/graphql/hooks.js';

const LIMIT = 3;

function HomePage() {
  const [ state, setStateVal ] = useState({
    currentPage: 1
  })
  const { currentPage } = state;  
  const { jobs: { items, totalCount = 1 } = {}, loading, error } = useJobs({limit: LIMIT,skip: (currentPage - 1) * LIMIT});

  if (error?.message) {
    console.log(`Error - ${error.message}`)
    common.displayMessage('error',`Unable to retrieve jobs: ${error.message}`)
    return <div className='has-text-danger'>Data Unavailable</div>;
  }

  if (loading) {
    return <div className="dot-pulse"></div>
  }

  const totalPages = Math.ceil(totalCount / LIMIT);

  return (
    <div>
      <h1 className="title">
        Job Board
      </h1>
      <div>
        <button disabled={currentPage === 1} onClick={() => setStateVal((prev) => ({ ...prev, currentPage: currentPage - 1}))}>Previous</button>
        <span> {`${currentPage} of ${totalPages}`} </span>
        <button disabled={currentPage >= totalPages} onClick={() => setStateVal((prev) => ({ ...prev, currentPage: currentPage + 1}))}>Next</button>
      </div>
      <JobList jobs={items} />
    </div>
  );
}

export default HomePage;

import { useState } from 'react';
import { useNavigate } from 'react-router';
import common from '../helpers/common';
import { useCreateJob } from '../lib/graphql/hooks';

// All graphQL queries moved to the /lib/graghql/hooks component

function CreateJobPage() {
  const navigate = useNavigate();
  const [ state, setStateVal ] = useState({
    title: '',
    description: ''
  })
  const { title, description } = state;
  const { createJob, loading, error } = useCreateJob();

  const handleSubmit = async (event) => {
    try {
      event.preventDefault();
      if (error) throw new Error(`Error creating or caching new post: ${error.message}`);
      // This mutate will also create a new Apollo cache item so that we don't need to reload the page again to get the new post
      // - since we added 'cache-first' on the fetchPolicy in the navigate jobs/ID page
      const job = await createJob({ title, description })
      navigate(`/jobs/${job._id}`);
    } catch(e) {
      console.log(`Error - ${e?.message || e}`)
      common.displayMessage('error', e?.message ? `Unable to create post: ${e?.message}` : e)
    }
  };

  return (
    <div>
      <h1 className="title">
        New Job
      </h1>
      <div className="box">
        <form>
          <div className="field">
            <label className="label">
              Title
            </label>
            <div className="control">
              <input className="input" type="text" value={title}
                onChange={(event) => setStateVal((prev) => ({ ...prev, title: event.target.value}))}
              />
            </div>
          </div>
          <div className="field">
            <label className="label">
              Description
            </label>
            <div className="control">
              <textarea className="textarea" rows={10} value={description}
                onChange={(event) => setStateVal((prev) => ({ ...prev, description: event.target.value}))}
              />
            </div>
          </div>
          <div className="field">
            <div className="control">
              <button className="button is-link" disabled={loading} onClick={handleSubmit}>
                Submit
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateJobPage;

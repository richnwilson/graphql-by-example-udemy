import { ApolloClient, ApolloLink, concat, InMemoryCache, createHttpLink, gql } from '@apollo/client';
import { getAccessToken } from '../auth';

const httpLink  = createHttpLink({
  uri: 'http://localhost:5000/graphql'
});

// For OIC, we will encrypt the email using crypto - see app.js for code and pass that in here
const authLink = new ApolloLink((operation, forward) => {
  const accessToken = getAccessToken();
  operation.setContext({
      headers: { 'Authorization': accessToken ? `Bearer ${accessToken}`: {} }
  })
  return forward(operation)
})

// Developer: Install Apollo CLient Devtools to help debug :)

// Apollo Client will automatically cache in memory and pages already loaded UNTIL you do a refresh and then it will reload as needed
// - how does this impact Initiatives ?!?!
// - you can see this by reviewing Developer console Network tab and moving back and forth between already requested pages, then try reload
// Can override the this 'fetchPolicy' which by default is 'cache-first' to 'network-only'. In the later case, will reload each time
// Since we are using the Apollo React 'UseQuery' hook, see the ./hooks.js for an example of fetchPolicy
// - NOTE: watchQuery is used with React to detect query change

export const apolloClient = new ApolloClient({
  uri: 'http://localhost:5000/graphql',
  link: concat(authLink, httpLink), /* This will link authentication links in order - important to add authLink first */
  cache: new InMemoryCache(),
  defaultOptions: {
    query: { 
      fetchPolicy: 'network-only'
    },
    watchQuery: {
      fetchPolicy: 'network-only'
    }
  }
})

/* This is a graphQL fragment that is essentially a pre-defined list of fields from query object
   - in this case we are using these fields in multiple places so we define them once and then reference as spread operator i.e.

  query Job {
    job(_id: "64f8d9d7947d7395b3f2c45a" ) {
      ...JobDetail
    }
  }

  fragment JobDetail on Job {
      _id
      company {
        id
        name
      }
      date
      description
      title
  }

  as you see we need to pass the fragment in at the end of query - outside the query paramters
*/   
const JOBDETAILFRAGMENT = gql `
  fragment JobDetail on Job {
    _id
    company {
      id
      name
    }
    date
    description
    title
}
`;

export const jobsByQuery = gql`
  query Jobs($limit: Int, $skip: Int) {
    jobs (limit: $limit, skip: $skip) {
      items {
      company {
        id
        name
      }
      date
      description
      title
      _id
    }
    totalCount
    }
  }
`;

export const jobByIdQuery  = gql`
  query JobById($id: ID!) {
    job(_id: $id) {
      ...JobDetail
    }
  }
  ${JOBDETAILFRAGMENT}
`;

export const companyByIdQuery = gql`
  query CompanyById($id: ID!) {
      company(id: $id) {
        name
        description
        jobs {
          _id
          date
          title
          description
        }
      }
    }
  `;

export const createJobMutation =  gql`
  mutation createJob($input: createJobInput!) {
    job: createJob(input: $input) {
      ...JobDetail
    }
  }
  ${JOBDETAILFRAGMENT}
`;
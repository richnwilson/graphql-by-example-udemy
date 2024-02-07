import { ApolloProvider } from '@apollo/client';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Route, Routes } from 'react-router-dom';
import { getUser } from './lib/auth.js';
import NavBar from './components/NavBar';
import CompanyPage from './pages/CompanyPage';
import CreateJobPage from './pages/CreateJobPage';
import HomePage from './pages/HomePage';
import JobPage from './pages/JobPage';
import LoginPage from './pages/LoginPage';

import { ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import { apolloClient } from './lib/graphql/queries.js';

function App() {
  const navigate = useNavigate();
  const [ state, setStateVal ] = useState({
    user: getUser
  })

  const handleLogin = (user) => {
    setStateVal((prev) => ({ ...prev, user}));
    navigate('/');
  }

  const handleLogout = () => {
    setStateVal((prev) => ({ ...prev, user: null}));
    navigate('/');
  }

  return (
    <ApolloProvider client={apolloClient}>
      <NavBar user={state.user} onLogout={handleLogout} />
      <main className="section">
        <Routes>
          <Route index path="/" element={<HomePage/>}/>
          <Route index path="/companies/:companyId" element={<CompanyPage/>}/>
          <Route index path="/jobs/new" element={<CreateJobPage/>}/>
          <Route index path="/jobs/:jobId" element={<JobPage/>}/>
          <Route index path="/login" element={<LoginPage onLogin={handleLogin}/>}/>
        </Routes>
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          /* Default */
        />
      </main>
    </ApolloProvider>
  );
}

export default App;

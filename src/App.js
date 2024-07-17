import React from 'react';
import { HashRouter } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import routes, { renderRoutes } from './routes';

const App = () => {
  return (
    <React.Fragment>
      <HashRouter basename={process.env.REACT_APP_BASE_NAME}>
        {renderRoutes(routes)}
      </HashRouter>
      <ToastContainer />
    </React.Fragment>
  );
};

export default App;

import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App'; 
import { GoogleOAuthProvider } from '@react-oauth/google';
import { Provider } from 'react-redux';
// import { store } from './redux/store';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* <Provider store={store}>   */}
    <GoogleOAuthProvider clientId="629754579608-ftd8dvjv867s3jlci9dmd2ffvlvdorvs.apps.googleusercontent.com">
      <App />
    </GoogleOAuthProvider>;
    {/* </Provider> */}
  </React.StrictMode>
);
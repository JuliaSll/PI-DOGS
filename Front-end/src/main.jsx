import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import store from './redux/store.js'
import { Auth0Provider } from "@auth0/auth0-react";
import { BrowserRouter } from 'react-router-dom'
import { Provider} from 'react-redux'

ReactDOM.createRoot(document.getElementById('root')).render(
  <Auth0Provider
    domain='dev-06rw3uj31omfki3w.us.auth0.com'
    clientId='Q6NR4TDT6WVDQPaYZ9wu4VmxfYZh9DSW'
    redirectUri={window.location.origin}
  >
    <BrowserRouter>
      <Provider store={store}>
        <App />
      </Provider>
    </BrowserRouter>
  </Auth0Provider>
);


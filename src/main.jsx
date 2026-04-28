import { BrowserRouter } from 'react-router-dom';
import { Auth0Provider } from '@auth0/auth0-react';
import App from './App.jsx';
import './index.css';
import './i18n.js';

const domain = import.meta.env.VITE_AUTH0_DOMAIN || "dev-67vbt78z0shc0w8m.us.auth0.com";
const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID || "LzLpI6uXjA7oE5mX6mUf6p8Z8X9oY8h1";

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        redirect_uri: "https://agriverify-app.vercel.app/"
      }}
    >
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Auth0Provider>
  </React.StrictMode>,
);

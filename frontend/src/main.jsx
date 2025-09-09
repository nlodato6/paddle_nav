import { createRoot } from 'react-dom/client'
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import ErrorBoundary from './components/ErrorBoundry.jsx';

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
   <ErrorBoundary>
    <App />
   </ErrorBoundary>
  </BrowserRouter>,
)
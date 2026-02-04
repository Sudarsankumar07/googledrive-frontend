import { BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { IconProvider } from './context/IconContext';
import AppRoutes from './components/routing/AppRoutes';

function App() {
  return (
    <BrowserRouter>
      <IconProvider>
        <ThemeProvider>
          <AuthProvider>
            <AppRoutes />
            <ToastContainer
              position="bottom-right"
              autoClose={3000}
              hideProgressBar={false}
              newestOnTop
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="colored"
              toastClassName="!rounded-xl !shadow-xl"
            />
          </AuthProvider>
        </ThemeProvider>
      </IconProvider>
    </BrowserRouter>
  );
}

export default App;

import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { FavoriteProvider } from './contexts/FavoriteContext'; // 추가

async function prepare() {
  if (import.meta.env.MODE === 'development') {
    const { worker } = await import('../mocks/browser');
    await worker.start();
  }

  const root = createRoot(document.getElementById('root'));
  root.render(
    <BrowserRouter>
      <AuthProvider>
        <FavoriteProvider>
          <App />
        </FavoriteProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

prepare();

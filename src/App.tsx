// src/App.tsx
import { Routes, Route, useLocation  } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion'; // 1. Importe
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import ContactPage from './pages/ContactPage';
import ProjectPage from './pages/ProjectPage';

function App() {
  const location = useLocation(); // 2. Obtenha a localização atual

 return (
    // 3. Envolva as rotas com AnimatePresence
    <AnimatePresence mode="wait">
      {/* 4. A 'key' é essencial! Ela informa ao AnimatePresence que a página mudou. */}
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="contato" element={<ContactPage />} />
          <Route path="projeto/:projectId" element={<ProjectPage />} />
        </Route>
      </Routes>
    </AnimatePresence>
  );
}


export default App;
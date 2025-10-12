import { Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { Sort } from './pages/Sort';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/sort" element={<Sort />} />
    </Routes>
  );
}

export default App;

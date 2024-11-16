import { Routes, Route } from 'react-router-dom';
import { Dashboard } from './pages/Dashboard';
import { Manage } from './pages/Manage';
import { Transactions } from './pages/Transactions';
import { Navbar } from './components/Navbar';

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/manage" element={<Manage />} />
        <Route path="/transactions" element={<Transactions />} />
      </Routes>
    </>
  );
}

export default App;
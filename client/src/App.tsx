import Box from '@mui/material/Box';
import { Route, Routes } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { LandingPage } from './pages/LandingPage';
import { ReservePage } from './pages/ReservePage';
import { ReservationsPage } from './pages/ReservationsPage';
import { AdminRoomsPage } from './pages/admin/AdminRoomsPage';

function App() {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Navbar />

      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/admin/rooms" element={<AdminRoomsPage />} />
        <Route path="/reserve" element={<ReservePage />} />
        <Route path="/reservations" element={<ReservationsPage />} />
      </Routes>
    </Box>
  );
}

export default App;

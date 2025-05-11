import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomeGuest from './pages/HomeGuest';
import HomeAdmin from './pages/HomeAdmin';
import AuthOption from './pages/AuthOption'
import LoginPage from './pages/Login';
import CreateAccount from './pages/CreateAccount';
import HomeUser from './pages/HomeUser';
import RezervaCursa from './pages/RezervaCursa';
import AnuleazaCursa from './pages/AnuleazaCursa';
import UserProfile from './pages/UserProfie';
import AddAutocarPage from './pages/AdaugaAutocar';
import StergeAutocar from './pages/StergeAutocar';
import AdaugaCursa from './pages/AdaugaCursa';
import StergeCursa from './pages/StergeCursa';
import AdaugaLocatie from './pages/AdaugaLocatie';
import StergeLocatie from './pages/StergeLocatie';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomeGuest />} />
        <Route path="/home-companie" element={<HomeAdmin />} />
        <Route path="/AuthOption" element={<AuthOption />} />
        <Route path="/Login" element={<LoginPage />} />
        <Route path="/register" element={<CreateAccount />} />
        <Route path="/home-user" element={<HomeUser />} />
        <Route path="/rezerva-cursa" element={<RezervaCursa />} />
        <Route path="/anuleaza-cursa" element={<AnuleazaCursa />} />
        <Route path="/user-profile" element={<UserProfile />} />
        <Route path="/adauga-autocar" element={<AddAutocarPage />} />
        <Route path="/sterge-autocar" element={<StergeAutocar />} />
        <Route path="/adauga-cursa" element={<AdaugaCursa />} />
        <Route path="/sterge-cursa" element={<StergeCursa />} />
        <Route path="/adauga-locatie" element={<AdaugaLocatie />} />
        <Route path="/sterge-locatie" element={<StergeLocatie />} />
      </Routes>
    </Router>
  );
}

export default App;

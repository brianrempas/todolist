import { BrowserRouter as Router, Route, Routes, Outlet, Navigate } from 'react-router-dom';

import Login from './components/LoginPage';
import Signup from './components/SignupPage';
import ToDoPage from './components/ToDoPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/todo" element={<ToDoPage />} />
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;

import {BrowserRouter, Routes, Route} from 'react-router-dom';
import { QuestionsContextProvider } from './context/QuestionsContext';

// Pages & components
import Home from './pages/Home';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Questions from './pages/Questions'
import RequireAuth from './components/RequireAuth';
import Unauthorized from './pages/Unauthorized';
import PredictionsForm from './components/PredictionsForm';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Navbar />
        <div className="pages">
          <Routes>
            {/* public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* Protect these routes */}
            <Route element={<RequireAuth />}>
              <Route path="/" element={<Home />} />
              <Route path="/unauthorized" element={<Unauthorized />} />
              <Route path="/prospectives/:prospectiveId/form" element={<PredictionsForm />} />
            </Route>

            {/* Only Admin */}
            <Route element={<RequireAuth isAdmin={true}/>}>
              <Route path="/questions" element={<QuestionsContextProvider><Questions /></QuestionsContextProvider>} />
            </Route>
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;

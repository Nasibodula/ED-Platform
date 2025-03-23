import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Homepage from "./pages/Homepage";
import Footer from "./components/Footer";
import NewsLetter from "./components/NewsLetter";
import FeaturesPage from "./pages/FeaturesPage";
import AboutPage from "./pages/AboutPage";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import TranslationTool from "./pages/ChatbotPage";

function App() {
  return (
    <div className="App">
      <Router>
        <Navbar/>
        <Routes>
          <Route path='/'  element={<Homepage/>}/>
          <Route path="/chatbotpage" element = {<TranslationTool/>}/>
          <Route path='/featurespage'  element={<FeaturesPage/>}/>
          <Route path='/servicespage'  element={<AboutPage/>}/>
          <Route path="/get-started" element = {<LoginPage/>}/>
          <Route path="/dashboard" element = {<Dashboard/>}/>
        </Routes>
        <NewsLetter/>
        <Footer/>
      </Router>
    </div>
  );
}

export default App;

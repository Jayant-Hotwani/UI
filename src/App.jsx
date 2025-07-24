import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import Dashboard from "./components/Dashboard";
import Budgeting from "./components/Budgeting";
import Wallet from "./components/Wallet";
import Community from "./components/Community";
import Profile from "./components/Profile";
import Contact from "./components/Contact";
import ChatBotWidget from "./components/ChatBotWidget"; 
import { useState } from "react";
import Planning from "./components/Planning";
import FinancialInclusion from "./components/FinancialInclusion";

function App() {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <Router>
      <div className={darkMode ? "dark" : ""}>
        <div className="relative flex w-screen h-screen overflow-hidden bg-gray-100 dark:bg-gray-900">
          <Sidebar />
          <div className="flex flex-col flex-1 w-full overflow-hidden">
            <Navbar toggleDark={() => setDarkMode(!darkMode)} />
            <main className="flex-1 w-full p-4 overflow-auto">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/budgeting" element={<Budgeting />} />
                <Route path="/planning" element={<Planning />} />
                <Route path="/inclusion" element={<FinancialInclusion />} />
                <Route path="/goals" element={<Community />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/contact" element={<Contact />} />
              </Routes>
            </main>
          </div>

          {/* Chatbot floating widget */}
          <ChatBotWidget />
        </div>
      </div>
    </Router>
  );
}

export default App;

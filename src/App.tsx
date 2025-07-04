import { Provider } from 'react-redux';
import { store } from './store/store';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CreateEmployee from './pages/CreateEmployee/CreateEmployee';
import CurrentEmployees from './pages/CurrentEmployees/CurrentEmployees';
import Header from './components/layout/Header/Header';
import Footer from './components/layout/Footer/Footer';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <div className="App">
          <Header />
          <main>
            <Routes>
              <Route path="/" element={<CreateEmployee />} />
              <Route path="/current-employees" element={<CurrentEmployees />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </Provider>
  );
}

export default App
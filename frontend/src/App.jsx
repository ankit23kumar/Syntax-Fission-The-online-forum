// src/App.jsx

import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';

const App = () => {
  return (
    <Router>
      {/* AppRoutes will now handle ALL page rendering and layout logic */}
      <AppRoutes />
    </Router>
  );
}

export default App;
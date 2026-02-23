import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import AddDocument from "./pages/AddDocument";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />   
      {/* When the user navigates to the root URL ("/"), the Login component will be rendered. */}
      <Route path="/register" element={<Register />} />
      {/* When the user navigates to "/register", the Register component will be rendered. */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      {/* When the user navigates to "/dashboard", the Dashboard component will be rendered. */}
      <Route
        path="/add-document"
        element={
          <ProtectedRoute>
            <AddDocument />
          </ProtectedRoute>
        }
      />
      
    </Routes>
  );
}

// the "element" prop in each Route component specifies which React component should be rendered when the user navigates to the corresponding path. For example, when the user goes to "/register", the Register component will be displayed on the screen. This setup allows for client-side routing in a React application, enabling smooth navigation between different pages without needing to reload the entire page from the server.
export default App

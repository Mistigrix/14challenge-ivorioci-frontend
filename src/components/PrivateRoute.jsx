// Composant de protection des routes privees
// Redirige vers /login si aucun token n'est present dans le localStorage

import { Navigate } from 'react-router-dom';

export default function PrivateRoute({ children }) {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" replace />;
}

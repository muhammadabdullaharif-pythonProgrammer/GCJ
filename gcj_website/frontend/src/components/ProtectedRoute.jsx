import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

function getSession() {
  try {
    const raw = localStorage.getItem('gcj_session');
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export default function ProtectedRoute({ allowedRoles }) {
  const session = getSession();
  const role = session?.role;
  const isAuthed = Boolean(session?.token);

  if (!isAuthed) {
    return <Navigate to="/portal/login" replace />;
  }

  if (allowedRoles && allowedRoles.length && !allowedRoles.includes(role)) {
    return <Navigate to={`/portal/login`} replace />;
  }

  return <Outlet />;
}


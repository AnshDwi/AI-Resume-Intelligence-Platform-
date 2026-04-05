import { Navigate, Outlet, useOutletContext } from "react-router-dom";

function RoleBasedRoute({ allowedRoles = [] }) {
  const context = useOutletContext();
  const authenticated = context?.authenticated;
  const user = context?.user;

  if (!context) {
    return <Outlet />;
  }

  if (!authenticated) {
    return <Outlet />;
  }

  if (!user?.role || !allowedRoles.includes(user.role)) {
    return <Navigate to="/app/resume" replace />;
  }

  return <Outlet />;
}

export default RoleBasedRoute;

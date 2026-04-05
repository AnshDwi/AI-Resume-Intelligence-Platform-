import { Outlet, useOutletContext } from "react-router-dom";

function RoleBasedLayout() {
  const context = useOutletContext();
  return <Outlet context={context} />;
}

export default RoleBasedLayout;

import Header from "../header";
import { Outlet } from "react-router-dom";

const index = () => {
  return (
    <>
      <Header />
      <Outlet />
    </>
  );
};

export default index;

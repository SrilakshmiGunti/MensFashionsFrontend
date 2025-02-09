import { Outlet } from "react-router-dom";
import logo from '../../assets/logo.png'; // Adjust the path as needed

function AuthLayout() {
  return (
    <div className="flex min-h-screen w-full">
      <div className="hidden lg:flex w-1/2 bg-white items-center justify-center px-12">
        <div className="max-w-md space-y-6 text-center text-primary-foreground">
          <img src={logo} alt="logo" className="mx-auto h-40 w-auto" />
          <h1 className="text-4xl font-extrabold tracking-tight text-orange-400">
            Welcome to ECommerce Shopping
          </h1>
        </div>
      </div>
      <div className="flex flex-1 w-1/2 bg-orange-400 items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <Outlet />
      </div>
    </div>
  );
}

export default AuthLayout;
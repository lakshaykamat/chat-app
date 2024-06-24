import React from "react";

const Navbar = (props) => {
  return (
    <nav className="py-5 border-b-2 px-7">
      <div className="flex gap-6">
        <h1 className="text-xl font-bold text-blue-600">{props.appName}</h1>
        <div className="flex items-center gap-6 text-sm">
          {props.routes.map((route) => (
            <a key={route.id} href={route.path}>
              {route.name}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

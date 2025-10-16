import React from "react";
import { BookOpen, LayoutDashboard, History } from "lucide-react";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
  const navItems = [
    { name: "Dashboard", icon: LayoutDashboard, path: "/library" },
    { name: "Books", icon: BookOpen, path: "/bookslist" },
    { name: "History", icon: History, path: "/history" },
  ];

  return (
    <div className="flex flex-col w-64 bg-white border-r border-gray-200 shadow-lg h-screen fixed">
      <div className="p-6">
        <h1 className="text-3xl font-extrabold text-indigo-700 tracking-wider">
          Read it
        </h1>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center p-3 text-base font-medium rounded-lg transition-colors duration-200 ${
                isActive
                  ? "bg-indigo-100 text-indigo-700"
                  : "text-gray-600 hover:bg-gray-50 hover:text-indigo-600"
              }`
            }
          >
            <item.icon className="w-5 h-5 mr-3" />
            {item.name}
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;

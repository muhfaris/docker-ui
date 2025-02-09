import React, { useState } from "react";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";
import { useLogout } from "../hooks/useLogout";

const Sidebar: React.FC = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isDockerOpen, setDockerOpen] = useState(false);
  const logoutHandler = useLogout();

  return (
    <>
      {/* Toggle button for mobile */}
      <button
        onClick={() => setSidebarOpen(!isSidebarOpen)}
        className="sm:hidden p-2 bg-gray-800 text-white fixed top-0 left-0 m-2 z-50"
      >
        Menu
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed sm:relative w-64 bg-gray-800 text-white p-4 z-40 transform ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          } sm:translate-x-0 transition-transform duration-200 ease-in-out`}
      >
        <nav>
          <ul className="space-y-2">
            <li>
              <a
                href="/dashboard"
                className="block px-4 py-2 hover:bg-gray-700 rounded"
              >
                Dashboard
              </a>
            </li>
            <li>
              <button
                onClick={() => setDockerOpen(!isDockerOpen)}
                className="w-full text-left block px-4 py-2 hover:bg-gray-700 rounded flex items-center justify-between"
              >
                <span>Docker</span>
                {isDockerOpen ? (
                  <ChevronUpIcon className="h-5 w-5 text-gray-400" />
                ) : (
                  <ChevronDownIcon className="h-5 w-5 text-gray-400" />
                )}
              </button>
              {isDockerOpen && (
                <ul className="ml-4 space-y-1">
                  <li>
                    <a
                      href="/swarms/services"
                      className="block px-4 py-2 hover:bg-gray-700 rounded"
                    >
                      Swarm Services
                    </a>
                  </li>
                </ul>
              )}
            </li>
            <li className="border-t border-gray-300 mt-4 pt-4 flex justify-start items-center">
              <button
                onClick={logoutHandler}
                className="flex px-4 py-2 items-center space-x-2 text-white"
              >
                <span>Logout</span>
              </button>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black opacity-50 sm:hidden z-30"
        />
      )}
    </>
  );
};

export default Sidebar;

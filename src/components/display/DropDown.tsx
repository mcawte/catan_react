import React, { useState } from "react";

interface DropDownInterface {
  id: number;
  name: string;
  onClick: () => void;
}

export default function DropDown({
  options,
}: {
  options: DropDownInterface[];
}) {
  const [showOptions, setShowOptions] = useState(false);
  return (
    <div className="relative">
      <div className="bg-gray-200 flex justify-center items-center">
        <div className="relative inline-block text-left">
          <div>
            <button
              onClick={() => setShowOptions(!showOptions)}
              type="button"
              className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500"
              id="menu-button"
              aria-expanded="true"
              aria-haspopup="true"
            >
              Options
              <svg
                className="-mr-1 ml-2 h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fill-rule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clip-rule="evenodd"
                />
              </svg>
            </button>

            {showOptions && (
              <div
                className="z-50 origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-gray-200 ring-1 ring-black ring-opacity-5 divide-y divide-gray-300 focus:outline-none border-indigo-500 border-solid border-2"
                role="menu"
                aria-orientation="vertical"
                aria-labelledby="menu-button"
                tabIndex={-1}
              >
                {options &&
                  options.map((option) => (
                    <>
                      <div className="py-1" role="none">
                        <div
                          key={option.id}
                          className=" bg-gray-100 text-gray-700 block px-4 py-3 text-sm hover:bg-gray-100 hover:text-gray-900 "
                          tabIndex={-1}
                          role="menuitem"
                          id={`{menu-item-${option.id}`}
                          onClick={option.onClick}
                        >
                          {option.name}
                        </div>
                      </div>
                    </>
                  ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

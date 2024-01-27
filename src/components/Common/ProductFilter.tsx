import useDisclosure from "@hooks/useDisclosure";
import React from "react";
import { BsCheck2, BsFilter } from "react-icons/bs";

function ProductFilter({
  handleFilterSelect,
  currentFilter,
  filters,
}: {
  handleFilterSelect: (filter: string) => void;
  currentFilter: string;
  filters: string[];
}) {
  const {
    isOpen: showFilter,
    toggleModal: setFilterState,
    closeModal,
  } = useDisclosure();

  return (
    <div className="relative">
      <button
        onClick={() => setFilterState()}
        className="hidden md:block border px-4 py-[0.78rem] cursor-pointer border-tangerine rounded-md"
      >
        <BsFilter className="text-2xl text-tangerine" />
      </button>
      {showFilter && (
        <div className="absolute top-14 right-0 bg-white z-50 rounded-xs shadow-card p-3 w-[9rem] min-h-[5rem]">
          <h4 className="text-xs font-medium text-granite_gray2 opacity-50 mb-3">
            Sort By
          </h4>
          <ul className="space-y-3">
            {filters.map((filter) => (
              <li key={filter}>
                <button
                  className={`text-sm capitalize w-full text-left flex items-center justify-between ${
                    currentFilter === filter ? "text-tangerine" : ""
                  }`}
                  onClick={() => {
                    handleFilterSelect(filter);
                    closeModal();
                  }}
                >
                  <span>{filter}</span>
                  {currentFilter === filter && <BsCheck2 />}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default ProductFilter;

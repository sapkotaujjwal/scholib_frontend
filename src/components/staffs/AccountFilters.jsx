import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMoneyBill,
  faHandHoldingUsd,
  faBus,
  faExclamationCircle,
  faPercent,
  faFilter,
  faSearch,
  faChevronDown,
  faChevronUp,
} from "@fortawesome/free-solid-svg-icons";

const AccountFilters = ({ filters, setFilters }) => {
  const [showAmountFilters, setShowAmountFilters] = useState(false);
  const [showQuickFilters, setShowQuickFilters] = useState(false);

  const formatCurrency = (value) => {
    if (!value) return "";
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100">
      {/* Search Group - Always Visible */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center mb-3">
          <FontAwesomeIcon icon={faFilter} className="text-gray-500 mr-2" />
          <h3 className="text-sm font-medium text-gray-700 mb-0">
            Student Filters
          </h3>
        </div>

        <div className="relative">
          <FontAwesomeIcon
            icon={faSearch}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            value={filters.name}
            onChange={(e) => setFilters({ ...filters, name: e.target.value })}
            placeholder="Search by student name..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm"
          />
        </div>
      </div>

      {/* Amount Filters Group - Collapsible */}
      <div className="border-b border-gray-100">
        <button
          onClick={() => setShowAmountFilters(!showAmountFilters)}
          className="w-full p-3 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors"
        >
          <span className="text-sm font-medium text-gray-600">
            Amount Filters
          </span>
          <FontAwesomeIcon
            icon={showAmountFilters ? faChevronUp : faChevronDown}
            className="text-gray-400"
          />
        </button>

        {showAmountFilters && (
          <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4 bg-white">
            {/* Paid Amount */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <FontAwesomeIcon icon={faMoneyBill} className="text-gray-500" />
                <span className="text-sm font-medium text-gray-600">
                  Paid Amount
                </span>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={formatCurrency(filters.minPaid)}
                  onChange={(e) =>
                    setFilters({
                      ...filters,
                      minPaid: e.target.value.replace(/,/g, ""),
                    })
                  }
                  placeholder="Min"
                  className="w-1/2 p-2 border border-gray-200 rounded text-sm"
                />
                <input
                  type="text"
                  value={formatCurrency(filters.maxPaid)}
                  onChange={(e) =>
                    setFilters({
                      ...filters,
                      maxPaid: e.target.value.replace(/,/g, ""),
                    })
                  }
                  placeholder="Max"
                  className="w-1/2 p-2 border border-gray-200 rounded text-sm"
                />
              </div>
            </div>

            {/* Unpaid Amount */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <FontAwesomeIcon
                  icon={faHandHoldingUsd}
                  className="text-gray-500"
                />
                <span className="text-sm font-medium text-gray-600">
                  Unpaid Amount
                </span>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={formatCurrency(filters.minUnpaid)}
                  onChange={(e) =>
                    setFilters({
                      ...filters,
                      minUnpaid: e.target.value.replace(/,/g, ""),
                    })
                  }
                  placeholder="Min"
                  className="w-1/2 p-2 border border-gray-200 rounded text-sm"
                />
                <input
                  type="text"
                  value={formatCurrency(filters.maxUnpaid)}
                  onChange={(e) =>
                    setFilters({
                      ...filters,
                      maxUnpaid: e.target.value.replace(/,/g, ""),
                    })
                  }
                  placeholder="Max"
                  className="w-1/2 p-2 border border-gray-200 rounded text-sm"
                />
              </div>
            </div>

            {/* Bus Fee */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <FontAwesomeIcon icon={faBus} className="text-gray-500" />
                <span className="text-sm font-medium text-gray-600">
                  Bus Fee
                </span>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={formatCurrency(filters.minBus)}
                  onChange={(e) =>
                    setFilters({
                      ...filters,
                      minBus: e.target.value.replace(/,/g, ""),
                    })
                  }
                  placeholder="Min"
                  className="w-1/2 p-2 border border-gray-200 rounded text-sm"
                />
                <input
                  type="text"
                  value={formatCurrency(filters.maxBus)}
                  onChange={(e) =>
                    setFilters({
                      ...filters,
                      maxBus: e.target.value.replace(/,/g, ""),
                    })
                  }
                  placeholder="Max"
                  className="w-1/2 p-2 border border-gray-200 rounded text-sm"
                />
              </div>
            </div>

            {/* Fine */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <FontAwesomeIcon
                  icon={faExclamationCircle}
                  className="text-gray-500"
                />
                <span className="text-sm font-medium text-gray-600">Fine</span>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={formatCurrency(filters.minFine)}
                  onChange={(e) =>
                    setFilters({
                      ...filters,
                      minFine: e.target.value.replace(/,/g, ""),
                    })
                  }
                  placeholder="Min"
                  className="w-1/2 p-2 border border-gray-200 rounded text-sm"
                />
                <input
                  type="text"
                  value={formatCurrency(filters.maxFine)}
                  onChange={(e) =>
                    setFilters({
                      ...filters,
                      maxFine: e.target.value.replace(/,/g, ""),
                    })
                  }
                  placeholder="Max"
                  className="w-1/2 p-2 border border-gray-200 rounded text-sm"
                />
              </div>
            </div>

            {/* Discount */}
            <div className="space-y-2 md:col-span-2">
              <div className="flex items-center space-x-2">
                <FontAwesomeIcon icon={faPercent} className="text-gray-500" />
                <span className="text-sm font-medium text-gray-600">
                  Discount
                </span>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={formatCurrency(filters.minDiscount)}
                  onChange={(e) =>
                    setFilters({
                      ...filters,
                      minDiscount: e.target.value.replace(/,/g, ""),
                    })
                  }
                  placeholder="Min"
                  className="w-1/2 p-2 border border-gray-200 rounded text-sm"
                />
                <input
                  type="text"
                  value={formatCurrency(filters.maxDiscount)}
                  onChange={(e) =>
                    setFilters({
                      ...filters,
                      maxDiscount: e.target.value.replace(/,/g, ""),
                    })
                  }
                  placeholder="Max"
                  className="w-1/2 p-2 border border-gray-200 rounded text-sm"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Quick Filters Group - Collapsible */}
      <div>
        <button
          onClick={() => setShowQuickFilters(!showQuickFilters)}
          className="w-full p-3 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors"
        >
          <span className="text-sm font-medium text-gray-600">
            Quick Filters
          </span>
          <FontAwesomeIcon
            icon={showQuickFilters ? faChevronUp : faChevronDown}
            className="text-gray-400"
          />
        </button>

        {showQuickFilters && (
          <div className="p-4 bg-white">
            {false && (
              <div className="grid grid-cols-2 gap-4">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.hasBusFee}
                    onChange={(e) =>
                      setFilters({ ...filters, hasBusFee: e.target.checked })
                    }
                    className="form-checkbox h-4 w-4 text-blue-500 transition duration-150 ease-in-out"
                  />
                  <span className="ml-2 text-sm text-gray-600 mb-0">
                    Has Bus Fee
                  </span>
                </label>

                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.hasFine}
                    onChange={(e) =>
                      setFilters({ ...filters, hasFine: e.target.checked })
                    }
                    className="form-checkbox h-4 w-4 text-blue-500 transition duration-150 ease-in-out"
                  />
                  <span className="ml-2 text-sm text-gray-600">Has Fine</span>
                </label>

                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.hasDiscount}
                    onChange={(e) =>
                      setFilters({ ...filters, hasDiscount: e.target.checked })
                    }
                    className="form-checkbox h-4 w-4 text-blue-500 transition duration-150 ease-in-out"
                  />
                  <span className="ml-2 text-sm text-gray-600">
                    Has Discount
                  </span>
                </label>

                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.hasUnpaid}
                    onChange={(e) =>
                      setFilters({ ...filters, hasUnpaid: e.target.checked })
                    }
                    className="form-checkbox h-4 w-4 text-blue-500 transition duration-150 ease-in-out"
                  />
                  <span className="ml-2 text-sm text-gray-600">
                    Has Unpaid Balance
                  </span>
                </label>
              </div>
            )}

            {
              <div className="grid grid-cols-2 gap-4">
                <label className="flex0 items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.hasBusFee}
                    onChange={(e) =>
                      setFilters({ ...filters, hasBusFee: e.target.checked })
                    }
                    className="form-checkbox h-4 w-4 text-blue-500 transition duration-150 ease-in-out"
                  />
                  <span className="ml-2 text-sm text-gray-600 flex items-center">
                    Has Bus Fee
                  </span>
                </label>

                <label className="flex0 items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.hasFine}
                    onChange={(e) =>
                      setFilters({ ...filters, hasFine: e.target.checked })
                    }
                    className="form-checkbox h-4 w-4 text-blue-500 transition duration-150 ease-in-out"
                  />
                  <span className="ml-2 text-sm text-gray-600 flex items-center">
                    Has Fine
                  </span>
                </label>

                <label className="flex0 items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.hasDiscount}
                    onChange={(e) =>
                      setFilters({ ...filters, hasDiscount: e.target.checked })
                    }
                    className="form-checkbox h-4 w-4 text-blue-500 transition duration-150 ease-in-out"
                  />
                  <span className="ml-2 text-sm text-gray-600 flex items-center">
                    Has Discount
                  </span>
                </label>

                <label className="flex0 items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.hasUnpaid}
                    onChange={(e) =>
                      setFilters({ ...filters, hasUnpaid: e.target.checked })
                    }
                    className="form-checkbox h-4 w-4 text-blue-500 transition duration-150 ease-in-out"
                  />
                  <span className="ml-2 text-sm text-gray-600 flex items-center">
                    Has Unpaid Balance
                  </span>
                </label>
              </div>
            }
          </div>
        )}
      </div>
    </div>
  );
};

export default AccountFilters;

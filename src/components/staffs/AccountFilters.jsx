import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMoneyBill,
  faHandHoldingUsd,
  faBus,
  faExclamationCircle,
  faPercent,
  faFilter,
} from "@fortawesome/free-solid-svg-icons";

const AccountFilters = ({ filters, setFilters }) => {
  const formatCurrency = (value) => {
    if (!value) return "";
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  return (
    <div className=" rounded-md shadow1 p-8">
      <div className="flex items-center space-x-3 mb-6">
        <FontAwesomeIcon icon={faFilter} className="text-blue-600 text-xl" />
        <h3 className="text-xl font-bold text-gray-800">Account Filters</h3>
      </div>

      {/* Name Filter */}
      <div className="relative group w-full mb-6">
        <input
          type="text"
          value={filters.name}
          onChange={(e) => setFilters({ ...filters, name: e.target.value })}
          placeholder="Search by student name..."
          className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white/50 "
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 ">
        {/* Paid Amount Range */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2 mb-2">
            <FontAwesomeIcon icon={faMoneyBill} className="text-gray-500" />
            <span className="text-sm font-semibold text-gray-700">
              Paid Amount
            </span>
          </div>
          <div className="flex gap-3">
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
              className="w-1/2 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white/50 backdrop-blur-sm"
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
              className="w-1/2 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white/50 backdrop-blur-sm"
            />
          </div>
        </div>

        {/* Unpaid Amount Range */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2 mb-2">
            <FontAwesomeIcon icon={faHandHoldingUsd} className="text-gray-500" />
            <span className="text-sm font-semibold text-gray-700">
              Unpaid Amount
            </span>
          </div>
          <div className="flex gap-3">
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
              className="w-1/2 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-white/50 backdrop-blur-sm"
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
              className="w-1/2 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-white/50 backdrop-blur-sm"
            />
          </div>
        </div>

        {/* Bus Fee Range */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2 mb-2">
            <FontAwesomeIcon icon={faBus} className="text-gray-500" />
            <span className="text-sm font-semibold text-gray-700">Bus Fee</span>
          </div>
          <div className="flex gap-3">
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
              className="w-1/2 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 bg-white/50 backdrop-blur-sm"
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
              className="w-1/2 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 bg-white/50 backdrop-blur-sm"
            />
          </div>
        </div>

        {/* Fine Range */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2 mb-2">
            <FontAwesomeIcon
              icon={faExclamationCircle}
              className="text-gray-500"
            />
            <span className="text-sm font-semibold text-gray-700">Fine</span>
          </div>
          <div className="flex gap-3">
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
              className="w-1/2 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white/50 backdrop-blur-sm"
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
              className="w-1/2 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white/50 backdrop-blur-sm"
            />
          </div>
        </div>

        {/* Discount Range */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2 mb-2">
            <FontAwesomeIcon icon={faPercent} className="text-gray-500" />
            <span className="text-sm font-semibold text-gray-700">
              Discount
            </span>
          </div>
          <div className="flex gap-3">
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
              className="w-1/2 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white/50 backdrop-blur-sm"
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
              className="w-1/2 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white/50 backdrop-blur-sm"
            />
          </div>
        </div>
      </div>

      {/* Quick Filters */}
      <div className="mt-8 p-6 bg-white/70 backdrop-blur-sm rounded-lg shadow-sm">
        <span className="text-sm font-semibold text-gray-700 block mb-4">
          Quick Filters
        </span>
        <div className="flex flex-wrap gap-6">
          <label className="relative inline-flex items-center cursor-pointer group">
            <input
              type="checkbox"
              checked={filters.hasBusFee}
              onChange={(e) =>
                setFilters({ ...filters, hasBusFee: e.target.checked })
              }
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            <span className="ml-3 text-sm font-medium text-gray-600 group-hover:text-gray-800">
              Has Bus Fee
            </span>
          </label>

          <label className="relative inline-flex items-center cursor-pointer group">
            <input
              type="checkbox"
              checked={filters.hasFine}
              onChange={(e) =>
                setFilters({ ...filters, hasFine: e.target.checked })
              }
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            <span className="ml-3 text-sm font-medium text-gray-600 group-hover:text-gray-800">
              Has Fine
            </span>
          </label>

          <label className="relative inline-flex items-center cursor-pointer group">
            <input
              type="checkbox"
              checked={filters.hasDiscount}
              onChange={(e) =>
                setFilters({ ...filters, hasDiscount: e.target.checked })
              }
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            <span className="ml-3 text-sm font-medium text-gray-600 group-hover:text-gray-800">
              Has Discount
            </span>
          </label>

          <label className="relative inline-flex items-center cursor-pointer group">
            <input
              type="checkbox"
              checked={filters.hasUnpaid}
              onChange={(e) =>
                setFilters({ ...filters, hasUnpaid: e.target.checked })
              }
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            <span className="ml-3 text-sm font-medium text-gray-600 group-hover:text-gray-800">
              Has Unpaid Balance
            </span>
          </label>
        </div>
      </div>
    </div>
  );
};

export default AccountFilters;

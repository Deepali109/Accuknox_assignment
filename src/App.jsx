import React, { useMemo, useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import clsx from "clsx";
import { PieChart, Pie, Cell, BarChart } from "recharts";
import {
  addWidget,
  removeWidget,
  addCategory,
  toggleWidgetInCategory,
  removeWidgetFromAllCategories,
} from "./store";
import { initialDashboardData } from "./data";

// small icons
const Plus = ({ className = "w-5 h-5" }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M12 5v14M5 12h14" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const Cross = ({ className = "w-4 h-4" }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path
      d="M6 6l12 12M6 18L18 6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
const Search = ({ className = "w-4 h-4" }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <circle cx="11" cy="11" r="8" />
    <path d="M21 21L16.65 16.65" />
  </svg>
);
const RefreshCw = ({ className = "w-5 h-5" }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
    <path d="M21 3v5h-5" />
    <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
    <path d="M3 21v-5h5" />
  </svg>
);
const MoreVertical = ({ className = "w-5 h-5" }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <circle cx="12" cy="12" r="1" />
    <circle cx="12" cy="5" r="1" />
    <circle cx="12" cy="19" r="1" />
  </svg>
);
const Clock = ({ className = "w-4 h-4" }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <circle cx="12" cy="12" r="10" />
    <polyline points="12,6 12,12 16,14" />
  </svg>
);
const User = ({ className = "w-5 h-5" }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const DonutChart = ({ data, total, showTotal = true }) => (
  <div className="relative flex items-center justify-center">
    <PieChart width={120} height={120}>
      <Pie
        data={data}
        cx={60}
        cy={60}
        innerRadius={35}
        outerRadius={50}
        paddingAngle={2}
        dataKey="value"
      >
        {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={entry.color} />
        ))}
      </Pie>
    </PieChart>

    {showTotal && (
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <div className="text-2xl font-bold text-gray-900">{total}</div>
        <div className="text-xs text-gray-500">Total</div>
      </div>
    )}
  </div>
);

const Legend = ({ data }) => (
  <div className="space-y-2">
    {data.map((item, index) => (
      <div key={index} className="flex items-center text-sm">
        <div
          className="w-3 h-3 rounded-full mr-2"
          style={{ backgroundColor: item.color }}
        ></div>
        <span className="text-gray-700">
          {item.name} ({item.value})
        </span>
      </div>
    ))}
  </div>
);

const EmptyChart = ({ message }) => (
  <div className="flex flex-col items-center justify-center h-32 text-gray-400">
    <BarChart width={60} height={40} />
    <span className="text-sm mt-2">
      {message || "No Graph data available!"}
    </span>
  </div>
);

const MetricWidget = ({ metrics }) => (
  <div className="space-y-3">
    {metrics.map((metric, index) => (
      <div key={index} className="flex justify-between items-center">
        <span className="text-sm text-gray-600">{metric.label}</span>
        <span
          className={clsx(
            "text-sm font-semibold",
            metric.status === "danger" && "text-red-600",
            metric.status === "warning" && "text-amber-600",
            metric.status === "info" && "text-blue-600"
          )}
        >
          {metric.value}
        </span>
      </div>
    ))}
  </div>
);

const AddWidgetPlaceholder = ({ onClick }) => (
  <div className="bg-white rounded-lg border border-gray-200 border-dashed p-6 flex flex-col items-center justify-center min-h-[200px]">
    <button
      onClick={onClick}
      className="flex flex-col items-center text-gray-400 hover:text-gray-600"
    >
      <Plus className="w-8 h-8 mb-2" />
      <span className="text-sm font-medium">Add Widget</span>
    </button>
  </div>
);

export default function App() {
  const dispatch = useDispatch();
  const categories = useSelector((s) => s.categories);
  const widgets = useSelector((s) => s.widgets);

  const [showAddWidget, setShowAddWidget] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedRange, setSelectedRange] = useState("2days");

  const availableWidgetsMap = useMemo(() => {
    if (initialDashboardData && initialDashboardData.availableWidgets) {
      return initialDashboardData.availableWidgets;
    }

    const fallback = {};
    (categories || []).forEach((c) => {
      fallback[c.id] = (widgets || []).map((w) => ({
        id: w.id,
        name: w.name,
        text: w.text,
      }));
    });
    // if there are no categories but there are widgets, create a default group
    if (Object.keys(fallback).length === 0 && widgets && widgets.length > 0) {
      fallback["all"] = widgets.map((w) => ({
        id: w.id,
        name: w.name,
        text: w.text,
      }));
    }
    return fallback;
  }, [categories, widgets]);

  const tabKeys = useMemo(
    () => Object.keys(availableWidgetsMap || {}),
    [availableWidgetsMap]
  );

  const tabKeyToCategoryId = useMemo(() => {
    const map = {};
    tabKeys.forEach((k) => {
      const cat = (categories || []).find(
        (c) =>
          c.id?.toLowerCase() === k.toLowerCase() ||
          c.name?.toLowerCase().includes(k.toLowerCase()) ||
          k.toLowerCase().includes(c.id?.toLowerCase?.() || "")
      );
      map[k] = cat ? cat.id : null;
    });
    return map;
  }, [tabKeys, categories]);

  // activeTab initial safe value
  const [activeTab, setActiveTab] = useState(() => {
    if (tabKeys && tabKeys.length) return tabKeys[0];
    if (categories && categories.length) return categories[0].id;
    return "";
  });

  // ensure activeTab updates when available keys change
  useEffect(() => {
    if (tabKeys.length && !tabKeys.includes(activeTab)) {
      setActiveTab(tabKeys[0]);
    }
  }, [tabKeys, activeTab]);

  const [modalSelections, setModalSelections] = useState({});

  useEffect(() => {
    if (!showAddWidget) return;
    const initial = {};
    tabKeys.forEach((k) => {
      const catId = tabKeyToCategoryId[k];
      const cat = (categories || []).find((c) => c.id === catId);

      initial[k] = new Set(cat ? cat.widgetIds : []);
    });
    setModalSelections(initial);
  }, [showAddWidget, tabKeys, tabKeyToCategoryId, categories]);

  const searchResults = useMemo(() => {
    if (!search.trim()) return [];
    const s = search.toLowerCase();
    return (widgets || []).filter(
      (w) =>
        (w.name || "").toLowerCase().includes(s) ||
        (w.text || "").toLowerCase().includes(s)
    );
  }, [search, widgets]);

  function onRemoveWidget(id) {
    if (!window.confirm("Remove this widget entirely?")) return;
    dispatch(removeWidget(id));
    dispatch(removeWidgetFromAllCategories(id));
  }

  function toggleLocalSelection(tabKey, widgetId) {
    setModalSelections((prev) => {
      const copy = { ...prev };
      const set = new Set(copy[tabKey] || []);
      if (set.has(widgetId)) set.delete(widgetId);
      else set.add(widgetId);
      copy[tabKey] = set;
      return copy;
    });
  }

  function applyModalSelectionsAndClose() {
    Object.keys(modalSelections || {}).forEach((tabKey) => {
      const catId = tabKeyToCategoryId[tabKey];
      if (!catId) return; // no category match for this tabKey
      const cat = (categories || []).find((c) => c.id === catId);
      const current = new Set(cat ? cat.widgetIds : []);
      const desired = modalSelections[tabKey] || new Set();
      // add new
      desired.forEach((wId) => {
        if (!current.has(wId))
          dispatch(
            toggleWidgetInCategory({ categoryId: catId, widgetId: wId })
          );
      });
      // remove unchecked
      current.forEach((wId) => {
        if (!desired.has(wId))
          dispatch(
            toggleWidgetInCategory({ categoryId: catId, widgetId: wId })
          );
      });
    });

    setShowAddWidget(false);
  }

  const renderWidget = (widget) => {
    if (!widget.data) {
      return (
        <div key={widget.id} className="bg-white p-4 rounded shadow relative">
          <button
            onClick={() => onRemoveWidget(widget.id)}
            className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
          >
            <Cross />
          </button>
          <h3 className="font-semibold">{widget.name}</h3>
          <div className="text-sm mt-2">{widget.text}</div>
        </div>
      );
    }

    return (
      <div
        key={widget.id}
        className="bg-white rounded-lg border border-gray-200 p-6"
      >
        <div className="flex items-start justify-between mb-4">
          <h3 className="font-medium text-gray-900">{widget.name}</h3>
          <button
            onClick={() => onRemoveWidget(widget.id)}
            className="text-gray-400 hover:text-gray-600"
          >
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>

        {widget.data.type === "donut" && (
          <div className="flex items-center space-x-6">
            <DonutChart
              data={widget.data.chartData}
              total={widget.data.total}
            />
            <Legend data={widget.data.chartData} />
          </div>
        )}

        {widget.data.type === "metric" && (
          <MetricWidget metrics={widget.data.metrics} />
        )}
        {widget.data.type === "empty" && (
          <EmptyChart message={widget.data.emptyMessage} />
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center text-sm text-gray-500">
          <span>Home</span>
          <span className="mx-2">›</span>
          <span className="text-gray-900 font-medium">Dashboard V2</span>
        </div>

        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 w-72"
              placeholder="Search anything..."
            />
          </div>

          <button
            onClick={() => setShowAddWidget(true)}
            className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Widget
          </button>

          <button className="p-2 text-gray-400 hover:text-gray-600">
            <RefreshCw />
          </button>

          <select
            value={selectedRange}
            onChange={(e) => setSelectedRange(e.target.value)}
            className="px-3 py-2 border rounded-md text-blue-700 font-medium"
          >
            <option value="24h">Last 24 hours</option>
            <option value="2days">Last 2 days</option>
            <option value="7days">Last 7 days</option>
            <option value="30days">Last 30 days</option>
          </select>

          <button className="p-2 text-gray-400 hover:text-gray-600">
            <User />
          </button>
        </div>
      </header>

      {/* Main */}
      <main className="px-6 py-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">
          CNAPP Dashboard
        </h1>

        {search.trim() ? (
          <div>
            <h2 className="text-lg font-semibold mb-3">
              Search results for "{search}"
            </h2>
            {searchResults.length === 0 ? (
              <div className="p-4 bg-yellow-50 rounded">No widgets found</div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {searchResults.map((w) => renderWidget(w))}
              </div>
            )}
          </div>
        ) : (
          (categories || []).map((category) => {
            const categoryWidgets = (category.widgetIds || [])
              .map((id) => (widgets || []).find((w) => w.id === id))
              .filter(Boolean);
            return (
              <section key={category.id} className="mb-8">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">
                  {category.name}
                </h2>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {categoryWidgets.map((widget) => renderWidget(widget))}
                  <AddWidgetPlaceholder
                    onClick={() => setShowAddWidget(true)}
                  />
                </div>
              </section>
            );
          })
        )}
      </main>

      {/* Add Widget Modal */}
      {showAddWidget && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-[700px] max-h-[90vh] flex flex-col">
            {/* header */}
            <div className="flex justify-between items-center border-b px-6 py-4 bg-blue-900 text-white rounded-t-lg">
              <h3 className="text-lg font-semibold">Add Widget</h3>
              <button
                onClick={() => setShowAddWidget(false)}
                className="text-white text-xl leading-none"
              >
                ✕
              </button>
            </div>

            {/* tabs */}
            <div className="border-b px-6">
              <div className="flex space-x-6">
                {tabKeys.map((k) => (
                  <button
                    key={k}
                    onClick={() => setActiveTab(k)}
                    className={`py-2 font-medium ${
                      activeTab === k
                        ? "border-b-2 border-blue-600 text-blue-600"
                        : "text-gray-600"
                    }`}
                  >
                    {k}
                  </button>
                ))}
              </div>
            </div>

            {/* list (local selections only) */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-2">
              {(availableWidgetsMap[activeTab] || []).map((w) => {
                const checked = (modalSelections[activeTab] || new Set()).has(
                  w.id
                );
                return (
                  <label
                    key={w.id}
                    className="flex items-center justify-between px-3 py-2 border rounded hover:bg-gray-50"
                  >
                    <div className="flex flex-col">
                      <span className="font-medium">{w.name}</span>
                      {w.text && (
                        <span className="text-xs text-gray-500">{w.text}</span>
                      )}
                    </div>
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleLocalSelection(activeTab, w.id)}
                    />
                  </label>
                );
              })}
              {(availableWidgetsMap[activeTab] || []).length === 0 && (
                <div className="text-gray-500">
                  No widgets available for this category.
                </div>
              )}
            </div>

            {/* footer */}
            <div className="flex justify-end gap-3 border-t px-6 py-4 bg-gray-50">
              <button
                onClick={() => setShowAddWidget(false)}
                className="px-4 py-2 border rounded hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={applyModalSelectionsAndClose}
                className="px-4 py-2 bg-blue-900 text-white rounded hover:bg-blue-800"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// src/data.js

export const initialDashboardData = {
  widgets: [
    {
      id: "cloud-accounts",
      name: "Cloud Accounts",
      text: "Overview of cloud account connections",
      data: {
        type: "donut",
        total: 2,
        chartData: [
          { name: "Connected", value: 2, color: "#3b82f6" },
          { name: "Not Connected", value: 2, color: "#e5e7eb" },
        ],
      },
    },
    {
      id: "cloud-risk-assessment",
      name: "Cloud Account Risk Assessment",
      text: "Risk assessment metrics for cloud accounts",
      data: {
        type: "donut",
        total: 9659,
        chartData: [
          { name: "Failed", value: 1689, color: "#ef4444" },
          { name: "Warning", value: 681, color: "#f59e0b" },
          { name: "Not available", value: 36, color: "#6b7280" },
          { name: "Passed", value: 7253, color: "#10b981" },
        ],
      },
    },
    {
      id: "namespace-alerts",
      name: "Top 5 Namespace Specific Alerts",
      text: "Most critical namespace alerts",
      data: {
        type: "empty",
        emptyMessage: "No Graph data available!",
      },
    },
    {
      id: "workload-alerts",
      name: "Workload Alerts",
      text: "Current workload alert status",
      data: {
        type: "empty",
        emptyMessage: "No Graph data available!",
      },
    },
    {
      id: "image-risk",
      name: "Image Risk Assessment",
      text: "Container image vulnerability assessment",
      data: {
        type: "metric",
        metrics: [
          { label: "Total Vulnerabilities", value: "1470", status: "info" },
          { label: "Critical", value: "9", status: "danger" },
          { label: "High", value: "150", status: "warning" },
        ],
      },
    },
    {
      id: "image-security",
      name: "Image Security Issues",
      text: "Security issues found in container images",
      data: {
        type: "metric",
        metrics: [
          { label: "Total Images", value: "2", status: "info" },
          { label: "Critical", value: "2", status: "danger" },
          { label: "High", value: "2", status: "warning" },
        ],
      },
    },
  ],
  categories: [
    {
      id: "cspm",
      name: "CSPM Executive Dashboard",
      widgetIds: ["cloud-accounts", "cloud-risk-assessment"],
    },
    {
      id: "cwpp",
      name: "CWPP Dashboard",
      widgetIds: ["namespace-alerts", "workload-alerts"],
    },
    {
      id: "registry",
      name: "Registry Scan",
      widgetIds: ["image-risk", "image-security"],
    },
  ],
};

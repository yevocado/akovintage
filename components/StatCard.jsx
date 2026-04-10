import React from "react";

export default function StatCard({ icon: Icon, label, value, trend, color }) {
  return (
    <div className="bg-white p-6 rounded-[14px] border border-ako-border shadow-[0_1px_4px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.07)] transition-shadow duration-200">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-2 rounded-lg ${color}`}>
          <Icon size={22} className="text-white" />
        </div>
        {trend !== undefined && (
          <span
            className={`text-xs font-bold px-2 py-1 rounded-full ${
              trend > 0
                ? "bg-[#E8F4E8] text-ako-success"
                : "bg-[#FDE8E8] text-ako-error"
            }`}
          >
            {trend > 0 ? "+" : ""}{trend}%
          </span>
        )}
      </div>
      <p className="text-ako-textLight text-xs font-medium uppercase tracking-wider">{label}</p>
      <h3 className="text-[20px] font-bold text-ako-text mt-1">{value}</h3>
    </div>
  );
}

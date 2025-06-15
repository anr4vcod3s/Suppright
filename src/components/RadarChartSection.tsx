import React from "react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface AminoAcidData {
  amino: string;
  [productName: string]: string | number;
}

interface RadarChartSectionProps {
  data: AminoAcidData[];
  productNames: string[];
  colors: string[];
}

const RadarChartSection: React.FC<RadarChartSectionProps> = ({
  data,
  productNames,
  colors,
}) => {
  if (!data || data.length === 0) {
    return (
      <div className="p-12 text-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-800 dark:via-gray-800 dark:to-gray-900">
        <div className="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm border border-white/20 dark:border-gray-600/20">
          <svg
            className="w-8 h-8 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
        </div>
        <p className="text-gray-600 dark:text-gray-400 font-medium">
          No amino acid data available for comparison
        </p>
      </div>
    );
  }

  // Create slightly offset data for overlapping profiles
  const offsetData = data.map((item) => {
    const offsetItem = { ...item };
    productNames.forEach((productName, productIndex) => {
      const originalValue = Number(item[productName]) || 0;
      const offset = originalValue * 0.001 * (productIndex + 1);
      offsetItem[productName] = originalValue + offset;
    });
    return offsetItem;
  });

  return (
    <div className="relative overflow-hidden">
      {/* Background with gradient and subtle pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-800 dark:via-gray-800 dark:to-gray-900">
        <div className="absolute inset-0 bg-grid-slate-100 dark:bg-grid-slate-700/25 bg-[size:20px_20px] opacity-50" />
        <div className="absolute inset-0 bg-gradient-to-t from-white/50 via-transparent to-transparent dark:from-gray-800/50" />
      </div>

      {/* Content container with proper spacing */}
      <div className="relative z-10 px-8 py-4">
        {/* Header section with glassmorphism effect */}
        <div className="flex items-center justify-center space-x-4">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-white/60 dark:bg-gray-700/40 backdrop-blur-sm border border-white/20 dark:border-gray-600/20 shadow-lg">
            <svg
              className="w-6 h-6 text-blue-600 dark:text-blue-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
              />
            </svg>
          </div>

          <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent mb-0">
            Amino Acid Profile Comparison
          </h3>
        </div>

        <div className="space-y-1 justify-self-center">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
            Essential amino acids per serving (grams)
          </p>
        </div>
      </div>

      {/* Chart container with enhanced styling */}
      <div className="relative">
        <div className="absolute inset-8 bg-white/40 dark:bg-gray-800/40 backdrop-blur-sm rounded-2xl border border-white/20 dark:border-gray-700/20 shadow-xl" />

        <div className="relative z-10 p-6 rounded-2xl">
          <div className="h-[500px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart
                data={offsetData}
                margin={{ top: 40, right: 100, bottom: 40, left: 100 }}
              >
                <PolarGrid
                  strokeDasharray="3 3"
                  stroke="currentColor"
                  className="text-gray-300 dark:text-gray-600"
                  radialLines={true}
                />
                <PolarAngleAxis
                  dataKey="amino"
                  tick={{
                    fontSize: 13,
                    fill: "currentColor",
                    fontWeight: 500,
                  }}
                  className="text-gray-700 dark:text-gray-300"
                  tickFormatter={(value) =>
                    value.length > 10 ? `${value.substring(0, 8)}...` : value
                  }
                />
                <PolarRadiusAxis
                  angle={90}
                  domain={[0, "dataMax"]}
                  tick={{
                    fontSize: 11,
                    fill: "currentColor",
                    fontWeight: 400,
                  }}
                  className="text-gray-500 dark:text-gray-400"
                  strokeDasharray="2 2"
                  tickCount={5}
                />
                {productNames.map((productName, index) => (
                  <Radar
                    key={productName}
                    name={productName}
                    dataKey={productName}
                    stroke={colors[index]}
                    fill={colors[index]}
                    fillOpacity={index === 0 ? 0.12 : 0.06}
                    strokeWidth={index === 0 ? 4 : 3}
                    strokeDasharray={
                      index === 0
                        ? "0"
                        : index === 1
                        ? "10 5"
                        : index === 2
                        ? "5 3"
                        : "3 3"
                    }
                    dot={{
                      r: index === 0 ? 6 : 4,
                      strokeWidth: 3,
                      fill: colors[index],
                      stroke: "#ffffff",
                      style: {
                        filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))",
                      },
                    }}
                    activeDot={{
                      r: 8,
                      strokeWidth: 3,
                      stroke: "#ffffff",
                      style: {
                        filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.2))",
                      },
                    }}
                  />
                ))}
                <Legend
                  wrapperStyle={{
                    paddingTop: "30px",
                    fontSize: "13px",
                    fontWeight: "500",
                  }}
                  iconType="line"
                  formatter={(value) => (
                    <span className="text-gray-700 dark:text-gray-300">
                      {value}
                    </span>
                  )}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RadarChartSection;

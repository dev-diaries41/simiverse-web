import { ChartData } from "@/app/types";
import { Data, PlotType } from "plotly.js-dist-min";
import { camelCaseToWords } from "./helpers";


export function formatChartLayout(chartTitle: string, chartData: ChartData) {
  return {
    responsive: true,
    title: chartTitle,
    xaxis: {
      title: chartData.xLabel,
      automargin: true,
      tickfont: {
        size: 10,
        color: 'black',
      },
    },
    yaxis: {
      title: chartData.yLabel,
      automargin: true,
    },
  };
}

    
    export const jsonToChartData = <T extends Record<string, any>>(
      data: T[],
      xKey: keyof T,
      yKeys: Array<keyof T | `${string}.${string}`>
    ): Data[] => {
      // Helper function to resolve nested keys
      const getNestedValue = (obj: Record<string, any>, key: string): any => {
        return key.split('.').reduce((acc, part) => (acc && acc[part] !== undefined ? acc[part] : null), obj);
      };
    
      const xValues = data.map((outcome) => getNestedValue(outcome, String(xKey)));
    
      return yKeys.map((yKey) => {
        const yValues = data.map((outcome) => getNestedValue(outcome, String(yKey)));
    
        return {
          x: xValues,
          y: yValues,
          type: 'scatter',
          mode: 'lines+markers',
          name: camelCaseToWords(String(yKey)), // Optional: Convert camelCase to human-readable names
        };
      });
    };
    
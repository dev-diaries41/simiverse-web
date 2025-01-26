'use client'
import React, { useEffect, useRef } from 'react';

type ChartProps = {
  /**
   * The data to be plotted. Refer to Plotly's `data` object documentation for more details.
   * https://plotly.com/javascript/reference/
   */
  data: Plotly.Data[];

  /**
   * Layout options for the chart. Refer to Plotly's `layout` object documentation for customization.
   * https://plotly.com/javascript/reference/
   */
  layout?: Partial<Plotly.Layout>;

  /**
   * Configuration options for the chart. Refer to Plotly's `config` object documentation for customization.
   * https://plotly.com/javascript/configuration-options/
   */
  config?: Partial<Plotly.Config>;

  /**
   * Style options for the chart container.
   */
  style?: React.CSSProperties;

  /**
   * Class name for the chart container.
   */
  className?: string;
};

/**
 * A reusable and agnostic Chart component using Plotly.js.
 */
const Chart: React.FC<ChartProps> = ({ data, layout, config, style, className }) => {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const Plotly = require('plotly.js-dist-min');
    if (chartRef.current) {
      Plotly.newPlot(chartRef.current, data, layout, config);

      return () => {
        if (chartRef?.current) {
          Plotly.purge(chartRef.current);
        }      
      };
    }
  }, [data, layout, config]);

  return <div  ref={chartRef} style={style} className={className}></div>;
};

export default Chart;

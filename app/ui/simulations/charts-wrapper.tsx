'use client'
import {useMemo } from 'react';
import Chart from '../common/chart';
import { jsonToChartData } from '@/app/lib/chart';
import { SurvivalStats } from 'simiverse';

interface ChartsWrapperProps {
  outcomes: SurvivalStats[];
  isExpanded: boolean
  panelWidth?: number;
}

export const ChartsWrapper = ({ outcomes, isExpanded, panelWidth }: ChartsWrapperProps) => {

  const chartData = useMemo(() => {
    return {
        population: jsonToChartData(outcomes, 'year', ['globalPopulation']),
        resources: jsonToChartData(outcomes, 'year', [
            'globalResources.food',
            'globalResources.water',
            'globalResources.energy',
        ]),
        choices: jsonToChartData(outcomes, 'year', ['cooperations', 'defections']),
    };
}, [outcomes]);

  const populationData = chartData.population;
  const resourcesData = chartData.resources;
  const choicesData = chartData.choices;

  // Neon color palette for the lines and markers
  const neonColors = ['#39FF14', '#00FFFF', '#FF1493', '#FF4500', '#9400D3'];

  const chartStyle = {
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Transparent black background
    paper_bgcolor: 'rgba(0, 0, 0, 0.3)',  // For Plotly chart paper background
    plot_bgcolor: 'rgba(0, 0, 0, 0)',  // For Plotly plot background
    font: { color: '#FFF' },  // Green font for a digital look
  };

  return (
    <div className={`w-full grid ${isExpanded ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'} gap-8 p-4`}>
      {resourcesData && (
        <Chart
          data={resourcesData}
          layout={{
            title: 'Resources Over Time',
            xaxis: { title: 'Year', tickcolor: '#00FF00' },
            yaxis: { title: 'Resources', tickcolor: '#00FF00' },
            ...chartStyle,
          }}
          config={{
            responsive: true,
          }}
          className="w-full h-[500px]"
        />
      )}
      {choicesData && (
        <Chart
          data={choicesData.map((data, index) => ({
            ...data,
            marker: { color: neonColors[index % neonColors.length] },  // Assign neon color to each trace
          }))}
          layout={{
            title: 'Global Cooperation and Defection Over Time',
            xaxis: { title: 'Year', tickcolor: '#00FF00' },
            yaxis: { title: 'Count', tickcolor: '#00FF00' },
            ...chartStyle,
          }}
          config={{
            responsive: true,
          }}
          className="w-full h-[500px]"
        />
      )}
      {populationData && (
        <Chart
          data={populationData}
          layout={{
            title: 'Population Changes Over Time',
            xaxis: { title: 'Year', tickcolor: '#00FF00' },
            yaxis: { title: 'Population', tickcolor: '#00FF00' },
            ...chartStyle,
          }}
          config={{
            responsive: true,
          }}
          className="w-full h-[500px]"
        />
      )}
    </div>
  );
};

export default ChartsWrapper;

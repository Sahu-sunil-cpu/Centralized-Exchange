
import { AreaSeries, createChart, ColorType } from 'lightweight-charts';
import React, { useEffect, useRef } from 'react';

export const ChartComponent = props => {
  const {
    data,
    colors: {
      backgroundColor = 'white',
      lineColor = '#2962FF',
      textColor = 'black',
      areaTopColor = '#2962FF',
      areaBottomColor = 'rgba(41, 98, 255, 0.28)',
    } = {},
  } = props;

  const chartContainerRef = useRef();

  useEffect(
    () => {
      const handleResize = () => {
        //@ts-ignore
        chart.applyOptions({ width: chartContainerRef.current.clientWidth });
      };

      const chart = createChart(chartContainerRef.current, {
        layout: {
          background: { type: ColorType.Solid, color: backgroundColor },
          textColor,
        },
        //@ts-ignore

        width: chartContainerRef.current.clientWidth,
        height: 400,
      });
      chart.timeScale().fitContent();

      const newSeries = chart.addSeries(AreaSeries, { lineColor, topColor: areaTopColor, bottomColor: areaBottomColor });
      newSeries.setData(data);

      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);

        chart.remove();
      };
    },
    [data, backgroundColor, lineColor, textColor, areaTopColor, areaBottomColor]
  );

  return (
    <div
      ref={chartContainerRef}
    />
  );
};

const initialData = [
  { time: '2018-12-22', value: 32.5 },
  { time: '2018-12-23', value: 32.0 },
  { time: '2018-12-24', value: 31.5 },
  { time: '2018-12-25', value: 31.6 },
  { time: '2018-12-26', value: 31.1 },
  { time: '2018-12-27', value: 31.6 },
  { time: '2018-12-28', value: 31.1 },
  { time: '2018-12-29', value: 30.6 },
  { time: '2018-12-30', value: 30.1 },
  { time: '2018-12-31', value: 29.6 }
];

export function TradingViewChart(props) {
  return (
    <ChartComponent {...props} data={initialData}></ChartComponent>
  );
}

function generateTimeSeries(startTime, count) {
  const data = [];
  let currentTime = new Date(startTime).getTime();
  let value = 30.0; // starting value

  for (let i = 0; i < count; i++) {
    // Push time in ISO format and rounded value
    data.push({
      time: new Date(currentTime).toISOString(),
      value: parseFloat(value.toFixed(2))
    });

    // Increment time by 5 seconds
    currentTime += 5000;

    // Simulate small change in value (±0.1 to ±0.5)
    const change = (Math.random() * 0.4 + 0.1) * (Math.random() < 0.5 ? -1 : 1);
    value += change;
  }

  return data;
}

// Example usage:
const realTimeData = generateTimeSeries('2025-06-24T18:00:00Z', 10);
console.log(realTimeData);

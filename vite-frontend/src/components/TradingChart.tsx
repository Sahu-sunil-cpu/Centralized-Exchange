
import { AreaSeries, createChart, ColorType, CandlestickSeries, CrosshairMode, LineStyle } from 'lightweight-charts';
import React, { useEffect, useRef } from 'react';

export const ChartComponent = props => {
  const {
    data,
    colors: {
      backgroundColor = '#1e293b',
      lineColor = '#2962FF',
      textColor = 'white',
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
        grid: {
          vertLines: { color: "#444" },
          horzLines: { color: "#444" },
        },
      });

      chart.timeScale().applyOptions({
        barSpacing: 10,
      });

      chart.applyOptions({
        crosshair: {
          // Change mode from default 'magnet' to 'normal'.
          // Allows the crosshair to move freely without snapping to datapoints
          mode: CrosshairMode.Normal,

          // Vertical crosshair line (showing Date in Label)
          vertLine: {
            width: 4,
            color: "#C3BCDB44",
            style: LineStyle.Solid,
            labelBackgroundColor: "#9B7DFF",
          },

          // Horizontal crosshair line (showing Price in Label)
          horzLine: {
            color: "#9B7DFF",
            labelBackgroundColor: "#9B7DFF",
          },
        },
      });

      chart.timeScale().applyOptions({
        borderColor: "#71649C",
      });

      const series = chart.addSeries(CandlestickSeries, {
        upColor: '#26a69a',
        downColor: '#ef5350',
        borderVisible: false,
        wickUpColor: '#26a69a',
        wickDownColor: '#ef5350',
      });

      const data = generateData(2500, 20, 1000);
      series.setData(data.initialData);
      chart.timeScale().fitContent();

      //@ts-ignore
      chart.timeScale().scrollToPosition(5);
      // simulate real-time data
      function* getNextRealtimeUpdate(realtimeData) {
        for (const dataPoint of realtimeData) {
          yield dataPoint;
        }
        return null;
      }
      const streamingDataProvider = getNextRealtimeUpdate(data.realtimeUpdates);

      const lineData = data.initialData.map((datapoint) => ({
        time: datapoint.time,
        value: (datapoint.close + datapoint.open) / 2,
      }));

      // Add an area series to the chart,
      // Adding this before we add the candlestick chart
      // so that it will appear beneath the candlesticks
      const areaSeries = chart.addSeries(AreaSeries, {
        lastValueVisible: false, // hide the last value marker for this series
        crosshairMarkerVisible: false, // hide the crosshair marker for this series
        lineColor: "transparent", // hide the line
        topColor: "rgba(56, 33, 110,0.6)",
        bottomColor: "rgba(56, 33, 110, 0.1)",
      });
      // Set the data for the Area Series
      areaSeries.setData(lineData);

     

    



      const intervalID = setInterval(() => {
        const update = streamingDataProvider.next();
        if (update.done) {
          clearInterval(intervalID);
          return;
        }
        series.update(update.value);
      }, 100);
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



let randomFactor = 25 + Math.random() * 25;
const samplePoint = i =>
  i *
  (0.5 +
    Math.sin(i / 1) * 0.2 +
    Math.sin(i / 2) * 0.4 +
    Math.sin(i / randomFactor) * 0.8 +
    Math.sin(i / 50) * 0.5) +
  200 +
  i * 2;

function generateData(
  numberOfCandles = 500,
  updatesPerCandle = 5,
  startAt = 100
) {
  const createCandle = (val, time) => ({
    time,
    open: val,
    high: val,
    low: val,
    close: val,
  });

  const updateCandle = (candle, val) => ({
    time: candle.time,
    close: val,
    open: candle.open,
    low: Math.min(candle.low, val),
    high: Math.max(candle.high, val),
  });

  randomFactor = 25 + Math.random() * 25;
  const date = new Date(Date.UTC(2018, 0, 1, 12, 0, 0, 0));
  const numberOfPoints = numberOfCandles * updatesPerCandle;
  const initialData = [];
  const realtimeUpdates = [];
  let lastCandle;
  let previousValue = samplePoint(-1);
  for (let i = 0; i < numberOfPoints; ++i) {
    if (i % updatesPerCandle === 0) {
      date.setUTCDate(date.getUTCDate() + 1);
    }
    const time = date.getTime() / 1000;
    let value = samplePoint(i);
    const diff = (value - previousValue) * Math.random();
    value = previousValue + diff;
    previousValue = value;
    if (i % updatesPerCandle === 0) {
      const candle = createCandle(value, time);
      lastCandle = candle;
      if (i >= startAt) {
        realtimeUpdates.push(candle);
      }
    } else {
      const newCandle = updateCandle(lastCandle, value);
      lastCandle = newCandle;
      if (i >= startAt) {
        realtimeUpdates.push(newCandle);
      } else if ((i + 1) % updatesPerCandle === 0) {
        initialData.push(newCandle);
      }
    }
  }

  return {
    initialData,
    realtimeUpdates,
  };
}


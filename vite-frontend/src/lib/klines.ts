import { CandlestickSeries, ColorType, createChart, CrosshairMode, HistogramSeries, IChartApi, LineStyle } from "lightweight-charts";
import { ChartProps, klineType } from "./types";

const tfw = {
    "1m": 1 * 60,
    "2m": 2 * 60,
    "3m": 3 * 60,
    "5m": 5 * 60,
    "10m": 10 * 60,
    "15m": 15 * 60,
    "30m": 30 * 60,
    "1h": 1 * 60 * 60,
    "2h": 2 * 60 * 60,
    "4h": 4 * 60 * 60,
};

export class Kline {

    private chart: IChartApi;
    private domElement: HTMLElement;
    private klines: klineType[];
    private targetklines: klineType[];
    private targetTimeframe: string;
    private renderLastBarFlag: boolean;
    private properties: ChartProps;
    private candleSeries: any;
    private volumeSeries: any;

    constructor(ref: HTMLElement, timeframe: string, properties: ChartProps) {
        this.chart = null;
        this.klines = [];
        this.targetklines = [];
        this.targetTimeframe = "";
        this.renderLastBarFlag = false;
        this.domElement = ref;
        this.properties = properties;
    }

    upsertKline(k: klineType) {
       
        const index = this.klines.findIndex((e) => e.time == k.time);
        if (index >= 0) this.klines[index] = Object.assign({}, k);
        if (index === -1) this.klines = this.klines.concat(k);
        if (this.renderLastBarFlag) this.renderLastBar(k.time);
      
     
        
    }


    renderLastBar(time: number) {
        const openTimeStamp = this.getNormalizedTimeframe(time, this.targetTimeframe);
        const index = this.klines.findIndex((k) => k.time == openTimeStamp);
        const dataSlice = this.klines.slice(index);
       // console.log(dataSlice)
        const lastBar = this.aggregateCandles(dataSlice, this.targetTimeframe);
       // console.log(this.klines)
        this.candleSeries.update(lastBar);
        const lastVolumeBar = {
          time: lastBar.time,
          value: lastBar.volume,
          color: lastBar.close > lastBar.open ? "#26a69a" : "#ef5350",
        };
        this.volumeSeries.update(lastVolumeBar);
    }


    setTargetTimeframe(timeframe) {
        this.targetTimeframe = timeframe;
        this.renderAll();

      }

    renderAll() {

        this.renderLastBarFlag = false;
        if (this.chart) this.chart.remove();

        this.chart = createChart(this.domElement, {
            layout: {
                background: { type: ColorType.Solid, color: this.properties.backgroundColor },
                textColor: this.properties.textColor,
            },
            //@ts-ignore

            width: this.properties.width,
            height: this.properties.height,
            grid: {
                vertLines: { color: "#444" },
                horzLines: { color: "#444" },
            },
        });

        this.chart.applyOptions({
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

        this.chart.timeScale().applyOptions({
            borderColor: "#71649C",
            visible: true,
            timeVisible: true,
            secondsVisible: true,
        });

        this.candleSeries = this.chart.addSeries(CandlestickSeries, {
            upColor: '#26a69a',
            downColor: '#ef5350',
            borderVisible: false,
            wickUpColor: '#26a69a',
            wickDownColor: '#ef5350',
        });


        this.candleSeries.priceScale().applyOptions({
            scaleMargins: {
                top: 0.1,
                bottom: 0.2,
            },
        })

        this.volumeSeries = this.chart.addSeries(HistogramSeries, {

        })

        this.volumeSeries.priceScale().applyOptions({
            scaleMargins: {
                top: 0.8,
                bottom: 0,
            },
        })
           
        this.targetklines = this.convertTimeframe(this.klines, this.targetTimeframe);

        //@ts-ignore
        this.candleSeries.setData(this.targetklines);

        const volumeData = this.targetklines.map((kline) => ({
            time: kline.time,
            value: kline.volume,
            color: kline.close > kline.open ? "#26a69a" : "#ef5350", // Green for up, red for down
        }));

        //@ts-ignore
        this.volumeSeries.setData(volumeData);

        this.chart.timeScale().fitContent();

        //@ts-ignore
        this.chart.timeScale().scrollToPosition(5);

        this.renderLastBarFlag = true;
    }

    aggregateCandles(candles: klineType[], targetTimeframe: string) {
        const time = this.getNormalizedTimeframe(candles[0].time, targetTimeframe);
        const open = candles[0].open;
        const high = Math.max(...candles.map((c) => c.high));
        const low = Math.min(...candles.map((c) => c.low));
        const close = candles[candles.length - 1].close;
        const volume = candles.reduce((acc, c) => acc + c.volume, 0);
        return { time, open, high, low, close, volume };
    }

    getNormalizedTimeframe(timestamp: number, timeframe: string) {
        return ~~(timestamp / tfw[timeframe]) * tfw[timeframe];
    }


    convertTimeframe(candles: klineType[], targetTimeframe: string) {
      
        let result: klineType[] = [];
        //@ts-ignore
        let currentKline: klineType = {};
        for (let i = 0; i < candles.length; i++) {
            if (i === 0) {
                currentKline.time = this.getNormalizedTimeframe(
                    candles[i].time,
                    targetTimeframe
                );
                currentKline.open = candles[i].open;
                currentKline.high = candles[i].high;
                currentKline.low = candles[i].low;
                currentKline.close = candles[i].close;
                currentKline.volume = candles[i].volume;
                continue;
            }

            if (candles[i].time < currentKline?.time + tfw[targetTimeframe]) {
                currentKline.high = Math.max(currentKline.high, candles[i].high);
                currentKline.low = Math.min(currentKline.low, candles[i].low);
                currentKline.close = candles[i].close;
                currentKline.volume += candles[i].volume;
                continue;
            }

            if (candles[i].time >= currentKline?.time + tfw[targetTimeframe]) {
                result.push({ ...currentKline });
                currentKline.time = this.getNormalizedTimeframe(
                    candles[i].time,
                    targetTimeframe
                );
                currentKline.open = candles[i].open;
                currentKline.high = candles[i].high;
                currentKline.low = candles[i].low;
                currentKline.close = candles[i].close;
                currentKline.volume = candles[i].volume;
                continue;
            }
        }
        console.log(result)
        return result;
    };

}
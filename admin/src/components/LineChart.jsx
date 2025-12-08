import { LineChart } from "@mui/x-charts/LineChart";

// Sample dataset for demonstration
const usUnemploymentRate = [
  { date: new Date(2020, 0, 1), rate: 3.5 },
  { date: new Date(2020, 1, 1), rate: 3.6 },
  { date: new Date(2020, 2, 1), rate: 4.4 },
  { date: new Date(2020, 3, 1), rate: 14.8 },
  { date: new Date(2020, 4, 1), rate: 13.3 },
  { date: new Date(2020, 5, 1), rate: 11.1 },
  { date: new Date(2020, 6, 1), rate: 10.2 },
  { date: new Date(2020, 7, 1), rate: 8.4 },
  { date: new Date(2020, 8, 1), rate: 7.9 },
  { date: new Date(2020, 9, 1), rate: 6.9 },
  { date: new Date(2020, 10, 1), rate: 6.7 },
  { date: new Date(2020, 11, 1), rate: 6.3 },
  { date: new Date(2021, 0, 1), rate: 6.3 },
  { date: new Date(2021, 1, 1), rate: 6.2 },
  { date: new Date(2021, 2, 1), rate: 6.0 },
  { date: new Date(2021, 3, 1), rate: 6.1 },
  { date: new Date(2021, 4, 1), rate: 5.8 },
  { date: new Date(2021, 5, 1), rate: 5.9 },
  { date: new Date(2021, 6, 1), rate: 5.4 },
  { date: new Date(2021, 7, 1), rate: 5.2 },
  { date: new Date(2021, 8, 1), rate: 4.8 },
  { date: new Date(2021, 9, 1), rate: 4.6 },
  { date: new Date(2021, 10, 1), rate: 4.2 },
  { date: new Date(2021, 11, 1), rate: 3.9 },
];

// Formatters
const dateAxisFormatter = (date) => {
  return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
};

const percentageFormatter = (value) => {
  return `${value}%`;
};

const xAxis = [
  {
    dataKey: "date",
    scaleType: "time",
    valueFormatter: dateAxisFormatter,
  },
];

const yAxis = [
  {
    valueFormatter: percentageFormatter,
  },
];

const series = [
  {
    dataKey: "rate",
    showMark: false,
    valueFormatter: percentageFormatter,
  },
];

export default function GridDemo() {
  return (
    <LineChart
      dataset={usUnemploymentRate}
      xAxis={xAxis}
      yAxis={yAxis}
      series={series}
      height={300}
      grid={{ vertical: true, horizontal: true }}
    />
  );
}

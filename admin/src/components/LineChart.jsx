import { LineChart } from "@mui/x-charts/LineChart";

const dateAxisFormatter = (date) =>
  date.toLocaleDateString("en-US", { month: "short" });

const xAxis = [
  {
    dataKey: "date",
    scaleType: "time",
    valueFormatter: dateAxisFormatter,
  },
];

const yAxis = [
  {
    valueFormatter: (v) => `${Number(v) || 0}`,
  },
];

const series = [
  {
    dataKey: "value",
    showMark: false,
    valueFormatter: (v) => `${Number(v) || 0}`,
  },
];

export default function AdminLineChart({ dataset = [] }) {
  return (
    <LineChart
      dataset={dataset}
      xAxis={xAxis}
      yAxis={yAxis}
      series={series}
      height={300}
      grid={{ vertical: true, horizontal: true }}
    />
  );
}

import { useEffect, useRef, useMemo } from 'react';
import {
  Chart,
  LineElement,
  PointElement,
  LineController,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
  Filler,
  Title,
  type ChartConfiguration,
} from 'chart.js';
import dayjs from "dayjs";
import type { WeightLog } from '../../types/weight-logs';
import './WeightLineChart.css';


Chart.register(
  LineElement,
  PointElement,
  LineController,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
  Filler,
  Title
);

interface WeightLineChartProps {
  weightLogs: Record<number, WeightLog>;
  dateRange: string;
}

export default function WeightLineChart({
  weightLogs,
  dateRange
}: WeightLineChartProps) {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstanceRef = useRef<Chart | null>(null);

  const earliestDate = useMemo(() => {
    switch (dateRange) {
      case "Week":
        return dayjs().subtract(1, "week");
      case "Month":
        return dayjs().subtract(1, "month");
      case "3 Months":
        return dayjs().subtract(3, "month");
      case "Year":
        return dayjs().subtract(1, "year");
      default:
        return null;
    }
  }, [dateRange]);

  const { labels, data } = useMemo(() => {
    const labels: string[] = [];
    const data: number[] = [];

    for (let i = Object.entries(weightLogs).length - 1; i >= 0; i--) {
      if (earliestDate && dayjs(Object.entries(weightLogs)[i][1].log_date).isBefore(earliestDate)) {
        continue;
      }

      labels.push(dayjs(Object.entries(weightLogs)[i][1].log_date).format("MM/DD/YYYY"));
      data.push(Object.entries(weightLogs)[i][1].weight);
    }

    return { labels, data };
  }, [weightLogs, earliestDate]);

  useEffect(() => {
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    const ctx = chartRef.current;
    if (!ctx) {
      return;
    }

    const config: ChartConfiguration<'line', number[], string> = {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          data: data,
          borderColor: '#00ffcc'
        }]
      },
      options: {
        scales: {
          x: {
            ticks: {
              font: {
                size: 12,
                family: "Outfit"
              },
              color: "#eceff4"
            }
          },
          y: {
            ticks: {
              callback: function(value) {
                return value + ' lbs';
              },
              font: {
                size: 12,
                family: "Outfit",
              },
              color: "#eceff4"
            }
          }
        },
        plugins: {
          legend: {
            display: false
          },
          title: {
            display: true,
            text: 'Weight (lbs)',
            padding: { bottom: 20 },
            font: {
              size: 19,
              family: "Outfit",
              weight: 'bold'
            },
            color: "#eceff4"
          }
        }
      }
    };

    chartInstanceRef.current = new Chart(ctx, config);

    return () => {
      chartInstanceRef.current?.destroy();
    };
  }, [weightLogs, data, labels]);


  return (
    <div className='weight-chart-container'>
      <canvas className='weight-chart-canvas' ref={chartRef} />
    </div>
  );
}

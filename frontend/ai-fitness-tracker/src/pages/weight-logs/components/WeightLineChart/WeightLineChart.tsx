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
  weightLogs: WeightLog[];
}

export default function WeightLineChart({ weightLogs }: WeightLineChartProps) {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstanceRef = useRef<Chart | null>(null);

  const { labels, data } = useMemo(() => {
    const labels: string[] = [];
    const data: number[] = [];
    for (let i = weightLogs.length - 1; i >= 0; i--) {
      labels.push(dayjs(weightLogs[i].log_date).format("MM/DD/YYYY"));
      data.push(weightLogs[i].weight);
    }
    return { labels, data };
  }, [weightLogs]);

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

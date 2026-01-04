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
  sortedEntries: [string, WeightLog][];
  earliestDate: dayjs.Dayjs;
  latestDate: dayjs.Dayjs;
}

export default function WeightLineChart({
  sortedEntries,
  earliestDate,
  latestDate
}: WeightLineChartProps) {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstanceRef = useRef<Chart | null>(null);

  const { labels, data } = useMemo(() => {
    const labels: string[] = [];
    const data: (number | null)[] = [];

    const entryMap = new Map<string, number>();
    for (let i = 0; i < sortedEntries.length; i++) {
      const entry = sortedEntries[i][1];
      const key = dayjs(entry.log_date).format("MM/DD/YYYY");
      entryMap.set(key, entry.weight);
    }
    const start = (earliestDate).startOf('day');
    const end = (latestDate).startOf('day');

    let current = start;
    while (current.isBefore(end) || current.isSame(end)) {
      const key = current.format("MM/DD/YYYY");
      labels.push(key);
      data.push(entryMap.has(key) ? entryMap.get(key)! : null);
      current = current.add(1, 'day');
    }

    return { labels, data };
  }, [sortedEntries, earliestDate, latestDate]);

  useEffect(() => {
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    const ctx = chartRef.current;
    if (!ctx) {
      return;
    }

    const config: ChartConfiguration<'line', (number | null)[], string> = {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          data: data,
          borderColor: '#00ffcc',
          spanGaps: true
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
              display: sortedEntries.length > 0,
              callback: (weight) => weight + ' lbs',
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
  }, [sortedEntries, data, labels]);


  return (
    <div className='weight-chart-container'>
      <canvas className='weight-chart-canvas' ref={chartRef} />
    </div>
  );
}

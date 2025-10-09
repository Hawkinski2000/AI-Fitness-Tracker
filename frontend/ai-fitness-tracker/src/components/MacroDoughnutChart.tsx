import { useEffect, useRef } from 'react';
import { Chart, DoughnutController, ArcElement, Tooltip, Legend, type ChartConfiguration } from 'chart.js';


Chart.register(DoughnutController, ArcElement, Tooltip, Legend);

interface MacroDoughnutChartProps {
  calories: number;
  carbsCalories: number;
  fatCalories: number;
  proteinCalories: number;
}

export default function MacroDoughnutChart({ calories, carbsCalories, fatCalories, proteinCalories }: MacroDoughnutChartProps) {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstanceRef = useRef<Chart | null>(null);

  useEffect(() => {
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    const ctx = chartRef.current;
    if (!ctx) {
      return;
    }

    const centerTextPlugin = {
      id: 'centerText',
      beforeDraw(chart: Chart) {
        const { ctx, chartArea } = chart;
        const centerX = (chartArea.left + chartArea.right) / 2;
        const centerY = (chartArea.top + chartArea.bottom) / 2;

        ctx.save();

        ctx.font = '16px outfit, arial';
        ctx.fillStyle = '#eceff4';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'bottom';
        ctx.fillText(calories.toString(), centerX, centerY + 2);

        ctx.font = '12px outfit, arial';
        ctx.fillStyle = '#eceff4';
        ctx.textBaseline = 'top';
        ctx.fillText('Cal', centerX, centerY + 2);

        ctx.restore();
      },
    };

    const config: ChartConfiguration<'doughnut', number[], string> = {
      type: 'doughnut',
      data: {
        labels: ['Carbs', 'Fat', 'Protein'],
        datasets: [
          {
            data: [carbsCalories, fatCalories, proteinCalories],
            backgroundColor: ['#00ffcc', '#ff00c8', '#ffe600'],
            hoverOffset: 6
          }
        ]
      },
      options: {
        cutout: '70%',
        layout: {
          padding: 6
        },
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            backgroundColor: '#1e1e3f',
            titleColor: '#eceff4',
            bodyColor: '#eceff4',
            bodyFont: {
              family: 'Outfit, arial',
              size: 10
            },
            titleFont: {
              family: 'Outfit, arial',
              size: 12,
              weight: 'normal'
            },
            boxPadding: 6,
            callbacks: {
              label: context => Number(context.raw).toFixed(1).replace(/\.0$/, '') + ' cal'
            }
          }
        }
      },
      plugins: [centerTextPlugin]
    };

    chartInstanceRef.current = new Chart(ctx, config);

    return () => {
      chartInstanceRef.current?.destroy();
    };
  }, [calories, carbsCalories, fatCalories, proteinCalories]);

  return <canvas className='macro-chart-canvas' ref={chartRef} />;
}

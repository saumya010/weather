const WIDTH = 200;
const HEIGHT = 80;
const BAR_GAP = 1;

const average = (data) => Math.round(data.reduce((sum, n) => sum + n, 0) / data.length);

const Chart = ({ data, color, units }) => {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const barWidth = WIDTH / data.length - BAR_GAP;
  const avg = average(data);
  const avgY = HEIGHT - ((avg - min) / range) * HEIGHT;

  return (
    <div>
      <svg width={WIDTH} height={HEIGHT} role="img" aria-label={`${avg} ${units} average`}>
        {data.map((value, index) => {
          const barHeight = Math.max(((value - min) / range) * HEIGHT, 1);
          return (
            <rect
              key={index}
              x={index * (barWidth + BAR_GAP)}
              y={HEIGHT - barHeight}
              width={barWidth}
              height={barHeight}
              fill={color}
              opacity={0.75}
            />
          );
        })}
        <line
          x1={0}
          y1={avgY}
          x2={WIDTH}
          y2={avgY}
          stroke={color}
          strokeWidth={1.5}
          strokeDasharray="4 3"
        />
      </svg>
      <div>
        {avg} {units}
      </div>
    </div>
  );
};

export default Chart;

import React, { useMemo } from 'react';
import { DeputyTopicMetric } from '../types';

interface RadarSpiderChartProps {
  topics: DeputyTopicMetric[];
  size?: number;
}

interface Point {
  x: number;
  y: number;
}

const RadarSpiderChart: React.FC<RadarSpiderChartProps> = ({ topics, size = 500 }) => {
  const preparedTopics = useMemo(() => topics, [topics]);
  const center = size / 2;
  const maxRadius = size * 0.31;
  const levels = [20, 40, 60, 80, 100];

  if (preparedTopics.length < 3) {
    return (
      <div className="rounded-3xl border border-dashed border-[#d6c6a7] bg-[#f9f4e8] p-10 text-center text-sm font-semibold text-[#6a7382]">
        Nuk ka mjaftueshem tema per grafikun radar.
      </div>
    );
  }

  const angleStep = (Math.PI * 2) / preparedTopics.length;

  const getPoint = (index: number, score: number, radiusScale = 1): Point => {
    const angle = -Math.PI / 2 + index * angleStep;
    const radius = (Math.max(0, Math.min(score, 100)) / 100) * maxRadius * radiusScale;

    return {
      x: center + Math.cos(angle) * radius,
      y: center + Math.sin(angle) * radius,
    };
  };

  const gridPolygons = levels.map((level) => {
    const points = preparedTopics.map((_, index) => getPoint(index, level));
    return points.map((point) => `${point.x},${point.y}`).join(' ');
  });

  const dataPoints = preparedTopics.map((topic, index) => getPoint(index, topic.score));
  const dataPolygon = dataPoints.map((point) => `${point.x},${point.y}`).join(' ');

  return (
    <div className="relative overflow-hidden rounded-[2rem] border border-[#d7c9ad] bg-gradient-to-br from-[#f9f4e8] via-[#f5efe1] to-[#efe7d7] p-6 shadow-[0_28px_60px_-44px_rgba(15,35,65,0.95)]">
      <svg viewBox={`0 0 ${size} ${size}`} className="h-full w-full" role="img" aria-label="Grafik radar i temave">
        <defs>
          <linearGradient id="radarFill" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#163e6b" stopOpacity="0.48" />
            <stop offset="100%" stopColor="#ba8f40" stopOpacity="0.38" />
          </linearGradient>
          <linearGradient id="radarStroke" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0f2d51" />
            <stop offset="100%" stopColor="#9f7433" />
          </linearGradient>
        </defs>

        <rect x={0} y={0} width={size} height={size} fill="transparent" />

        {gridPolygons.map((polygon, index) => (
          <polygon
            key={`grid-${levels[index]}`}
            points={polygon}
            fill={index % 2 === 0 ? 'rgba(10, 32, 59, 0.03)' : 'rgba(152, 119, 59, 0.04)'}
            stroke="rgba(18, 42, 71, 0.18)"
            strokeWidth="1"
          />
        ))}

        {preparedTopics.map((topic, index) => {
          const axisPoint = getPoint(index, 100, 1.08);
          const angle = -Math.PI / 2 + index * angleStep;
          const labelPoint = {
            x: center + Math.cos(angle) * maxRadius * 1.24,
            y: center + Math.sin(angle) * maxRadius * 1.24,
          };
          const anchor = labelPoint.x < center - 6 ? 'end' : labelPoint.x > center + 6 ? 'start' : 'middle';

          return (
            <g key={topic.topicId}>
              <line
                x1={center}
                y1={center}
                x2={axisPoint.x}
                y2={axisPoint.y}
                stroke="rgba(20, 45, 74, 0.2)"
                strokeWidth="1.1"
              />
              <text
                x={labelPoint.x}
                y={labelPoint.y}
                textAnchor={anchor}
                dominantBaseline="middle"
                className="fill-[#32475f] text-[9px] font-extrabold uppercase tracking-[0.13em]"
              >
                {topic.label}
              </text>
            </g>
          );
        })}

        <polygon points={dataPolygon} fill="url(#radarFill)" stroke="url(#radarStroke)" strokeWidth="3" />

        {dataPoints.map((point, index) => (
          <circle key={`point-${preparedTopics[index].topicId}`} cx={point.x} cy={point.y} r="4.3" fill="#163e6b" />
        ))}

        <circle cx={center} cy={center} r="6" fill="#f1e3c7" stroke="#9d783b" strokeWidth="2" />
      </svg>
    </div>
  );
};

export default RadarSpiderChart;


import React from 'react';
import { View, Dimensions } from 'react-native';
import Svg, { Circle, Line, Text } from 'react-native-svg';
import { Theme } from '@/constants/Theme';
import { JournalEntry } from '@/types/journal';

interface Props {
  entries: JournalEntry[];
}

const getMoodValue = (mood: string): number => {
  const moodMap: { [key: string]: number } = {
    '😊 Happy': 1,
    '😌 Calm': 0.8,
    '😰 Anxious': 0.4,
    '😢 Sad': 0.2,
    '😠 Angry': 0.3
  };
  return moodMap[mood] || 0.5;
};

export function BubbleChart({ entries }: Props) {
  const width = Dimensions.get('window').width - 40;
  const height = 300;
  const padding = 40;
  const innerWidth = width - padding * 2;
  const innerHeight = height - padding * 2;

  // Process entries to get word counts and mood values
  const processedData = entries
    .filter(entry => entry && entry.content && entry.mood)
    .map(entry => ({
      wordCount: entry.content.split(/\s+/).length,
      mood: getMoodValue(entry.mood),
      moodEmoji: entry.mood.split(' ')[0]
    }));

  if (processedData.length === 0) {
    return <View style={{ height: height }} />;
  }

  const maxWordCount = Math.max(...processedData.map(d => d.wordCount));

  // Create data points with scaled coordinates
  const points = processedData.map(d => ({
    x: (d.wordCount / maxWordCount) * innerWidth + padding,
    y: height - (d.mood * innerHeight + padding),
    r: Math.min(Math.max(d.wordCount / 50, 15), 30), // Size based on word count, with min/max limits
    emoji: d.moodEmoji,
    mood: d.mood,
    wordCount: d.wordCount
  }));

  // Axis labels
  const xAxisLabels = [0, maxWordCount];
  const yAxisLabels = ['Less\nPositive', 'More\nPositive'];

  return (
    <View>
      <Svg width={width} height={height}>
        {/* X-axis */}
        <Line
          x1={padding}
          y1={height - padding}
          x2={width - padding}
          y2={height - padding}
          stroke="#666"
          strokeWidth="1"
        />
        
        {/* Y-axis */}
        <Line
          x1={padding}
          y1={padding}
          x2={padding}
          y2={height - padding}
          stroke="#666"
          strokeWidth="1"
        />

        {/* X-axis labels */}
        {xAxisLabels.map((label, i) => (
          <Text
            key={`x-${i}`}
            x={i === 0 ? padding : width - padding}
            y={height - padding + 20}
            fontSize="12"
            fill="#666"
            textAnchor={i === 0 ? "start" : "end"}
          >
            {label} words
          </Text>
        ))}

        {/* Y-axis labels */}
        {yAxisLabels.map((label, i) => (
          <Text
            key={`y-${i}`}
            x={padding - 10}
            y={i === 0 ? height - padding : padding}
            fontSize="12"
            fill="#666"
            textAnchor="end"
            alignmentBaseline={i === 0 ? "baseline" : "hanging"}
          >
            {label}
          </Text>
        ))}

        {/* Data points */}
        {points.map((point, i) => (
          <React.Fragment key={i}>
            <Circle
              cx={point.x}
              cy={point.y}
              r={point.r}
              fill={`rgba(255, 126, 103, ${point.mood})`}
              opacity={0.7}
            />
            <Text
              x={point.x}
              y={point.y}
              fontSize={point.r * 0.8}
              textAnchor="middle"
              alignmentBaseline="middle"
            >
              {point.emoji}
            </Text>
          </React.Fragment>
        ))}
      </Svg>
    </View>
  );
}

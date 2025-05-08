
import React from 'react';
import { View, Dimensions } from 'react-native';
import Svg, { Path, Circle, Text } from 'react-native-svg';
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

export function MoodLineChart({ entries }: Props) {
  const screenWidth = Dimensions.get('window').width;
  const isLargeScreen = screenWidth > 768;
  const width = isLargeScreen ? Math.min(screenWidth * 0.8, 800) : screenWidth - 40;
  const height = isLargeScreen ? 300 : Math.min(screenWidth * 0.5, 200);
  const padding = isLargeScreen ? 40 : Math.min(width * 0.08, 25);

  const validEntries = entries.filter(entry => entry && entry.mood);
  const sortedEntries = [...validEntries]
    .sort((a, b) => a.timestamp - b.timestamp)
    .slice(-7); // Last 7 entries

  const points = sortedEntries.map((entry, i) => ({
    x: (i * (width - padding * 2)) / (Math.max(sortedEntries.length - 1, 1)) + padding,
    y: height - (getMoodValue(entry.mood) * (height - padding * 2) + padding),
    mood: entry.mood
  }));

  if (sortedEntries.length === 0) {
    return <View style={{ height: height }} />;
  }

  const pathData = points.reduce((path, point, i) => 
    path + (i === 0 ? `M ${point.x} ${point.y}` : ` L ${point.x} ${point.y}`), 
  '');

  return (
    <View>
      <Svg width={width} height={height}>
        <Path
          d={pathData}
          stroke={Theme.colors.primary}
          strokeWidth="3"
          fill="none"
        />
        {points.map((point, i) => (
          <React.Fragment key={i}>
            <Circle
              cx={point.x}
              cy={point.y}
              r="5"
              fill={Theme.colors.background}
              stroke={Theme.colors.primary}
              strokeWidth="3"
            />
            <Text
              x={point.x}
              y={point.y - 15}
              fontSize="16"
              textAnchor="middle"
            >
              {sortedEntries[i].mood.split(' ')[0]}
            </Text>
          </React.Fragment>
        ))}
      </Svg>
    </View>
  );
}

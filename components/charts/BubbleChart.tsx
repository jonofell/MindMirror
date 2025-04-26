import React from 'react';
import { View, Dimensions } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { Theme } from '@/constants/Theme';

const MOCK_DATA = [
  { wordCount: 100, mood: 0.6, entries: 2 },
  { wordCount: 250, mood: 0.8, entries: 4 },
  { wordCount: 180, mood: 0.4, entries: 1 },
  { wordCount: 300, mood: 0.9, entries: 5 },
  { wordCount: 400, mood: 0.85, entries: 3 },
];

export function BubbleChart() {
  const width = Dimensions.get('window').width - 40;
  const height = 300;
  const padding = 40;

  const maxWordCount = Math.max(...MOCK_DATA.map(d => d.wordCount));

  const points = MOCK_DATA.map(d => ({
    x: (d.wordCount / maxWordCount) * (width - padding * 2) + padding,
    y: height - (d.mood * (height - padding * 2) + padding),
    r: d.entries * 8
  }));

  return (
    <View>
      <Svg width={width} height={height}>
        {points.map((point, i) => (
          <Circle
            key={i}
            cx={point.x}
            cy={point.y}
            r={point.r}
            fill={`rgba(255, 126, 103, ${MOCK_DATA[i].mood})`}
          />
        ))}
      </Svg>
    </View>
  );
}
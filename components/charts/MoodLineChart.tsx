
import React from 'react';
import { View, Dimensions } from 'react-native';
import Svg, { Path, Circle, Text } from 'react-native-svg';
import { Theme } from '@/constants/Theme';

const MOCK_DATA = [
  { day: 'Mon', mood: 0.6, emoji: '😊' },
  { day: 'Tue', mood: 0.8, emoji: '😄' },
  { day: 'Wed', mood: 0.4, emoji: '🧘' },
  { day: 'Thu', mood: 0.9, emoji: '😊' },
  { day: 'Fri', mood: 0.85, emoji: '😄' },
  { day: 'Sun', mood: 1, emoji: '☀️' },
];

export function MoodLineChart() {
  const width = Dimensions.get('window').width - 80;
  const height = 200;
  const padding = 40;

  const points = MOCK_DATA.map((d, i) => ({
    x: (i * (width - padding * 2)) / (MOCK_DATA.length - 1) + padding,
    y: height - (d.mood * (height - padding * 2) + padding),
  }));

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
              {MOCK_DATA[i].emoji}
            </Text>
          </React.Fragment>
        ))}
      </Svg>
    </View>
  );
}

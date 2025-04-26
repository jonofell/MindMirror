
import React from 'react';
import { Dimensions } from 'react-native';
import { VictoryLine, VictoryChart, VictoryAxis, VictoryScatter } from 'victory-native';
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
  return (
    <VictoryChart 
      width={Dimensions.get('window').width - 80} 
      height={200}
      padding={{ top: 20, bottom: 40, left: 40, right: 40 }}
    >
      <VictoryLine
        style={{
          data: {
            stroke: Theme.colors.primary,
            strokeWidth: 3
          }
        }}
        data={MOCK_DATA}
        x="day"
        y="mood"
      />
      <VictoryScatter
        data={MOCK_DATA}
        x="day"
        y="mood"
        size={7}
        style={{
          data: {
            fill: Theme.colors.background
          },
          labels: {
            fontSize: 20
          }
        }}
        labels={({ datum }) => datum.emoji}
      />
      <VictoryAxis
        style={{
          axis: { stroke: "transparent" },
          tickLabels: { 
            fill: Theme.colors.textLight,
            fontFamily: "Inter_400Regular"
          }
        }}
      />
    </VictoryChart>
  );
}


import React from 'react';
import { Dimensions } from 'react-native';
import { VictoryScatter, VictoryChart, VictoryAxis } from 'victory';
import { Theme } from '@/constants/Theme';

const MOCK_DATA = [
  { wordCount: 100, mood: 0.6, entries: 2 },
  { wordCount: 250, mood: 0.8, entries: 4 },
  { wordCount: 180, mood: 0.4, entries: 1 },
  { wordCount: 300, mood: 0.9, entries: 5 },
  { wordCount: 400, mood: 0.85, entries: 3 },
];

export const BubbleChart = () => {
  return (
    <VictoryChart width={Dimensions.get('window').width - 40} height={300}>
      <VictoryScatter
        data={MOCK_DATA}
        x="wordCount"
        y="mood"
        size={({ datum }) => datum.entries * 8}
        style={{
          data: {
            fill: ({ datum }) => `rgba(255, 126, 103, ${datum.mood})`,
          }
        }}
      />
      <VictoryAxis
        label="Word count"
        style={{
          axisLabel: { 
            padding: 30,
            fill: Theme.colors.textLight,
            fontFamily: "Inter_400Regular"
          },
          tickLabels: { 
            fill: Theme.colors.textLight,
            fontFamily: "Inter_400Regular"
          }
        }}
      />
      <VictoryAxis
        dependentAxis
        label="Mood"
        style={{
          axisLabel: { 
            padding: 40,
            fill: Theme.colors.textLight,
            fontFamily: "Inter_400Regular"
          },
          tickLabels: { 
            fill: Theme.colors.textLight,
            fontFamily: "Inter_400Regular"
          }
        }}
      />
    </VictoryChart>
  );
};

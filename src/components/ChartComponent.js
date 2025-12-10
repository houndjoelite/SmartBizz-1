import React, { useMemo } from 'react';
import { View, StyleSheet, useWindowDimensions, Text } from 'react-native';
import { LineChart } from 'react-native-chart-kit';

const ChartComponent = ({ data, chartTitle = '' }) => {
  const { width: screenWidth } = useWindowDimensions();
  
  // Calculer la largeur du graphique en fonction de l'écran
  const chartWidth = useMemo(() => {
    const isLandscape = screenWidth > 600;
    return isLandscape ? screenWidth * 0.4 : screenWidth - 40;
  }, [screenWidth]);

  // Préparer les données pour react-native-chart-kit
  const chartData = useMemo(() => ({
    labels: data.map(item => item.x.toString() || ''),
    datasets: [
      {
        data: data.map(item => item.y),
        color: (opacity = 1) => `rgba(196, 58, 49, ${opacity})`,
        strokeWidth: 2
      }
    ],
    legend: [chartTitle]
  }), [data, chartTitle]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{chartTitle}</Text>
      <LineChart
        data={chartData}
        width={chartWidth}
        height={220}
        yAxisLabel=""
        yAxisSuffix=""
        yAxisInterval={1}
        fromZero
        chartConfig={{
          backgroundColor: '#ffffff',
          backgroundGradientFrom: '#f8f9fa',
          backgroundGradientTo: '#ffffff',
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          style: {
            borderRadius: 16,
          },
          propsForDots: {
            r: '5',
            strokeWidth: '2',
            stroke: '#c43a31',
            strokeOpacity: 0.8,
          },
          propsForBackgroundLines: {
            stroke: '#e9ecef',
            strokeWidth: 1,
          },
          propsForLabels: {
            fontSize: 10,
          },
        }}
        bezier
        style={{
          marginVertical: 8,
          borderRadius: 12,
          paddingRight: 0,
        }}
        withInnerLines={true}
        withOuterLines={true}
        withShadow={false}
        withDots={true}
        withVerticalLines={true}
        withHorizontalLines={true}
        segments={5}
        formatYLabel={(value) => {
          // Formater les grands nombres avec des séparateurs de milliers
          return Number(value).toLocaleString();
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    padding: 8,
    marginVertical: 4,
    borderRadius: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    color: '#2c3e50',
    textAlign: 'center',
    width: '100%',
  },
});

export default ChartComponent;

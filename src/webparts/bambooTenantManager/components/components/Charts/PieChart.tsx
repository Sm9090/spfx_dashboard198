import { DonutChart, IChartDataPoint } from '@fluentui/react-charting'
import { DefaultPalette, Text } from 'office-ui-fabric-react';
import * as React from 'react'
import styles from './Chart.module.scss';

function PieCharts() {
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const [containerWidth, setContainerWidth] = React.useState<number>(0);
  const [containerHeight, setContainerHeight] = React.useState<number>(0);

  React.useEffect(() => {
    if (containerRef.current) {
      const { clientWidth, clientHeight } = containerRef.current;
      setContainerWidth(clientWidth);
      setContainerHeight(clientHeight);
    }
  }, [containerRef]);

  const points: IChartDataPoint[] = [
    {
      legend: 'Asia',
      data: 40000,
      color: DefaultPalette.blue,
      xAxisCalloutData: 'Asia Region',
    },
    {
      legend: 'Europe',
      data: 30000,
      color: DefaultPalette.green,
      xAxisCalloutData: 'Europe Region',
    },
    {
      legend: 'Africa',
      data: 15000,
      color: DefaultPalette.red,
      xAxisCalloutData: 'Africa Region',
    },
    {
      legend: 'North America',
      data: 25000,
      color: DefaultPalette.orange,
      xAxisCalloutData: 'North America Region',
    },
    {
      legend: 'South America',
      data: 10000,
      color: DefaultPalette.yellow,
      xAxisCalloutData: 'South America Region',
    },
  ];

  // Donut chart configuration
  const data = {
    chartTitle: 'Donut chart basic example',
    chartData: points,
  };


  return (
    <div ref={containerRef} className={styles.chartContainer} style={{height: "100%"}}>
      <div style={{ margin: "20px 0px 20px 30px" }}>
        <Text variant="xLarge" nowrap block style={{ fontWeight: 600 }}>Current Visits</Text>
      </div>
      <div style={{ maxWidth: 340, margin: "auto" }}>
      <DonutChart
        culture={window.navigator.language}
        data={data}
        innerRadius={55}
        href={'https://developer.microsoft.com/en-us/'}
        legendsOverflowText={'Overflow Items'}
        hideLegend={false}
        height={340}
        width={340}
        valueInsideDonut={39000}
        enableGradient={false} 
        roundCorners={false} 
      />
      </div>
    </div>
  );
}

export default PieCharts;

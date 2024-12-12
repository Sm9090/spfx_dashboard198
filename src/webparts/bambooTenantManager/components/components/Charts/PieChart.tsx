import { DonutChart, IChartDataPoint } from "@fluentui/react-charting";
import { DefaultPalette, Spinner, Text } from "office-ui-fabric-react";
import * as React from "react";
import styles from "./Chart.module.scss";
import { useStoreContext } from "../../../context/Store";

function PieCharts() {
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const [containerWidth, setContainerWidth] = React.useState<number>(0);
  const [containerHeight, setContainerHeight] = React.useState<number>(0);
  const { productAnalytics } = useStoreContext();

  React.useEffect(() => {
    if (containerRef.current) {
      const { clientWidth, clientHeight } = containerRef.current;
      setContainerWidth(clientWidth);
      setContainerHeight(clientHeight);
    }
  }, [containerRef]);
  const analyticsData = Array.isArray(productAnalytics) ? productAnalytics : [];

  const colors = [
    DefaultPalette.blue,
    DefaultPalette.green,
    DefaultPalette.red,
    DefaultPalette.orange,
    DefaultPalette.yellow,
    DefaultPalette.purple,
  ];

  const points: IChartDataPoint[] = analyticsData.map((product, index) => ({
    legend: product.productTitle,
    data: product.lifetime,
    color: colors[index],
    xAxisCalloutData: product.productTitle,
  }));

  const totalLifetime = points.reduce((sum, point) => sum + point.data, 0);
  const data = {
    chartTitle: "Donut chart basic example",
    chartData: points,
  };

  return (
    <div
      ref={containerRef}
      className={styles.chartContainer}
      style={{ height: "100%" }}
    >
      <div style={{ margin: "20px 0px 10px 30px" }}>
        <Text variant="xLarge" nowrap block style={{ fontWeight: 600 }}>
          Current Visits
        </Text>
      </div>
      <div style={{ maxWidth: 340, margin: "auto" }}>
        {analyticsData.length > 0 ? (
          <DonutChart
            culture={window.navigator.language}
            data={data}
            innerRadius={55}
            href={"#"}
            legendsOverflowText={"Overflow Items"}
            hideLegend={false}
            height={340}
            width={340}
            valueInsideDonut={totalLifetime}
            enableGradient={false}
            roundCorners={false}
          />
        ) : (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: 340,
            }}
          >
            <Spinner
              styles={{
                circle: { width: 80, height: 80, borderWidth: 5 , borderColor: "rgb(75, 192, 192)" },
                label: { fontSize: "15px" , color: "rgb(75, 192, 192)"},
              }}
              label="Loading chart data..."
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default PieCharts;

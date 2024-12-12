import * as React from "react";
import {
  VerticalBarChart,
  IVerticalBarChartDataPoint,
} from "@fluentui/react-charting";
import { DefaultPalette } from "@fluentui/react/lib/Styling";
import { IRenderFunction, Text } from "office-ui-fabric-react";
import styles from "./Chart.module.scss";
import { useStoreContext } from "../../../context/Store";

const VerticalBarChartBasicExample: React.FC = () => {
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const [containerWidth, setContainerWidth] = React.useState<number>(0);
  const [containerHeight, setContainerHeight] = React.useState<number>(0);
  const [isCalloutSelected, setIsCalloutSelected] = React.useState<boolean>(true);1
  const { productAnalytics } = useStoreContext();

  React.useEffect(() => {
    if (containerRef.current) {
      const { clientWidth, clientHeight } = containerRef.current;
      setContainerWidth(clientWidth);
      setContainerHeight(clientHeight);
    }
  }, [containerRef]);
  // const points: IVerticalBarChartDataPoint[] = [
  //   { x: "Most View Product", y: 25, legend: "Product A", color:"rgb(255 171 0)" },
  //   { x: "Total View This Month", y: 30, legend: "Product B", color:"rgb(34 197 94)"},
  //   { x: "Total View Last Month", y: 40, legend: "Product C", color: "rgb(255 86 48"},
  //   { x: "Total View This Year", y: 10, legend: "Product D", color:"rgb(194 57 179)"},
  // ];
  const points: IVerticalBarChartDataPoint[] = productAnalytics.map((product) => [
    { x: `Total View This Month`, y: product.thisMonth, legend: product.productTitle, color: "rgb(255 171 0)" },
    { x: `Total View Last Month`, y: product.lastMonth, legend: product.productTitle, color: "rgb(34 197 94)" },
    { x: `Total View This Year`, y: product.thisYear, legend: product.productTitle, color: "rgb(255 86 48)" },
  ]).flat();
  return (
    <div
      ref={containerRef}
      className={styles.chartContainer}
    >
      <div style={{margin: "20px 30px"}}>
      <Text variant="xLarge"  nowrap block style={{fontWeight: 600}}>Product Analytics</Text>
      </div>
      {containerWidth && containerHeight ? (
        <VerticalBarChart
          chartTitle="Product Analytics"
          data={points}
          width={containerWidth }
          {...(isCalloutSelected && {
            onRenderCalloutPerDataPoint: (
              props: IVerticalBarChartDataPoint,
              defaultRender: IRenderFunction<IVerticalBarChartDataPoint>,
            ) => (props ? defaultRender(props) : null),
          })}
          enableReflow={true}
          hideLabels={true}
          roundCorners={true}
          xAxisOuterPadding={0.2}
          showXAxisLablesTooltip={true}
        />
      ) : null}
    </div>
  );
};

export default VerticalBarChartBasicExample;

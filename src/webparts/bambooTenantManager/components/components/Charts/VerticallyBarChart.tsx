import * as React from "react";
import {
  VerticalBarChart,
  IVerticalBarChartDataPoint,
} from "@fluentui/react-charting";
import { Dropdown, Text, Spinner, SpinnerSize } from "office-ui-fabric-react";
import styles from "./Chart.module.scss";
import { useStoreContext } from "../../../context/Store";

interface VerticalBarChartProps {
  point: { name: string; views: number }[];
}

const VerticalBarChartBasicExample: React.FC = () => {
  const { productAnalytics } = useStoreContext();
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const [containerWidth, setContainerWidth] = React.useState<number>(0);
  const [containerHeight, setContainerHeight] = React.useState<number>(0);
  const [isCalloutSelected, setIsCalloutSelected] =
    React.useState<boolean>(true);
  const [selectedRange, setSelectedRange] =
    React.useState<string>("This Month");

  React.useEffect(() => {
    if (containerRef.current) {
      const { clientWidth, clientHeight } = containerRef.current;
      setContainerWidth(clientWidth);
      setContainerHeight(clientHeight);
    }
  }, [containerRef]);

  const filteredData = React.useMemo(() => {
    return productAnalytics.map((product) => {
      let totalViews = 0;

      if (selectedRange === "This Month") {
        totalViews = product.thisMonth;
      } else if (selectedRange === "Last Month") {
        totalViews = product.lastMonth;
      } else if (selectedRange === "This Year") {
        totalViews = product.thisYear;
      }

      return {
        name: product.productTitle,
        views: totalViews,
      };
    });
  }, [productAnalytics, selectedRange]);

  const dropdownOptions = [
    { key: "This Month", text: "This Month" },
    { key: "Last Month", text: "Last Month" },
    { key: "This Year", text: "This Year" },
  ];

  const onRangeChange = (_event: React.FormEvent<HTMLDivElement>, option?) => {
    if (option) {
      setSelectedRange(option.key as string);
    }
  };

  const dataPoints: IVerticalBarChartDataPoint[] = filteredData.map(
    (product) => ({
      x: product.name,
      y: product.views,
      legend: product.name,
      color: "rgb(75, 192, 192)",
    })
  );

  return (
    <div ref={containerRef} className={styles.chartContainer}>
      <div
        style={{
          margin: "10px 30px",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Text variant="xLarge" nowrap block style={{ fontWeight: 600 }}>
          Product Analytics
        </Text>
        <Dropdown
          placeholder="Select Range"
          options={dropdownOptions}
          selectedKey={selectedRange}
          onChange={onRangeChange}
          style={{ width: 100 }}
        />
      </div>

      {containerWidth && containerHeight ? (
        !filteredData || filteredData.length === 0 ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: 350,
            }}
          >
            <Spinner
              styles={{
                circle: { width: 80, height: 80, borderWidth: 5 ,borderColor: "rgb(75, 192, 192)" },
                label: { fontSize: "15px" , color : "rgb(75, 192, 192)" }, 
              }}
              label="Loading chart data..."
            />
          </div>
        ) : (
          <VerticalBarChart
            chartTitle="Product Analytics"
            data={dataPoints}
            width={containerWidth}
            {...(isCalloutSelected && {
              onRenderCalloutPerDataPoint: (props, defaultRender) =>
                props ? defaultRender(props) : null,
            })}
            enableReflow={true}
            hideLabels={true}
            roundCorners={true}
            xAxisOuterPadding={0.2}
            showXAxisLablesTooltip={false}
          />
        )
      ) : null}
    </div>
  );
};

export default VerticalBarChartBasicExample;

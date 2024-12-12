import { Text } from "office-ui-fabric-react";
import * as React from "react";
import PieCharts from "../../components/components/Charts/PieChart";
import VerticalBarChartBasicExample from "../../components/components/Charts/VerticallyBarChart";
import OrderTimeline from "../../components/components/OrderTimeline/OrderTimeline";
import { Tile } from "../../components/components/Tile/Tile";
import { useStoreContext } from "../../context/Store";
// import { test } from "tenant-manager"
import styles from "./Overview.module.scss";
import { totalViews } from "../../utils/analyticsUtils";
import * as moment from "moment";
// import { PRODUCTS } from "../../contants/products";

interface IOverviewProps {}

const List: React.FC<{
  title: string;
  list: { title: string; value: string }[];
}> = ({ title, list }) => {
  return (
    <div className={styles.list}>
      <div className={styles.header}>
        <Text>{title}</Text>
      </div>
      <div className={styles.items}>
        {list.map((row, index) => (
          <div className={styles.item}>
            {/* <Text variant="small">{index + 1}</Text> */}
            <Text variant="small">{row.title}</Text>
            <Text variant="small">{row.value}</Text>
          </div>
        ))}
      </div>
    </div>
  );
};

const Overview: React.FC<IOverviewProps> = ({}) => {
  const { products, mostViewedProduct, productAnalytics, allStats } =
    useStoreContext();

  const productsInstalled = React.useMemo(() => {
    return products?.length;
  }, [products]);

  const { totalViewThisMonth, totalViewLastMonth, totalViewThisYear } =
    totalViews(productAnalytics);




    
  // const productsAvailable = React.useMemo(() => {
  //   return Object.keys(PRODUCTS).length;
  // }, [PRODUCTS]);

  // const Top10InstalledProducts = React.useMemo<
  //   { title: string; value: string }[]
  // >(() => {
  //   return products
  //     .slice(0, 10)
  //     .map((row) => ({ title: row.Title, value: row.LastModifiedDate || " " }));
  // }, [products]);

  // const Top10AvailableProducts = React.useMemo<
  //   { title: string; value: string }[]
  // >(() => {
  //   return Object.keys(PRODUCTS)
  //     .slice(0, 10)
  //     .map((key) => ({ title: PRODUCTS[key].name, value: " " }));
  // }, [PRODUCTS]);
  console.log(allStats , "allStats")
  const timelineData = allStats.map((stats) => ({
    label: stats.Product,
    timestamp: moment(stats.CreatedAt).format("YYYY-MM-DD HH:mm A"),
    color: "green"
  }));

  return (
    <div>
      <div className={styles.tilesContainer}>
        <div className={styles.smallTileContainer0}>
          <Tile
            title="Products Installed"
            value={productsInstalled}
            color="rgb(105, 80, 232)"
            iconName="AnalyticsLogo"
          />
          <Tile
            title="Products Expiring Soon"
            value={0}
            color="rgb(24 119 242)"
            iconName="AnalyticsLogo"
          />
        </div>
        <div className={styles.smallTileContainer1}>
          <Tile
            title="Most View  Product"
            value={mostViewedProduct.productName}
            color="rgb(255 171 0)"
            iconName="AnalyticsLogo"
          />
          <Tile
            title="Total View Last Month"
            value={totalViewLastMonth}
            color="rgb(34 197 94)"
            iconName="AnalyticsLogo"
          />
        </div>
        <div className={styles.smallTileContainer1}>
          <Tile
            title="Total View This Month"
            value={totalViewThisMonth}
            color="rgb(255 86 48)"
            iconName="AnalyticsLogo"
          />
          <Tile
            title="Total View This Year"
            value={totalViewThisYear}
            color="rgb(194 57 179)"
            iconName="AnalyticsLogo"
          />
        </div>
        {/* <Tile
          title="Products Available"
          value={productsAvailable - productsInstalled}
        /> */}
      </div>
      <div className={styles.listContainer}>
        {/* <List
          title="Newly Installed Products"
          list={[{ title: "Coming soon ...", value: " " }]}
        />
        <List title="Products Expiring Soon" list={[{ title: "Coming soon ...", value: " " }]} /> */}
      </div>

      <div className={styles.chartContainer}>
        <VerticalBarChartBasicExample  />
        <PieCharts  />
      </div>
      <div>
        <h2>Recent Activities</h2>
        <OrderTimeline items={timelineData} />
      </div>
    </div>
  );
};

export default Overview;

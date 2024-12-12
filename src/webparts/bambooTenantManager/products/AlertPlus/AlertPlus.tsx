import * as React from "react";
import { Pivot, PivotItem, Text } from "office-ui-fabric-react";
import styles from "./AlertPlus.module.scss";
import Options from "./components/Options/Options";
import Licensing from "../../components/components/Licensing/Licencing";
import { useStoreContext } from "../../context/Store";

interface IProductProps {
  context: any;
}

const Product: React.FC<IProductProps> = (props) => {
  const { selectedProduct } = useStoreContext();

  return (
    <div>
      <div className={styles.header}>
        <div className={styles.logoContainer}>
          <img src={selectedProduct.Thumbnail} className={styles.headerLogo} />
        </div>
        <div className={styles.titleContainer}>
          <Text variant="xLarge">{selectedProduct.Title}</Text>
          <Text variant="xSmall">
            {selectedProduct.Version ? `v${selectedProduct.Version}` : "N/A"}
          </Text>
        </div>
      </div>
      <div className={styles.container}>
        <Text variant="small">{selectedProduct.Description}</Text>

        <Pivot>
          <PivotItem headerText="Licensing">
            <Licensing context={props.context} />
          </PivotItem>

          <PivotItem headerText="Options">
            <Options context={props.context} />
          </PivotItem>
        </Pivot>
      </div>
    </div>
  );
};

export default Product;

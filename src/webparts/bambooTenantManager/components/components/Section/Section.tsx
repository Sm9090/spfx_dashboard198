import * as React from "react";
import { useStoreContext } from "../../../context/Store";
import Product from "../../../products/Product/Product";
import AlertPlus from "../../../products/AlertPlus/AlertPlus";
import Overview from "../../../products/Overview/Overview";
import Support from "../../../products/Support/Support";

import styles from "./Section.module.scss";
import ProductGrid from "../../../products/Analytics/Analytics";

interface ISectionProps {
  context: any;
}

const Section: React.FC<ISectionProps> = (props) => {
  const { tab, selectedProduct } = useStoreContext();

  const isActive = React.useCallback(
    (active: string) =>
      String(tab)
        .toLocaleLowerCase()
        .indexOf(String(active).toLocaleLowerCase()) != -1,
    [tab]
  );


  const renderTab = React.useCallback(() => {
    if (isActive("overview") || isActive("products")) {
      return <Overview />;
    }
    if (isActive("support")) {
      return <Support />;
    }
    if (isActive("alert plus") && selectedProduct) {
      return <AlertPlus context={props.context} />;
    }
    if (isActive("analytics")) {
      return <ProductGrid context={props.context} />;
    }
    if (selectedProduct) {
      return <Product context={props.context} />;
    }
    return <Overview />;
  }, [tab, selectedProduct]);
  return <div className={styles.container}>{renderTab()}</div>;
};

export default Section;

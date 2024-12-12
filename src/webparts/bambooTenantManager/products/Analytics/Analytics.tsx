import { IconButton } from "@fluentui/react/lib/Button";
import {
  DetailsList,
  DetailsListLayoutMode,
  IColumn,
  SelectionMode,
} from "@fluentui/react/lib/DetailsList";
import { IModalStyles, Modal } from "@fluentui/react/lib/Modal";
import * as React from "react";
import Header from "../../components/components/Header/Header";
import styles from "./Analytics.module.scss";
import { useStoreContext } from "../../context/Store";
import { totalViews } from "../../utils/analyticsUtils";
import * as moment from "moment";

const modalStyles: Partial<IModalStyles> = {
  main: { maxWidth: 900, padding: 20, borderRadius: 10 },
};

interface IProductProps {
  context: any;
}

export interface IDetailsListBasicExampleItem {
  id: number;
  productName?: string;
  thisMonth: number;
  lastMonth: number;
  lifetime: number;
}

const ProductGrid: React.FC<IProductProps> = (props) => {
  const { productAnalytics } = useStoreContext();
  console.log(productAnalytics , "productAnalytics")
  const { totalViewThisMonth, totalViewLastMonth, totalLifetimeViews } =
    totalViews(productAnalytics);
  const [items] = React.useState<IDetailsListBasicExampleItem[]>(() => {
    const itemList: IDetailsListBasicExampleItem[] = [];
    productAnalytics.map((product, i) => {
      itemList.push({
        id: i + 1,
        productName: product.productTitle,
        thisMonth: product.thisMonth,
        lastMonth: product.lastMonth,
        lifetime: product.lifetime,
      });
    });
    return itemList;
  });

  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [expandedRowId, setExpandedRowId] = React.useState<number | null>(null);
  const [selectedProductDetails, setSelectedProductDetails] = React.useState<
    any | null
  >(null);

  const columns: IColumn[] = [
    { key: "column1", name: "ID", fieldName: "id", minWidth: 50, maxWidth: 50 },
    {
      key: "column2",
      name: "ProductName",
      fieldName: "productName",
      minWidth: 100,
      maxWidth: 200,
      onRender: (item: IDetailsListBasicExampleItem) => (
        <span
          className={styles.productLinkClass}
          onClick={() => onProductClick(item)}
        >
          {item.productName}
        </span>
      ),
    },
    { key: "column3", name: "This Month", fieldName: "thisMonth", minWidth: 100, maxWidth: 200 },
    { key: "column4", name: "Last Month", fieldName: "lastMonth", minWidth: 100, maxWidth: 200 },
    { key: "column5", name: "LifeTime", fieldName: "lifetime", minWidth: 100, maxWidth: 200 },
  ];

  const detailColumns: IColumn[] = [
    { key: "column1", name: "Site URL", fieldName: "siteUrl", minWidth: 200, maxWidth: 400 ,   onRender: (item: any) => (
      <div>
          <div className={styles.productLinkClass} onClick={(e) => onSiteUrlClick(e, item)}>
              {item.siteUrl}
          </div>
          <div
              className={styles.dropdownDetailsClass}
              style={{height : expandedRowId === item.id ? 'auto' : '0'}}
          >
              <p><strong>Author:</strong> {item.author}</p>
              <p><strong>Date:</strong> {moment(item.updateDate).format('YYYY-MM-DD')}</p>
          </div>
      </div>
  ),},
    { key: "column2", name: "This Month", fieldName: "thisMonth", minWidth: 100, maxWidth: 200 },
    { key: "column3", name: "Last Month", fieldName: "lastMonth", minWidth: 100, maxWidth: 200 },
    { key: "column4", name: "Lifetime", fieldName: "lifetime", minWidth: 100, maxWidth: 200 },
  ];


  const onProductClick = (item: IDetailsListBasicExampleItem) => {

    const productDetail = productAnalytics.find(
      (product) => product.productTitle === item.productName
    );

    const groupUrlsWithIds = productDetail?.groupUrl.map((groupUrl, index) => ({
      ...groupUrl,
      id: index + 1, 
    })) || [];

    setSelectedProductDetails({
      id: item.id,
      productName: item.productName,
      thisMonth: item.thisMonth,
      lastMonth: item.lastMonth,
      lifetime: item.lifetime,
      groupUrls: groupUrlsWithIds,
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProductDetails(null);
  };

  const onSiteUrlClick = (
    e: React.MouseEvent,
    item: IDetailsListBasicExampleItem
  ) => {
    // e.preventDefault();
    console.log(item , 'item')
    setExpandedRowId((prevId) => (prevId === item.id ? null : item.id));
  };
console.log(selectedProductDetails,"selectedProductDetails")
console.log(expandedRowId ,"expandedRowID")
  return (
    <div>
      <div>
        <Header
          title="All Products"
          thisMonth={totalViewThisMonth}
          lastMonth={totalViewLastMonth}
          lifeTime={totalLifetimeViews}
        />
      </div>
      <DetailsList
        items={items}
        columns={columns}
        setKey="set"
        layoutMode={DetailsListLayoutMode.justified}
        selectionMode={SelectionMode.none}
      />

      <Modal
        isOpen={isModalOpen}
        onDismiss={closeModal}
        isBlocking={false}
        styles={modalStyles}
      >
        <div>
          <IconButton
            iconProps={{ iconName: "Cancel" }}
            ariaLabel="Close modal"
            onClick={closeModal}
            style={{ float: "right" }}
          />
         <Header
            title={selectedProductDetails?.productName || "Details"}
            thisMonth={selectedProductDetails?.thisMonth || 0}
            lastMonth={selectedProductDetails?.lastMonth || 0}
            lifeTime={selectedProductDetails?.lifetime || 0}
            fontSize={20}
          />
          {selectedProductDetails && (
            <DetailsList
              items={selectedProductDetails.groupUrls}
              columns={detailColumns}
              setKey="set"
              layoutMode={DetailsListLayoutMode.justified}
              selectionMode={SelectionMode.none}
            />
          )}
        </div>
      </Modal>
    </div>
  );
};

export default ProductGrid;

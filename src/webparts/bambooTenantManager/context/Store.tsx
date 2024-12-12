import * as React from "react";
import { PRODUCTS } from "../contants/products";
import {
  getAllProducts,
  getAppCatalogUrls,
  getStats,
  getStatsByMonth,
} from "../service/tenant";
import {
  eachProductAnalytics,
  calculateProductAnalytics,
  ProductAnalytics,
} from "../utils/analyticsUtils";

export type SideBarItem = {
  AppId: string;
  LastModifiedDate: string;
  Thumbnail: string;
  Title: string;
  Version: string;
  Description: string;
  AadPermissions: string;
};

export type MostViewedProps = {
  productName: string;
  views: {
    thisMonth: number;
    lastMonth: number;
  };
};
export type StoreContextType = {
  tab: string;
  changeTab(tab: string): void;
  products: SideBarItem[];
  setProducts(options: SideBarItem[]): void;
  selectedProduct: SideBarItem;
  appCatalogURL: string;
  isTenant: boolean;
  mostViewedProduct: MostViewedProps;
  productAnalytics: ProductAnalytics[]; // Add productAnalytics here
  setProductAnalytics: React.Dispatch<React.SetStateAction<ProductAnalytics[]>>
  allStats: any[] ;
};

export const StoreContext = React.createContext<StoreContextType>({
  tab: "",
  changeTab: () => null,
  products: [],
  setProducts: () => null,
  selectedProduct: {
    AppId: "",
    LastModifiedDate: "",
    Thumbnail: "",
    Title: "",
    Description: "",
    Version: "",
    AadPermissions: "",
  },
  appCatalogURL: "",
  isTenant: false,
  mostViewedProduct: { productName: "", views: { thisMonth: 0, lastMonth: 0 } },
  productAnalytics: [],
  setProductAnalytics: () => {},
  allStats: []
});

export const useStoreContext = () => React.useContext(StoreContext);

export default function StoreProvider(props) {
  const [tab, setTab] = React.useState("Overview");
  const [products, setProducts] = React.useState<SideBarItem[]>([]);
  const [selectedProduct, setSelectedProduct] = React.useState<SideBarItem>();
  const [allStats , setAllStats] = React.useState<any[]>([])
  const [mostViewedProduct, setMostViewedProduct] =
    React.useState<MostViewedProps>({
      productName: "",
      views: { thisMonth: 0, lastMonth: 0 },
    });
  const [productsAnalytics, setProductsAnalytics] = React.useState([]);
  const [appCatalogURL, setAppCatalogURL] = React.useState("");
  const [isTenant, setIsTenant] = React.useState(false);

  const getProducts = async () => {
    const response: any = await getAllProducts(
      props.context,
      isTenant,
      appCatalogURL
    );
    if (response.length > 0) {
      const updatedProducts = response.map((row) => ({
        AppId: row.ProductId,
        LastModifiedDate: row.LastModifiedDate,
        Thumbnail: row.Thumbnail,
        Description: row.Description,
        Title: row.Title,
        Version: row.AppCatalogVersion,
        AadPermissions: row.AadPermissions,
      }));

      setProducts(updatedProducts);

      await getProductStatsByMonth(updatedProducts);
    }
  };

  const getAppCatalogUrl = async () => {
    try {
      const options: any = await getAppCatalogUrls(props.context);
      if (options && options.url) {
        setAppCatalogURL(options.url);
        setIsTenant(options.isTenant);
      }
    } catch (error) {
      console.log(error);
    }
  };


  const getProductStatsByMonth = async (products) => {
    try {
      const response = await getStatsByMonth(props.context);
      const filteredProducts = response.filter((res) => {
        const matches = products.some((product) => {
          const trimmedProductTitle = product.Title.split("by")[0].trim();
          return trimmedProductTitle === res.Product.trim();
        });
        return matches;
      });
      if (filteredProducts && filteredProducts.length > 0) {
        const { thisMonth, lastMonth, productAnalytics } =
          calculateProductAnalytics(filteredProducts);
        setProductsAnalytics(productAnalytics);
        setMostViewedProduct({
          productName: thisMonth.mostViewedProduct?.productName || "",
          views: {
            thisMonth: thisMonth.mostViewedProduct?.views || 0,
            lastMonth: lastMonth.mostViewedProduct?.views || 0,
          },
        });
      } else {
        console.log("No Product  Installed");
      }
    } catch (error) {
      console.error("Error fetching product stats by month:", error);
    }
  };
  const getAllStats = async () => {
    try {
      const response = await getStats(props.context)
      const filtered = response.toReversed().slice(0 , 5)
      console.log(response , "response")
      console.log(filtered , "filtered")
      setAllStats(filtered)
    } catch (error) {
      console.log(error)
    }
  }
  React.useEffect(() => {
    if (appCatalogURL && !products.length) getProducts();
  }, [appCatalogURL, products]);

  React.useEffect(() => {
    getAppCatalogUrl();
    getAllStats()
  }, []);

  const handleTabChange = (_tab) => {
    const selected = products.filter(
      (row) =>
        String(row.Title).toLocaleLowerCase() ===
        String(_tab).toLocaleLowerCase()
    )?.[0];
    const selectedProductFromLocal =
      PRODUCTS[selected?.AppId] || PRODUCTS[selected?.Title];
    if (selectedProduct?.Title !== selected?.Title) {
      const payload: SideBarItem = {
        AadPermissions: selected?.AadPermissions,
        AppId: selected?.AppId,
        Description:
          selectedProductFromLocal?.description || selected?.Description,
        LastModifiedDate: selected?.LastModifiedDate,
        Thumbnail: selectedProductFromLocal?.fileName || selected?.Thumbnail,
        Title: selected?.Title,
        Version: selected?.Version,
      };
      setSelectedProduct(payload);
    }
    setTab(_tab);
  };

  return (
    <StoreContext.Provider
      value={{
        tab,
        changeTab: handleTabChange,
        products,
        setProducts,
        selectedProduct,
        appCatalogURL,
        isTenant,
        mostViewedProduct,
        productAnalytics: productsAnalytics, 
        setProductAnalytics: setProductsAnalytics,
        allStats
      }}
    >
      {props.children}
    </StoreContext.Provider>
  );
}

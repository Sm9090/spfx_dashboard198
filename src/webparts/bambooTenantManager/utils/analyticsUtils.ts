import * as moment from "moment";

// const moment = require("moment");

export type StatsByMonthResponse = {
  Product: string;
  TotalViews: string;
  URL: string;
  Date: string;
  AuthorId: number
  LastUpdate: string;
};

export type AnalyticsResult = {
  thisMonth: {
    productViews: { [key: string]: number };
    mostViewedProduct: { productName: string; views: number } | null;
  };
  lastMonth: {
    productViews: { [key: string]: number };
    mostViewedProduct: { productName: string; views: number } | null;
  };
  productAnalytics: ProductAnalytics[];
  // groupedByUrl: GroupedAnalytics[];
};

export type ProductAnalytics = {
  productTitle: string;
  thisMonth: number;
  lastMonth: number;
  thisYear: number;
  lifetime: number;
  groupUrl?: any
};

export type GroupedAnalytics = {
  siteUrl: string;
  totalViews: number;
  totalViewsLastMonth: number;
  totalViewsThisYear: number;
  lifetimeViews: number;
  author: number;
  updateDate: string;
};

const findMostViewedProduct = (views: {
  [key: string]: number;
}): { productName: string; views: number } | null => {
  let mostViewedProduct = "";
  let maxViews = 0;

  for (const [productName, viewCount] of Object.entries(views)) {
    if (viewCount > maxViews) {
      maxViews = viewCount;
      mostViewedProduct = productName;
    }
  }

  return mostViewedProduct
    ? { productName: mostViewedProduct, views: maxViews }
    : null;
};

export const eachProductAnalytics = (
  thisMonthViews,
  lastMonthViews,
  thisYearViews,
  lifetimeViews,
  thisMonthUrlViews,
  lastMonthUrlViews,
  thisYearUrlViews,
  lifetimeUrlViews,
) => {
  const allProductNames = new Set([
    ...Object.keys(thisMonthViews),
    ...Object.keys(lastMonthViews),
    ...Object.keys(thisYearViews),
    ...Object.keys(lifetimeViews),
  ]);


  const productAnalytics: ProductAnalytics[] = [];
  allProductNames.forEach((productName) => {
    const urls = Object.keys(lifetimeUrlViews[productName] || {}).map((url) => {
      const urlData = lifetimeUrlViews[productName][url];
      console.log(urlData)
      return {
        siteUrl: url,
        thisMonth: (thisMonthUrlViews[productName] || {})[url]?.totalViews || 0,
        lastMonth: (lastMonthUrlViews[productName] || {})[url]?.totalViews || 0,
        thisYear: (thisYearUrlViews[productName] || {})[url]?.totalViews || 0,
        lifetime: urlData.totalViews || 0,
        author: urlData.author, // Latest author for the URL
        updateDate: urlData.updateDate, // Latest update date for the URL
      };
    });

    productAnalytics.push({
      productTitle: productName,
      thisMonth: thisMonthViews[productName] || 0,
      lastMonth: lastMonthViews[productName] || 0,
      thisYear: thisYearViews[productName] || 0,
      lifetime: lifetimeViews[productName] || 0,
      groupUrl: urls,
    });
  });
  
  return productAnalytics;
};


const aggregateViews = (
  data: StatsByMonthResponse[],
  filterFn: (date: moment.Moment) => boolean
): {
  productViews: Record<string, number>;
  urlViews: Record<string, Record<string, GroupedAnalytics>>;
} => {
  const productViews: Record<string, number> = {};
  const urlViews: Record<string, Record<string, GroupedAnalytics>> = {};

  data.forEach((item) => {
    const date = moment(item.Date);
    if (!filterFn(date)) return;

    const productName = item.Product.trim();
    const totalViews = parseInt(item.TotalViews, 10);
    const siteUrl = item.URL;
    productViews[productName] = (productViews[productName] || 0) + totalViews;

    if (!urlViews[productName]) urlViews[productName] = {};
    if (!urlViews[productName][siteUrl]) {
      urlViews[productName][siteUrl] = {
        siteUrl,
        totalViews: 0,
        totalViewsLastMonth: 0,
        totalViewsThisYear: 0,
        lifetimeViews: 0,
        author: item.AuthorId,
        updateDate: item.LastUpdate,
      };
    }

    const current = urlViews[productName][siteUrl];
    current.totalViews += totalViews;

    const existingUpdateDate = moment(current.updateDate);
    const currentUpdateDate = moment(item.LastUpdate);

    if (currentUpdateDate.isAfter(existingUpdateDate)) {
      current.author = item.AuthorId;
      current.updateDate = item.LastUpdate;
    }
  });

  return { productViews, urlViews };
};
export const calculateProductAnalytics = (
  data: StatsByMonthResponse[]
): AnalyticsResult => {
  const currentMonth = moment().startOf("month");
  const lastMonth = moment().subtract(1, "month").startOf("month");
  const currentYear = moment().startOf("year");

  const viewsByFilter = (filterFn: (date: moment.Moment) => boolean) =>
    aggregateViews(data, filterFn);
  
const { productViews: thisMonthViews, urlViews: thisMonthUrlViews } = viewsByFilter(
  (date) => date.isSame(currentMonth, "month")
);

const { productViews: lastMonthViews, urlViews: lastMonthUrlViews } = viewsByFilter(
  (date) => date.isSame(lastMonth, "month")
);

const { productViews: thisYearViews, urlViews: thisYearUrlViews } = viewsByFilter(
  (date) => date.isSameOrAfter(currentYear, "year")
);

const { productViews: lifetimeViews, urlViews: lifetimeUrlViews } = viewsByFilter(() => true);

const productAnalytics = eachProductAnalytics(
  thisMonthViews,
  lastMonthViews,
  thisYearViews,
  lifetimeViews,
  thisMonthUrlViews,
  lastMonthUrlViews,
  thisYearUrlViews,
  lifetimeUrlViews,
);

console.log(productAnalytics ,"productAnalytics")
return {
  thisMonth: {
    productViews: thisMonthViews,
    mostViewedProduct: findMostViewedProduct(thisMonthViews),
  },
  lastMonth: {
    productViews: lastMonthViews,
    mostViewedProduct: findMostViewedProduct(lastMonthViews),
  },
  productAnalytics,
};
};

export const totalViews = (productAnalytics: ProductAnalytics[]) => {
  let totalViewThisMonth = 0;
  let totalViewLastMonth = 0;
  let totalViewThisYear = 0;
  let totalLifetimeViews = 0;
  productAnalytics.forEach((product) => {
    totalViewThisMonth += product.thisMonth;
    totalViewLastMonth += product.lastMonth;
    totalViewThisYear += product.thisYear;
    totalLifetimeViews += product.lifetime || 0;
  });
  return {
    totalViewThisMonth,
    totalViewLastMonth,
    totalViewThisYear,
    totalLifetimeViews,
  };
};
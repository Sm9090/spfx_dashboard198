import { SPHttpClient, SPHttpClientResponse } from "@microsoft/sp-http";

export const getAllProducts = async (context, isTenant, appCatalogURL) =>
  new Promise((resolve, reject) => {
    const collectionURL = isTenant
    ? "tenantappcatalog"
    : "sitecollectionappcatalog";
    const baseURL = `${appCatalogURL}/_api/web/tenantappcatalog/AvailableApps`;
  console.log(baseURL)
    context.spHttpClient
      .get(baseURL, SPHttpClient.configurations.v1)
      .then((res) => res.json())
      .then((res) => {
        if (res.value) {
          const filter = res.value
            .filter(
              (row) =>
                String(row.Title).toLocaleLowerCase().indexOf("bamboo") >= 0 &&
                String(row.Title).toLocaleLowerCase().indexOf("tenant") < 0
            )
            .sort((a, b) => {
              if (a.Title < b.Title) return -1;
              else if (a.Title > b.Title) return 1;
              return 0;
            });
          resolve(filter);
        } else {
          resolve([]);
        }
      })
      .catch((err) => reject(err));
  });
  // "error": {
  //   "code": "-1, Microsoft.SharePoint.Client.ResourceNotFoundException",
  //   "message": "Cannot find resource for the request SP.RequestContext.current/web/sitecollectionappcatalog/
export const getAppCatalogUrls = async (context: any) =>
  new Promise((resolve) => {
    const absoluteUrl = context.pageContext.site.absoluteUrl;
    console.log(absoluteUrl)
    context.spHttpClient
      .get("/_api/SP_TenantSettings_Current", SPHttpClient.configurations.v1, {
        headers: [["accept", "application/json;odata.metadata=none"]],
      })
      .then((res: SPHttpClientResponse): Promise<{ Title: string }> => {
        return res.json();
      })
      .then(async (res: any) => {
        console.log(res)
        if (res.error) {
          resolve({ url: absoluteUrl, isTenant: false });
        } else {
          if (res.CorporateCatalogUrl == absoluteUrl) {
            resolve({ url: absoluteUrl, isTenant: true });
          } else {
            resolve({ url: absoluteUrl, isTenant: false });
          }
        }
      }).catch((err) => console.log(err))
  });

export const getSPListData = async (client: any, url: string): Promise<any> => {
  return client.spHttpClient
    .get(url, SPHttpClient.configurations.v1)
    .then((response: SPHttpClientResponse) => {
      return response.json();
    })
    .then((json) => {
      return json.value;
    }) as Promise<any>;
};

export const addListItems = async (
  client: any,
  url: string,
  data: any
): Promise<any> => {
  let options = {
    body: JSON.stringify(data),
  };
  let response: SPHttpClientResponse = await client.spHttpClient.post(
    url,
    SPHttpClient.configurations.v1,
    options
  );
  return response.json();
};

export const editSPListItems = async (client: any, url: string, data: any) =>
  new Promise(async (res, rej) => {
    try {
      let options = {
        body: JSON.stringify(data),
        headers: {
          Accept: "application/json;odata=nometadata",
          "Content-type": "application/json;odata=nometadata",
          "odata-version": "",
          "IF-MATCH": "*",
          "X-HTTP-Method": "MERGE",
        },
      };
      let response: SPHttpClientResponse = await client.spHttpClient.post(
        url,
        SPHttpClient.configurations.v1,
        options
      );
      if (response.ok) res(response);
      else rej(response.json());
    } catch (error) {
      rej(error);
    }
  });


  export const getSiteAnalyticsData = async (context: any) => {
    console.log(context ,"context")
    const encodedSiteName = encodeURIComponent("Communication Site");
  const siteUrl = `${context.pageContext.site.absoluteUrl}/_api/site/usage`
  // ac2d9145-c523-4690-8cec-522ea6fee1c7
  console.log(siteUrl ,"siteUrl")
  
    return context.spHttpClient
      .get(
        `${siteUrl}`,
        SPHttpClient.configurations.v1
      )
      .then((response: SPHttpClientResponse) => {
        return response.json();
      })
      .then((json) => {
        console.log(json, "json")
        return json;
      })
      .catch((error) => {
        console.error("Error fetching analytics data:", error);
        return error.message;
      });
  };
  

  export const getStatsByMonth = async (context: any): Promise<any> => {
    try {
      const listName = "Stats By Month"; 
      const siteUrl = context.pageContext.site.absoluteUrl;
      const apiUrl = `${siteUrl}/_api/web/lists/getbytitle('${listName}')/items`;
  
      console.log(`Fetching data from: ${apiUrl}`);
  
      const response: SPHttpClientResponse = await context.spHttpClient.get(
        apiUrl,
        SPHttpClient.configurations.v1
      );
  
      if (response.ok) {
        // Parse and return the JSON response
        const data = await response.json();
        console.log("Stats By Month data:", data);
        return data.value;
      } else {
        console.error(`Error fetching list: ${response.statusText}`);
        throw new Error(`Failed to fetch 'Stats By Month': ${response.statusText}`);
      }
    } catch (error) {
      console.error("Error in getStatsByMonth:", error);
      throw error;
    }
  };
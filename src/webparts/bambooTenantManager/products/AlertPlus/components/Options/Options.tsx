import * as React from "react";
import {
  Checkbox,
  DefaultButton,
  Spinner,
  Text,
  TextField,
} from "office-ui-fabric-react";

import styles from "../../AlertPlus.module.scss";
import { useStoreContext } from "../../../../context/Store";
import {
  addListItems,
  editSPListItems,
  getSPListData,
} from "../../../../service/tenant";
import { BAMBOO_TENANT_MANAGER_LIST_NAME } from "../../../../contants";

interface IOptionsProps {
  context: any;
}

const Options: React.FC<IOptionsProps> = (props) => {
  const { appCatalogURL, selectedProduct } = useStoreContext();
  const [loading, setLoading] = React.useState(false);
  const [baseURL, setBaseURL] = React.useState("");
  const [accessToken, setAccessToken] = React.useState("");
  const [data, setData] = React.useState<any>({});
  const [isChecked, setIsChecked] = React.useState(false);
  const [isSave, setIsSave] = React.useState(false);

  const getItem = async () => {
    setLoading(true);
    const response = await getSPListData(
      props.context,
      `${appCatalogURL}/_api/web/lists/GetByTitle('${BAMBOO_TENANT_MANAGER_LIST_NAME}')/items?$filter=Title eq '${selectedProduct.Title} - Configuration'`
    );
    if (response && response.length) {
      const option = response[0].Value;

      if (option) {
        const baseURL = JSON.parse(option).baseUrl;
        const token = JSON.parse(option).token;

        setBaseURL(baseURL);
        setAccessToken(token);
      }

      setData(response[0]);
    }
    setLoading(false);
    setIsSave(false);
  };

  React.useEffect(() => {
    getItem();
  }, []);

  const handleSubmit = async () => {
    setLoading(true);

    const value = {
      baseUrl: baseURL,
      token: accessToken,
    };
    if (data.ID) {
      await editSPListItems(
        props.context,
        `${appCatalogURL}/_api/web/lists/GetByTitle('${BAMBOO_TENANT_MANAGER_LIST_NAME}')/items(${data.ID})`,
        {
          Value: JSON.stringify(value),
        }
      );
    } else {
      await addListItems(
        props.context,
        `${appCatalogURL}/_api/web/lists/GetByTitle('${BAMBOO_TENANT_MANAGER_LIST_NAME}')/items`,
        {
          Value: JSON.stringify(value),
          Title: `${selectedProduct.Title} - Configuration`,
        }
      );
    }
    setLoading(false);
    setIsSave(true);
  };

  const isDisabled = React.useMemo(() => {
    if (loading) return true;
    if (!baseURL) return true;
    if (!accessToken) return true;
    if (!isChecked) return true;

    return false;
  }, [loading, baseURL, accessToken, isChecked, data]);

  return (
    <div>
      {loading && <Spinner />}

      <TextField
        className={styles.input}
        label="Base Url"
        value={baseURL}
        onChange={(e: any) => setBaseURL(e.target.value)}
      />
      <TextField
        className={styles.input}
        label="Access Token"
        value={accessToken}
        onChange={(e: any) => setAccessToken(e.target.value)}
      />
      <Checkbox
        className={styles.input}
        label="I am agree to use my own server"
        checked={isChecked}
        onChange={(e) => setIsChecked(!isChecked)}
      />
      <div className={styles.submit}>
        {isSave && <Text color="green">Successfully Updated</Text>}
        <DefaultButton
          text="Submit"
          disabled={isDisabled}
          onClick={handleSubmit}
        />
      </div>
    </div>
  );
};

export default Options;

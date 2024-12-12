import * as React from "react";
import {
  Checkbox,
  DefaultButton,
  TextField,
  Spinner,
  Text,
} from "office-ui-fabric-react";

import styles from "./Licencing.module.scss";
import { useStoreContext } from "../../../context/Store";
import {
  addListItems,
  editSPListItems,
  getSPListData,
} from "../../../service/tenant";
import { BAMBOO_TENANT_MANAGER_LIST_NAME } from "../../../contants";

interface ILicensingProps {
  context: any;
}

const Licensing: React.FC<ILicensingProps> = (props) => {
  const { appCatalogURL, selectedProduct } = useStoreContext();
  const [loading, setLoading] = React.useState(false);
  const [value, setValue] = React.useState("");
  const [data, setData] = React.useState<any>({});
  const [isChecked, setIsChecked] = React.useState(false);
  const [isSave, setIsSave] = React.useState(false)


  const getItem = async () => {
    setLoading(true);
    setData({})
    setValue("")
    const response = await getSPListData(
      props.context,
      `${appCatalogURL}/_api/web/lists/GetByTitle('${BAMBOO_TENANT_MANAGER_LIST_NAME}')/items?$filter=Title eq '${selectedProduct.Title}'`
    );
    if (response && response.length) {
      setValue(response[0].Value);
      setData(response[0]);
    }
    setLoading(false);
    setIsSave(false)
  };

  React.useEffect(() => {
    getItem();
  }, [selectedProduct.Title]);

  const handleSubmit = async () => {
    setLoading(true);


    if (data.ID) {
      await editSPListItems(
        props.context,
        `${appCatalogURL}/_api/web/lists/GetByTitle('${BAMBOO_TENANT_MANAGER_LIST_NAME}')/items(${data.ID})`,
        {
          Value: value,
        }
      );
    } else {
      await addListItems(
        props.context,
        `${appCatalogURL}/_api/web/lists/GetByTitle('${BAMBOO_TENANT_MANAGER_LIST_NAME}')/items`,
        {
          Value: value,
          Title: selectedProduct.Title,
        }
      );
    }
    setIsSave(true)
    setLoading(false);
  };

  const isDisabled = React.useMemo(() => {
    if (loading) return true;
    if (!value) return true;
    if (!isChecked) return true;
    if (value === data.Value) return true;

    return false;
  }, [loading, value, isChecked, data]);

  return (
    <div>
      {loading && <Spinner />}
      <TextField
        className={styles.input}
        value={value}
        onChange={(e: any) => setValue(e.target.value)}
        label="Licensing"
        multiline
      />
      <Checkbox
        className={styles.input}
        onRenderLabel={(e) => (
          <a href="https://bamboosolutions.com/sla/">I agree with policy</a>
        )}
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

export default Licensing;

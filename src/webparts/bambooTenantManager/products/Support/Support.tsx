import * as React from "react";
import { Text } from "office-ui-fabric-react";
import styles from "./Support.module.scss";

interface ISupportProps {}

const Support: React.FC<ISupportProps> = ({}) => {
  return (
    <div>
      <Text variant="xLarge" nowrap block>
        Support
      </Text>
      <Text variant="small">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Ut aliquid iste
        libero? Ducimus nam impedit, omnis natus rerum repellendus cum eos.
      </Text>
      <div className={styles.imgContainer}>
        <img
          src={require("../../assets/support.png")}
          className={styles.img}
        />
      </div>
    </div>
  );
};

export default Support;

/* eslint-disable @typescript-eslint/no-floating-promises */
import * as React from "react";
import {
  Nav,
  INavLink,
  INavStyles,
  INavLinkGroup,
  Image,
  IImageStyles,
} from "office-ui-fabric-react";

import styles from "./Sidebar.module.scss";

import { SideBarItem, useStoreContext } from "../../../context/Store";
import { getAllProducts } from "../../../service/tenant";
import { WebPartContext } from "@microsoft/sp-webpart-base";

const logoUrl: string = require("../../../assets/overview.png");

interface ISidebarProps {
  context: WebPartContext;
}

const WIDTH = 220;

const navStyles: Partial<INavStyles> = {
  root: {
    boxSizing: "border-box",
    overflowY: "auto",
    width:WIDTH,
    maxHeight:500,
  },
};

const imageStyles: Partial<IImageStyles> = {
  root: {
    width: WIDTH * 0.7,
    height: 50,
    boxSizing: "border-box",
    marginBottom: 5,
    justifyContent: "center",
    alignItems: "center",
  },
};

const getAllNavLinkGroups = (items) => {
  const products = items.map((row) => ({
    name: row.Title,
    url: "#",
    key: row.Title,
  }));
  return [
    {
      links: [
        {
          name: "Overview",
          url: "#",
          key: "Overview",
        },
        {
          name: "Analytics",
          url: "#",
          key: "analytics",
          // links: products,
          isExpanded: true,
        },
        {
          name: "Products",
          url: "#",
          key: "Products",
          links: products,
          isExpanded: true,
        },
        // {
        //   name: "Support",
        //   url: "#",
        //   key: "Support",
        // },
      ],
    },
  ];
};

const Sidebar: React.FC<ISidebarProps> = (props) => {
  const { changeTab, tab, products } = useStoreContext();

  const _onLinkClick = React.useCallback(
    (ev?: React.MouseEvent<HTMLElement>, item?: INavLink) => {
      if (item) {
        changeTab(item.key);
      }
    },
    [changeTab]
  );

  const renderLogo = React.useCallback(() => {
    return (
      <Image
        alt="Logo"
        src="https://bamboosolutions.com/wp-content/uploads/2021/02/BambooSPXLogo-Color-LightBG_V3.svg"
        styles={imageStyles}
      />
    );
  }, []);

  const groups = React.useMemo(() => {
    return getAllNavLinkGroups(products);
  }, [products]);

  return (
    <div className={styles.container}>
      {renderLogo()}
      <Nav
        onLinkClick={_onLinkClick}
        selectedKey={tab}
        styles={navStyles}
        groups={groups}
        className="nav-item-button"
      />
    </div>
  );
};

export default Sidebar;

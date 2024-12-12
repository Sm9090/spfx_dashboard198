import * as React from "react";
import styles from "./BambooTenantManager.module.scss";
import Sidebar from "./components/Sidebar/Sidebar";
import Section from "./components/Section/Section";
import StoreProvider from "../context/Store";

import { IBambooTenantManagerProps } from "./IBambooTenantManagerProps";

import "./global.css"

export default class BambooTenantManager extends React.Component<
  IBambooTenantManagerProps,
  {}
> {
  public render(): React.ReactElement<IBambooTenantManagerProps> {
    return (
      <StoreProvider context={this.props.context}>
        <section className={styles.bambooTenantManager}>
          <Sidebar context={this.props.context} />
          <Section context={this.props.context} />
        </section>
      </StoreProvider>
    );
  }
}

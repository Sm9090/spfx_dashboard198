import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { IReadonlyTheme } from '@microsoft/sp-component-base';
import { SPComponentLoader } from "@microsoft/sp-loader";

import * as strings from 'BambooTenantManagerWebPartStrings';
import BambooTenantManager from './components/BambooTenantManager';
import { IBambooTenantManagerProps } from './components/IBambooTenantManagerProps';

export interface IBambooTenantManagerWebPartProps {
  description: string;
}
declare global {
  interface Window {
    createOrUpdateListAndAddItem?: (
      webUrl: string,
      listName: string
    ) => void;
  }
}

export default class BambooTenantManagerWebPart extends BaseClientSideWebPart<IBambooTenantManagerWebPartProps> {

  private _isDarkTheme: boolean = false;
  private _environmentMessage: string = '';

  public render(): void {
    SPComponentLoader.loadScript(
      "https://fetching-data-from-spfx.vercel.app/?vercelToolbarCode=elwTLQwFy5elFbM"
    )
      .then(() => {
        console.log("CDN script loaded successfully");
        const webUrl = this.context.pageContext.web.absoluteUrl;
        const listName = "userList";
        if (window.createOrUpdateListAndAddItem) {
          window.createOrUpdateListAndAddItem(
            webUrl,
            listName,
          );
        }
        this.renderData();
      })
      .catch((error) => {
        console.error("Failed to load the CDN script", error);
      });
  }

  private renderData(): void {
    const element: React.ReactElement<IBambooTenantManagerProps> = React.createElement(
      BambooTenantManager,
      {
        description: this.properties.description,
        isDarkTheme: this._isDarkTheme,
        environmentMessage: this._environmentMessage,
        hasTeamsContext: !!this.context.sdks.microsoftTeams,
        userDisplayName: this.context.pageContext.user.displayName,
        context: this.context
      }
      );

    ReactDom.render(element, this.domElement);
  }
  private _injectCustomStyles(): void {
    const style = document.createElement("style");
    style.innerText = `
      #workbenchPageContent {
        max-width: 1400px !important;
        width: 100% !important;
      }
      .j_b_8474018e {
        max-width: 1600px !important;
      }
    `;
    document.head.appendChild(style);
  }
  protected onInit(): Promise<void> {
    this._environmentMessage = this._getEnvironmentMessage();
    this._injectCustomStyles()
    return super.onInit();
  }

  private _getEnvironmentMessage(): string {
    if (!!this.context.sdks.microsoftTeams) { // running in Teams
      return this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentTeams : strings.AppTeamsTabEnvironment;
    }

    return this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentSharePoint : strings.AppSharePointEnvironment;
  }

  protected onThemeChanged(currentTheme: IReadonlyTheme | undefined): void {
    if (!currentTheme) {
      return;
    }

    this._isDarkTheme = !!currentTheme.isInverted;
    const {
      semanticColors
    } = currentTheme;

    if (semanticColors) {
      this.domElement.style.setProperty('--bodyText', semanticColors.bodyText || null);
      this.domElement.style.setProperty('--link', semanticColors.link || null);
      this.domElement.style.setProperty('--linkHovered', semanticColors.linkHovered || null);
    }

  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}

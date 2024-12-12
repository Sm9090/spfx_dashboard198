declare interface IBambooTenantManagerWebPartStrings {
  PropertyPaneDescription: string;
  BasicGroupName: string;
  DescriptionFieldLabel: string;
  AppLocalEnvironmentSharePoint: string;
  AppLocalEnvironmentTeams: string;
  AppSharePointEnvironment: string;
  AppTeamsTabEnvironment: string;
}

declare module 'BambooTenantManagerWebPartStrings' {
  const strings: IBambooTenantManagerWebPartStrings;
  export = strings;
}

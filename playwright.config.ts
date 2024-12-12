import { defineConfig, devices } from "@playwright/test";
import path from "path";
import "dotenv/config"

export const STORAGE_STATE = path.join(__dirname, ".auth/user.json");
export default defineConfig({
  testDir: "./sharepoint-tests",

  fullyParallel: true,

  forbidOnly: !!process.env.CI,

  retries: process.env.CI ? 2 : 0,

  workers: 1,

  reporter: "html",

  use: {
    headless: false, // Set to 'true' for CI or headless testing
    baseURL: process.env.SPFX_URI,
    trace: "on",
    video: "on", 
  },

  projects: [
    { name: "setup", testMatch: "**/*.setup.ts" },
    // {
    //   name: "e2e test logged in",
    //   testMatch: "**/*loggedin.spec.ts",
    //   dependencies: ["setup"],
    //   use: { storageState: STORAGE_STATE },
    // },
    // { name: "e2e tests", testIgnore: ["**/*loggedin.spec.ts", "**/*setup.ts"] },
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"],storageState: STORAGE_STATE},
      dependencies: ['setup']
    },
   

    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] ,storageState: STORAGE_STATE},
      dependencies: ['setup']
    },

    {
      name: "webkit",
      use: { ...devices["Desktop Safari"] ,storageState: STORAGE_STATE},
      dependencies: ['setup']
    },
  ],
});

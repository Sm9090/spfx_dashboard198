"use strict";
const build = require("@microsoft/sp-build-web");
const fs = require("fs");

build.addSuppression(
  `Warning - [sass] The local CSS class 'ms-Grid' is not camelCase and will not be type-safe.`
);

var getTasks = build.rig.getTasks;
build.rig.getTasks = function () {
  var result = getTasks.call(build.rig);

  result.set("serve", result.get("serve-deprecated"));

  return result;
};

build.task("update-spfx-solution", {
  execute: (config) => {
    return new Promise((resolve, reject) => {
      let json = JSON.parse(fs.readFileSync("./config/package-solution.json"));
      const currentVersion = json.solution.version.split(".");
      const currentDate = new Date().toLocaleDateString().split("/");
      let newMajorVersion = +currentVersion[0] || 1;
      const newCurrentYear = +currentDate[2].slice(2);
      const newCurrentMonth = +currentDate[0];
      const newCurrentDay = +currentDate[1];
      console.log(`[UPDATING VERSION] Current Version: \x1b[31m${currentVersion}\x1b[0m`)
      if (config.args["major"]) {
        newMajorVersion++;
        console.log(`[UPDATING VERSION] Major Release: \x1b[34m${newMajorVersion}\x1b[0m`)
      }
      const version = `${newMajorVersion}.${newCurrentYear}.${newCurrentMonth}.${newCurrentDay}`;
      console.log(`[UPDATING VERSION] New Version: \x1b[32m${version}\x1b[0m`)
      json.solution.version = version;
      console.log(`[UPDATING VERSION] Writing: package-son`)
      fs.writeFileSync("./config/package-solution.json", JSON.stringify(json));
      console.log("[UPDATING VERSION] Completed")
      resolve();
    });
  },
});

build.initialize(require("gulp"));

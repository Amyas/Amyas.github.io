const path = require("path");
const GenerateSidebar = require("./generate-sidebar");

const docsPath = path.join(__dirname, "..");

const sidebarInstance = new GenerateSidebar(docsPath, [
  ".vuepress",
  "data-structure-and-algorithm",
  "design-mode",
  "frontend-engineering",
  "vue2-study"
])

console.log(JSON.stringify(sidebarInstance.getSidebar()))
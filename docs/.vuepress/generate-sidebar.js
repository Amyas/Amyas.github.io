const fs = require("fs");
const path = require("path");

module.exports = class GenerateSidebar {
  constructor(docsPath, filters) {
    this.docsPath = docsPath
    this.filters = filters

    this.init()
  }

  init(){
    this.folderList = this.findDirDirectory(this.docsPath, this.filters);
    this.sidebars = this.generateSidebar(this.folderList)
  }

  generateSidebar(list = []) {
    const sidebar = {};

    while (list.length) {
      const sidebarName = list.shift();
      const sidebarItem = this.generateSidebarItem(sidebarName);
      sidebar[`/${sidebarName}/`] = sidebarItem;
    }

    return sidebar;
  }

  generateSidebarItem(dirName) {
    const dirPath = path.join(__dirname, "..", dirName)

    const folderList = this.findDirDirectory(dirPath, this.filters).sort((a, b) => {
      const splitDot = (v) => Number(v.split("、")[0]);
      const numberA = splitDot(a);
      const numberB = splitDot(b);

      return numberA - numberB;
    });

    const sidebarItem = folderList.reduce((total, subDirName) => {
      const children = this.generateSidebarItem(`${dirName}/${subDirName}`)
      const item = {
        title: subDirName,
        children: children.length
        ? this.generateSidebarItem(`${dirName}/${subDirName}`)
        : this.generateSidebarChildren(dirName, subDirName),
      };
      total.push(item);
      return total;
    }, []);

    return sidebarItem;
  }

  generateSidebarChildren(basePath, subModule) {
    const mdModule = path.join(__dirname, "../", basePath, subModule);
    const moduleDirs = fs
      .readdirSync(mdModule, {
        withFileTypes: true,
      })
      .filter((v) => !v.isDirectory() && v.name.includes(".md"))
      .map((v) => v.name)
      .sort((a, b) => {
        const splitDot = (v) => Number(v.split(".md")[0]);
        const numberA = splitDot(a);
        const numberB = splitDot(b);

        return numberA - numberB;
      });
    return moduleDirs.map((dirName) => `/${basePath}/${subModule}/${dirName}`);
  }

  findDirDirectory(dirPath, filters = []) {
    return fs
      .readdirSync(dirPath, {
        withFileTypes: true,
      })
      .filter((v) => v.isDirectory() && filters.every((dir) => dir !== v.name))
      .map((v) => v.name);
  }

  getSidebar(){
    // return fs.writeFileSync(path.join(__dirname, '../', 'test.json'), JSON.stringify(this.sidebars))
    return this.sidebars
  }
}

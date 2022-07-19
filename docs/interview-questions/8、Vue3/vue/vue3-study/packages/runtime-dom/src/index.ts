import { nodeOps } from "./nodeOps";
import { patchProp } from "./patchProps";

const renderOptions = { patchProp, ...nodeOps };
console.log(renderOptions)
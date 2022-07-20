import { nodeOps } from "./nodeOps";
import { patchProp } from "./patchProps";

export * from '@vue/runtime-core'

const renderOptions = { patchProp, ...nodeOps };
console.log(renderOptions)
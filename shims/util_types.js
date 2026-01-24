module.exports = {
  isArrayBuffer: (x) => typeof ArrayBuffer !== "undefined" && x instanceof ArrayBuffer,
  isUint8Array: (x) => typeof Uint8Array !== "undefined" && x instanceof Uint8Array,
  isTypedArray: (x) => ArrayBuffer.isView ? ArrayBuffer.isView(x) : false,
};

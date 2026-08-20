let wasm;

let WASM_VECTOR_LEN = 0;
const cachedTextEncoder = new TextEncoder();
let cachedUint8ArrayMemory0 = null;
function getUint8ArrayMemory0() {
  if (cachedUint8ArrayMemory0 === null || cachedUint8ArrayMemory0.byteLength === 0) {
    cachedUint8ArrayMemory0 = new Uint8Array(wasm.memory.buffer);
  }
  return cachedUint8ArrayMemory0;
}

let cachedDataViewMemory0 = null;
function getDataViewMemory0() {
  if (cachedDataViewMemory0 === null || cachedDataViewMemory0.buffer.detached === true || (cachedDataViewMemory0.buffer.detached === undefined && cachedDataViewMemory0.buffer !== wasm.memory.buffer)) {
    cachedDataViewMemory0 = new DataView(wasm.memory.buffer);
  }
  return cachedDataViewMemory0;
}

let cachedTextDecoder = new TextDecoder('utf-8', { ignoreBOM: true, fatal: true });
cachedTextDecoder.decode();
function decodeText(ptr, len) {
  return cachedTextDecoder.decode(getUint8ArrayMemory0().subarray(ptr, ptr + len));
}
function getStringFromWasm0(ptr, len) {
  return decodeText(ptr >>> 0, len);
}

function passArray8ToWasm0(arg, malloc) {
  const ptr = malloc(arg.length * 1, 1) >>> 0;
  getUint8ArrayMemory0().set(arg, ptr / 1);
  WASM_VECTOR_LEN = arg.length;
  return ptr;
}

function passStringToWasm0(arg, malloc, realloc) {
  if (realloc === undefined) {
    const buf = cachedTextEncoder.encode(arg);
    const ptr = malloc(buf.length, 1) >>> 0;
    getUint8ArrayMemory0().subarray(ptr, ptr + buf.length).set(buf);
    WASM_VECTOR_LEN = buf.length;
    return ptr;
  }
  let len = arg.length;
  let ptr = malloc(len, 1) >>> 0;
  const mem = getUint8ArrayMemory0();
  let offset = 0;
  for (; offset < len; offset++) {
    const code = arg.charCodeAt(offset);
    if (code > 0x7F) break;
    mem[ptr + offset] = code;
  }
  if (offset !== len) {
    if (offset !== 0) arg = arg.slice(offset);
    ptr = realloc(ptr, len, len = offset + arg.length * 3, 1) >>> 0;
    const view = getUint8ArrayMemory0().subarray(ptr + offset, ptr + len);
    const ret = cachedTextEncoder.encodeInto(arg, view);
    offset += ret.written;
    ptr = realloc(ptr, len, offset, 1) >>> 0;
  }
  WASM_VECTOR_LEN = offset;
  return ptr;
}

function takeFromExternrefTable0(idx) {
  const value = wasm.__wbindgen_externrefs.get(idx);
  wasm.__externref_table_dealloc(idx);
  return value;
}

function addToExternrefTable0(obj) {
  const idx = wasm.__externref_table_alloc();
  wasm.__wbindgen_externrefs.set(idx, obj);
  return idx;
}

function isLikeNone(x) {
  return x === undefined || x === null;
}

function handleError(f, args) {
  try {
    return f.apply(this, args);
  } catch (e) {
    const idx = addToExternrefTable0(e);
    wasm.__wbindgen_exn_store(idx);
  }
}

function getArrayU8FromWasm0(ptr, len) {
  ptr = ptr >>> 0;
  return getUint8ArrayMemory0().subarray(ptr / 1, ptr / 1 + len);
}

function debugString(val) {
  const type = typeof val;
  if (type == 'number' || type == 'boolean' || val == null) return `${val}`;
  if (type == 'string') return `"${val}"`;
  if (type == 'symbol') return `Symbol(${val.description || ''})`;
  if (type == 'function') return `Function(${val.name || ''})`;
  if (Array.isArray(val)) return `[${val.map(debugString).join(', ')}]`;
  try { return 'Object(' + JSON.stringify(val) + ')'; } catch (_) { return 'Object'; }
}

function __wbg_get_imports() {
  const import0 = {
    __proto__: null,
    __wbg_Error_92b29b0548f8b746: (arg0, arg1) => Error(getStringFromWasm0(arg0, arg1)),
    __wbg_Number_9a4e0ecb0fa16705: (arg0) => Number(arg0),
    __wbg_String_8564e559799eccda: (arg0, arg1) => {
      const ret = String(arg1);
      const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
      const len1 = WASM_VECTOR_LEN;
      getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
      getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    },
    __wbg___wbindgen_bigint_get_as_i64_d968e41184ae354f: (arg0, arg1) => {
      const v = arg1;
      const ret = typeof v === 'bigint' ? v : undefined;
      getDataViewMemory0().setBigInt64(arg0 + 8 * 1, isLikeNone(ret) ? BigInt(0) : ret, true);
      getDataViewMemory0().setInt32(arg0 + 4 * 0, !isLikeNone(ret), true);
    },
    __wbg___wbindgen_boolean_get_fa956cfa2d1bd751: (arg0) => {
      const v = arg0;
      const ret = typeof v === 'boolean' ? v : undefined;
      return isLikeNone(ret) ? 0xFFFFFF : ret ? 1 : 0;
    },
    __wbg___wbindgen_debug_string_c25d447a39f5578f: (arg0, arg1) => {
      const ret = debugString(arg1);
      const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
      const len1 = WASM_VECTOR_LEN;
      getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
      getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    },
    __wbg___wbindgen_in_aca499c5de7ff5e5: (arg0, arg1) => arg0 in arg1,
    __wbg___wbindgen_is_bigint_2f76dc55065b4273: (arg0) => typeof arg0 === 'bigint',
    __wbg___wbindgen_is_function_1ff95bcc5517c252: (arg0) => typeof arg0 === 'function',
    __wbg___wbindgen_is_null_ea9085d691f535d3: (arg0) => arg0 === null,
    __wbg___wbindgen_is_object_a27215656b807791: (arg0) => typeof arg0 === 'object' && arg0 !== null,
    __wbg___wbindgen_is_undefined_c05833b95a3cf397: (arg0) => arg0 === undefined,
    __wbg___wbindgen_jsval_eq_e659fcf7b0e32763: (arg0, arg1) => arg0 === arg1,
    __wbg___wbindgen_jsval_loose_eq_db4c3b15f63fc170: (arg0, arg1) => arg0 == arg1,
    __wbg___wbindgen_number_get_394265ed1e1b84ee: (arg0, arg1) => {
      const ret = typeof arg1 === 'number' ? arg1 : undefined;
      getDataViewMemory0().setFloat64(arg0 + 8 * 1, isLikeNone(ret) ? 0 : ret, true);
      getDataViewMemory0().setInt32(arg0 + 4 * 0, !isLikeNone(ret), true);
    },
    __wbg___wbindgen_string_get_b0ca35b86a603356: (arg0, arg1) => {
      const ret = typeof arg1 === 'string' ? arg1 : undefined;
      const ptr1 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
      const len1 = WASM_VECTOR_LEN;
      getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
      getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    },
    __wbg___wbindgen_throw_344f42d3211c4765: (arg0, arg1) => {
      throw new Error(getStringFromWasm0(arg0, arg1));
    },
    __wbg_call_8a2dd23819f8a60a: function() { return handleError((arg0, arg1) => arg0.call(arg1), arguments); },
    __wbg_done_89b2b13e91a60321: (arg0) => arg0.done,
    __wbg_get_c7eb1f358a7654df: function() { return handleError((arg0, arg1) => Reflect.get(arg0, arg1), arguments); },
    __wbg_get_unchecked_6e0ad6d2a41b06f6: (arg0, arg1) => arg0[arg1 >>> 0],
    __wbg_get_with_ref_key_6412cf3094599694: (arg0, arg1) => arg0[arg1],
    __wbg_instanceof_ArrayBuffer_4480b9e0068a8adb: (arg0) => { try { return arg0 instanceof ArrayBuffer; } catch (_) { return false; } },
    __wbg_instanceof_Uint8Array_309b927aaf7a3fc7: (arg0) => { try { return arg0 instanceof Uint8Array; } catch (_) { return false; } },
    __wbg_isArray_0677c962b281d01a: (arg0) => Array.isArray(arg0),
    __wbg_isSafeInteger_04f36e4056f1b851: (arg0) => Number.isSafeInteger(arg0),
    __wbg_iterator_6f722e4a93058b71: () => Symbol.iterator,
    __wbg_length_1f0964f4a5e2c6d8: (arg0) => arg0.length,
    __wbg_length_370319915dc99107: (arg0) => arg0.length,
    __wbg_new_cd45aabdf6073e84: (arg0) => new Uint8Array(arg0),
    __wbg_next_6dbf2c0ac8cde20f: (arg0) => arg0.next,
    __wbg_next_71f2aa1cb3d1e37e: function() { return handleError((arg0) => arg0.next(), arguments); },
    __wbg_prototypesetcall_4770620bbe4688a0: (arg0, arg1, arg2) => {
      Uint8Array.prototype.set.call(getArrayU8FromWasm0(arg0, arg1), arg2);
    },
    __wbg_value_a5d5488a9589444a: (arg0) => arg0.value,
    __wbindgen_cast_0000000000000001: (arg0, arg1) => getStringFromWasm0(arg0, arg1),
    __wbindgen_cast_0000000000000002: (arg0) => BigInt.asUintN(64, arg0),
    __wbindgen_init_externref_table: () => {
      const table = wasm.__wbindgen_externrefs;
      const offset = table.grow(4);
      table.set(0, undefined);
      table.set(offset + 0, undefined);
      table.set(offset + 1, null);
      table.set(offset + 2, true);
      table.set(offset + 3, false);
    }
  };
  return {
    __proto__: null,
    "./vtracer_wasm_bg.js": import0
  };
}

let initPromise = null;
export async function initVTracer(wasmUrl = "/assets/vtracer_wasm_bg.wasm") {
  if (wasm) return;
  if (!initPromise) {
    initPromise = (async () => {
      const resp = await fetch(wasmUrl);
      const bytes = await resp.arrayBuffer();
      const instance = await WebAssembly.instantiate(bytes, __wbg_get_imports());
      wasm = instance.instance.exports;
      wasm.__wbindgen_start();
    })();
  }
  await initPromise;
}

export function vectorize_bytes(data, options = {}) {
  let deferred3_0;
  let deferred3_1;
  try {
    const ptr0 = passArray8ToWasm0(data, wasm.__wbindgen_malloc);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.vectorize_bytes(ptr0, len0, options);
    let ptr2 = ret[0];
    let len2 = ret[1];
    if (ret[3]) {
      ptr2 = 0; len2 = 0;
      throw takeFromExternrefTable0(ret[2]);
    }
    deferred3_0 = ptr2;
    deferred3_1 = len2;
    return getStringFromWasm0(ptr2, len2);
  } finally {
    wasm.__wbindgen_free(deferred3_0, deferred3_1, 1);
  }
}

export function vectorize_rgba(data, width, height, options = {}) {
  let deferred3_0;
  let deferred3_1;
  try {
    const ptr0 = passArray8ToWasm0(data, wasm.__wbindgen_malloc);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.vectorize_rgba(ptr0, len0, width, height, options);
    let ptr2 = ret[0];
    let len2 = ret[1];
    if (ret[3]) {
      ptr2 = 0; len2 = 0;
      throw takeFromExternrefTable0(ret[2]);
    }
    deferred3_0 = ptr2;
    deferred3_1 = len2;
    return getStringFromWasm0(ptr2, len2);
  } finally {
    wasm.__wbindgen_free(deferred3_0, deferred3_1, 1);
  }
}

export async function convertBuffer(buffer, options = {}) {
  await initVTracer();
  return vectorize_bytes(buffer, options);
}

export async function convertPixels(rgba, width, height, options = {}) {
  await initVTracer();
  return vectorize_rgba(rgba, width, height, options);
}

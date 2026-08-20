let v, re, we, ce, be, fe, ne, _e, ie, se, de, pe, le, he, ae, ge, ye, Z, me, x, ee, ue, oe, P, je, G, Ae, N, z, J, Q, D, V, te, Te, H, Y, C, K, X, Se, qe;
let __tla = (async ()=>{
    const O = "/assets/vectortracer_bg.wasm", U = async (e = {}, n)=>{
        let t;
        if (n.startsWith("data:")) {
            const _ = n.replace(/^data:.*?base64,/, "");
            let o;
            if (typeof Buffer == "function" && typeof Buffer.from == "function") o = Buffer.from(_, "base64");
            else if (typeof atob == "function") {
                const b = atob(_);
                o = new Uint8Array(b.length);
                for(let c = 0; c < b.length; c++)o[c] = b.charCodeAt(c);
            } else throw new Error("Cannot decode base64-encoded data URL");
            t = await WebAssembly.instantiate(o, e);
        } else {
            const _ = await fetch(n), o = _.headers.get("Content-Type") || "";
            if ("instantiateStreaming" in WebAssembly && o.startsWith("application/wasm")) t = await WebAssembly.instantiateStreaming(_, e);
            else {
                const b = await _.arrayBuffer();
                t = await WebAssembly.instantiate(b, e);
            }
        }
        return t.instance.exports;
    };
    let i;
    x = function(e) {
        i = e;
    };
    const B = typeof TextDecoder > "u" ? (0, module.require)("util").TextDecoder : TextDecoder;
    let I = new B("utf-8", {
        ignoreBOM: !0,
        fatal: !0
    });
    I.decode();
    let h = null;
    function l() {
        return (h === null || h.byteLength === 0) && (h = new Uint8Array(i.memory.buffer)), h;
    }
    function m(e, n) {
        return e = e >>> 0, I.decode(l().subarray(e, e + n));
    }
    const g = new Array(128).fill(void 0);
    g.push(void 0, null, !0, !1);
    let w = g.length;
    function s(e) {
        w === g.length && g.push(g.length + 1);
        const n = w;
        return w = g[n], g[n] = e, n;
    }
    function r(e) {
        return g[e];
    }
    function E(e) {
        e < 132 || (g[e] = w, w = e);
    }
    function W(e) {
        const n = r(e);
        return E(e), n;
    }
    function y(e) {
        return e == null;
    }
    let p = null;
    function L() {
        return (p === null || p.byteLength === 0) && (p = new Float64Array(i.memory.buffer)), p;
    }
    let j = null;
    function f() {
        return (j === null || j.byteLength === 0) && (j = new Int32Array(i.memory.buffer)), j;
    }
    let u = 0;
    const $ = typeof TextEncoder > "u" ? (0, module.require)("util").TextEncoder : TextEncoder;
    let S = new $("utf-8");
    const F = typeof S.encodeInto == "function" ? function(e, n) {
        return S.encodeInto(e, n);
    } : function(e, n) {
        const t = S.encode(e);
        return n.set(t), {
            read: e.length,
            written: t.length
        };
    };
    function T(e, n, t) {
        if (t === void 0) {
            const a = S.encode(e), d = n(a.length, 1) >>> 0;
            return l().subarray(d, d + a.length).set(a), u = a.length, d;
        }
        let _ = e.length, o = n(_, 1) >>> 0;
        const b = l();
        let c = 0;
        for(; c < _; c++){
            const a = e.charCodeAt(c);
            if (a > 127) break;
            b[o + c] = a;
        }
        if (c !== _) {
            c !== 0 && (e = e.slice(c)), o = t(o, _, _ = c + e.length * 3, 1) >>> 0;
            const a = l().subarray(o + c, o + _), d = F(e, a);
            c += d.written;
        }
        return u = c, o;
    }
    let A = null;
    function R() {
        return (A === null || A.byteLength === 0) && (A = new BigInt64Array(i.memory.buffer)), A;
    }
    function k(e) {
        const n = typeof e;
        if (n == "number" || n == "boolean" || e == null) return `${e}`;
        if (n == "string") return `"${e}"`;
        if (n == "symbol") {
            const o = e.description;
            return o == null ? "Symbol" : `Symbol(${o})`;
        }
        if (n == "function") {
            const o = e.name;
            return typeof o == "string" && o.length > 0 ? `Function(${o})` : "Function";
        }
        if (Array.isArray(e)) {
            const o = e.length;
            let b = "[";
            o > 0 && (b += k(e[0]));
            for(let c = 1; c < o; c++)b += ", " + k(e[c]);
            return b += "]", b;
        }
        const t = /\[object ([^\]]+)\]/.exec(toString.call(e));
        let _;
        if (t.length > 1) _ = t[1];
        else return toString.call(e);
        if (_ == "Object") try {
            return "Object(" + JSON.stringify(e) + ")";
        } catch  {
            return "Object";
        }
        return e instanceof Error ? `${e.name}: ${e.message}
${e.stack}` : _;
    }
    qe = function() {
        i.main();
    };
    function q(e, n) {
        const t = n(e.length * 1, 1) >>> 0;
        return l().set(e, t / 1), u = e.length, t;
    }
    v = class {
        static __wrap(n) {
            n = n >>> 0;
            const t = Object.create(v.prototype);
            return t.__wbg_ptr = n, t;
        }
        __destroy_into_raw() {
            const n = this.__wbg_ptr;
            return this.__wbg_ptr = 0, n;
        }
        free() {
            const n = this.__destroy_into_raw();
            i.__wbg_binaryimageconverter_free(n);
        }
        constructor(n, t, _){
            const o = i.binaryimageconverter_new(s(n), s(t), s(_));
            return v.__wrap(o);
        }
        init() {
            i.binaryimageconverter_init(this.__wbg_ptr);
        }
        tick() {
            return i.binaryimageconverter_tick(this.__wbg_ptr) !== 0;
        }
        getResult() {
            let n, t;
            try {
                const b = i.__wbindgen_add_to_stack_pointer(-16);
                i.binaryimageconverter_getResult(b, this.__wbg_ptr);
                var _ = f()[b / 4 + 0], o = f()[b / 4 + 1];
                return n = _, t = o, m(_, o);
            } finally{
                i.__wbindgen_add_to_stack_pointer(16), i.__wbindgen_free(n, t, 1);
            }
        }
        progress() {
            return i.binaryimageconverter_progress(this.__wbg_ptr) >>> 0;
        }
    };
    N = function(e, n) {
        const t = new Error(m(e, n));
        return s(t);
    };
    C = function(e) {
        W(e);
    };
    D = function(e) {
        return r(e) === void 0;
    };
    z = function(e, n) {
        return r(e) in r(n);
    };
    H = function(e, n) {
        const t = r(n), _ = typeof t == "number" ? t : void 0;
        L()[e / 8 + 1] = y(_) ? 0 : _, f()[e / 4 + 0] = !y(_);
    };
    J = function(e) {
        return typeof r(e) == "bigint";
    };
    P = function(e) {
        const n = BigInt.asUintN(64, e);
        return s(n);
    };
    V = function(e, n) {
        return r(e) === r(n);
    };
    G = function(e) {
        const n = r(e);
        return typeof n == "boolean" ? n ? 1 : 0 : 2;
    };
    K = function(e, n) {
        const t = r(n), _ = typeof t == "string" ? t : void 0;
        var o = y(_) ? 0 : T(_, i.__wbindgen_malloc, i.__wbindgen_realloc), b = u;
        f()[e / 4 + 1] = b, f()[e / 4 + 0] = o;
    };
    Q = function(e) {
        const n = r(e);
        return typeof n == "object" && n !== null;
    };
    X = function(e, n) {
        const t = m(e, n);
        return s(t);
    };
    Y = function(e) {
        const n = r(e);
        return s(n);
    };
    Z = function() {
        const e = new Error;
        return s(e);
    };
    ee = function(e, n) {
        const t = r(n).stack, _ = T(t, i.__wbindgen_malloc, i.__wbindgen_realloc), o = u;
        f()[e / 4 + 1] = o, f()[e / 4 + 0] = _;
    };
    ne = function(e, n) {
        let t, _;
        try {
            t = e, _ = n, console.error(m(e, n));
        } finally{
            i.__wbindgen_free(t, _, 1);
        }
    };
    te = function(e, n) {
        return r(e) == r(n);
    };
    _e = function(e, n) {
        const t = r(e)[r(n)];
        return s(t);
    };
    re = function(e, n) {
        const t = String(r(n)), _ = T(t, i.__wbindgen_malloc, i.__wbindgen_realloc), o = u;
        f()[e / 4 + 1] = o, f()[e / 4 + 0] = _;
    };
    oe = function(e) {
        return r(e).width;
    };
    ie = function(e) {
        return r(e).height;
    };
    ce = function(e, n) {
        const t = r(n).data, _ = q(t, i.__wbindgen_malloc), o = u;
        f()[e / 4 + 1] = o, f()[e / 4 + 0] = _;
    };
    be = function(e, n, t, _) {
        console.debug(r(e), r(n), r(t), r(_));
    };
    fe = function(e, n, t, _) {
        console.error(r(e), r(n), r(t), r(_));
    };
    se = function(e, n, t, _) {
        console.info(r(e), r(n), r(t), r(_));
    };
    ae = function(e) {
        console.log(r(e));
    };
    ge = function(e, n, t, _) {
        console.log(r(e), r(n), r(t), r(_));
    };
    ue = function(e, n, t, _) {
        console.warn(r(e), r(n), r(t), r(_));
    };
    de = function(e) {
        let n;
        try {
            n = r(e) instanceof ArrayBuffer;
        } catch  {
            n = !1;
        }
        return n;
    };
    le = function(e) {
        return Number.isSafeInteger(r(e));
    };
    we = function(e) {
        const n = r(e).buffer;
        return s(n);
    };
    ye = function(e) {
        const n = new Uint8Array(r(e));
        return s(n);
    };
    me = function(e, n, t) {
        r(e).set(r(n), t >>> 0);
    };
    he = function(e) {
        return r(e).length;
    };
    pe = function(e) {
        let n;
        try {
            n = r(e) instanceof Uint8Array;
        } catch  {
            n = !1;
        }
        return n;
    };
    je = function(e, n) {
        const t = r(n), _ = typeof t == "bigint" ? t : void 0;
        R()[e / 8 + 1] = y(_) ? BigInt(0) : _, f()[e / 4 + 0] = !y(_);
    };
    Ae = function(e, n) {
        const t = k(r(n)), _ = T(t, i.__wbindgen_malloc, i.__wbindgen_realloc), o = u;
        f()[e / 4 + 1] = o, f()[e / 4 + 0] = _;
    };
    Se = function(e, n) {
        throw new Error(m(e, n));
    };
    Te = function() {
        const e = i.memory;
        return s(e);
    };
    URL = globalThis.URL;
    const ke = await U({
        "./vectortracer_bg.js": {
            __wbindgen_error_new: N,
            __wbindgen_object_drop_ref: C,
            __wbindgen_is_undefined: D,
            __wbindgen_in: z,
            __wbindgen_number_get: H,
            __wbindgen_is_bigint: J,
            __wbindgen_bigint_from_u64: P,
            __wbindgen_jsval_eq: V,
            __wbindgen_boolean_get: G,
            __wbindgen_string_get: K,
            __wbindgen_is_object: Q,
            __wbindgen_string_new: X,
            __wbindgen_object_clone_ref: Y,
            __wbg_new_abda76e883ba8a5f: Z,
            __wbg_stack_658279fe44541cf6: ee,
            __wbg_error_f851667af71bcfc6: ne,
            __wbindgen_jsval_loose_eq: te,
            __wbg_getwithrefkey_5e6d9547403deab8: _e,
            __wbg_String_88810dfeb4021902: re,
            __wbg_width_c97f89a38a3c1da7: oe,
            __wbg_height_c8424a3757db7869: ie,
            __wbg_data_eaf4962120932fdc: ce,
            __wbg_debug_9b8701f894da9929: be,
            __wbg_error_d9bce418caafb712: fe,
            __wbg_info_bb52f40b06f679de: se,
            __wbg_log_1d3ae0273d8f4f8a: ae,
            __wbg_log_ea7093e35e3efd07: ge,
            __wbg_warn_dfc0e0cf544a13bd: ue,
            __wbg_instanceof_ArrayBuffer_39ac22089b74fddb: de,
            __wbg_isSafeInteger_bb8e18dd21c97288: le,
            __wbg_buffer_085ec1f694018c4f: we,
            __wbg_new_8125e318e6245eed: ye,
            __wbg_set_5cf90238115182c3: me,
            __wbg_length_72e2208bbc0efc61: he,
            __wbg_instanceof_Uint8Array_d8d9cb2b8e8ac1d4: pe,
            __wbindgen_bigint_get_as_i64: je,
            __wbindgen_debug_string: Ae,
            __wbindgen_throw: Se,
            __wbindgen_memory: Te
        }
    }, O), { memory: ve, main: Ie, __wbg_binaryimageconverter_free: Me, binaryimageconverter_new: Oe, binaryimageconverter_init: Ue, binaryimageconverter_tick: xe, binaryimageconverter_getResult: Be, binaryimageconverter_progress: Ee, __wbindgen_malloc: We, __wbindgen_realloc: Le, __wbindgen_add_to_stack_pointer: $e, __wbindgen_free: Fe, __wbindgen_start: M } = ke, Re = Object.freeze(Object.defineProperty({
        __proto__: null,
        __wbg_binaryimageconverter_free: Me,
        __wbindgen_add_to_stack_pointer: $e,
        __wbindgen_free: Fe,
        __wbindgen_malloc: We,
        __wbindgen_realloc: Le,
        __wbindgen_start: M,
        binaryimageconverter_getResult: Be,
        binaryimageconverter_init: Ue,
        binaryimageconverter_new: Oe,
        binaryimageconverter_progress: Ee,
        binaryimageconverter_tick: xe,
        main: Ie,
        memory: ve
    }, Symbol.toStringTag, {
        value: "Module"
    }));
    x(Re);
    M();
})();
export { v as BinaryImageConverter, re as __wbg_String_88810dfeb4021902, we as __wbg_buffer_085ec1f694018c4f, ce as __wbg_data_eaf4962120932fdc, be as __wbg_debug_9b8701f894da9929, fe as __wbg_error_d9bce418caafb712, ne as __wbg_error_f851667af71bcfc6, _e as __wbg_getwithrefkey_5e6d9547403deab8, ie as __wbg_height_c8424a3757db7869, se as __wbg_info_bb52f40b06f679de, de as __wbg_instanceof_ArrayBuffer_39ac22089b74fddb, pe as __wbg_instanceof_Uint8Array_d8d9cb2b8e8ac1d4, le as __wbg_isSafeInteger_bb8e18dd21c97288, he as __wbg_length_72e2208bbc0efc61, ae as __wbg_log_1d3ae0273d8f4f8a, ge as __wbg_log_ea7093e35e3efd07, ye as __wbg_new_8125e318e6245eed, Z as __wbg_new_abda76e883ba8a5f, me as __wbg_set_5cf90238115182c3, x as __wbg_set_wasm, ee as __wbg_stack_658279fe44541cf6, ue as __wbg_warn_dfc0e0cf544a13bd, oe as __wbg_width_c97f89a38a3c1da7, P as __wbindgen_bigint_from_u64, je as __wbindgen_bigint_get_as_i64, G as __wbindgen_boolean_get, Ae as __wbindgen_debug_string, N as __wbindgen_error_new, z as __wbindgen_in, J as __wbindgen_is_bigint, Q as __wbindgen_is_object, D as __wbindgen_is_undefined, V as __wbindgen_jsval_eq, te as __wbindgen_jsval_loose_eq, Te as __wbindgen_memory, H as __wbindgen_number_get, Y as __wbindgen_object_clone_ref, C as __wbindgen_object_drop_ref, K as __wbindgen_string_get, X as __wbindgen_string_new, Se as __wbindgen_throw, qe as main, __tla };

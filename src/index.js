import { KintoneRestAPIClient } from "@kintone/rest-api-client";
import * as Kuc from "kintone-ui-component";

class Kintool {
  constructor() {
    this._isMobileApp = null;
    this._config = {};
    this._api = null;
    this._ui = null;
  }

  get isMobileApp() {
    if (this._isMobileApp === null) {
      throw new Error(
        "kintool: isMobileApp accessed before initialization. Call kintool.init() first.",
      );
    }
    return this._isMobileApp;
  }

  get app() {
    return this.isMobileApp ? kintone.mobile.app : kintone.app;
  }

  get space() {
    return this.isMobileApp ? kintone.mobile.space : kintone.space;
  }

  get portal() {
    return this.isMobileApp ? kintone.mobile.portal : kintone.portal;
  }

  get api() {
    if (!this._api) {
      this._api = new KintoneRestAPIClient(this._config.api || {});
    }
    return this._api;
  }

  get ui() {
    if (!this._ui) {
      this._ui = Kuc;
    }
    return this._ui;
  }

  async init(config = {}) {
    if (!this._isEqual(config, this._config)) {
      this._config = config;
      this._api = null;
    }

    try {
      const result = kintone.isMobileApp();
      this._isMobileApp = result instanceof Promise ? await result : result;
    } catch (e) {
      this._isMobileApp = false;
      console.error(
        "kintool: Could not detect environment. Defaulting to desktop.",
        e,
      );
    }
  }

  get events() {
    const prefix = this.isMobileApp ? "mobile." : "";
    return {
      on: (events, handler) => {
        const array = Array.isArray(events) ? events : [events];
        if (array.length) {
          kintone.events.on(
            array.map((e) => prefix + e),
            handler,
          );
        }
      },
      off: (events, handler) => {
        const array = Array.isArray(events) ? events : [events];
        if (array.length) {
          kintone.events.off(
            array.map((e) => prefix + e),
            handler,
          );
        }
      },
    };
  }

  _isEqual(value, other) {
    if (typeof value !== "object" && typeof other !== "object") {
      return Object.is(value, other);
    }

    if (value === null && other === null) return true;
    if (typeof value !== typeof other) return false;
    if (value === other) return true;

    if (Array.isArray(value) && Array.isArray(other)) {
      if (value.length !== other.length) return false;
      for (let i = 0; i < value.length; i++) {
        if (!this._isEqual(value[i], other[i])) return false;
      }
      return true;
    }

    if (Array.isArray(value) || Array.isArray(other)) return false;
    if (Object.keys(value).length !== Object.keys(other).length) return false;

    for (const [k, v] of Object.entries(value)) {
      if (!(k in other)) return false;
      if (!this._isEqual(v, other[k])) return false;
    }

    return true;
  }
}

const kintool = new Kintool();

if (typeof window !== "undefined" && !window.kintool) {
  window.kintool = kintool;
}

export { Kintool, kintool };

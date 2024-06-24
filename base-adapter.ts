"use strict";

import { EventEmitter } from "events";

export class BaseProvider extends EventEmitter {
  isDebug: boolean;
  providerNetwork: any;
  callbacks: any;
  constructor(config: { isDebug: boolean }) {
    super();
    this.isDebug = !!config.isDebug;
  }

  /**
   * @private Internal js -> native message handler
   */
  postMessage(handler: any, id: any, data: any) {
    let object = {
      id: id,
      name: handler,
      object: data,
      network: this.providerNetwork,
    };

    const provider = (window as any)?.nighty;
    if (!!provider && provider.postMessage) {
      provider.postMessage(object);
    } else {
      console.error("postMessage is not available");
    }
  }

  /**
   * @private Internal native result -> js
   */
  sendResponse(id: any, result: any) {
    let callback = this.callbacks.get(id);
    if (this.isDebug) {
      console.log(
        `<== sendResponse id: ${id}, result: ${JSON.stringify(result)}`
      );
    }
    if (callback) {
      callback(null, result);
      this.callbacks.delete(id);
    } else {
      console.log(`callback id: ${id} not found`);
    }
  }

  /**
   * @private Internal native error -> js
   */
  sendError(id: any, error: any) {
    console.log(`<== ${id} sendError ${error}`);
    let callback = this.callbacks.get(id);
    if (callback) {
      callback(error instanceof Error ? error : new Error(error), null);
      this.callbacks.delete(id);
    }
  }
}

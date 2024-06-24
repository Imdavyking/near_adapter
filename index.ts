"use strict";
import { NightlyWalletProvider } from "./nightly-wallet-adapter";

(window as any).nightly = {
  near: new NightlyWalletProvider(),
  postMessage: null,
};

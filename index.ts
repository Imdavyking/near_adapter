"use strict";
import { NightlyWalletProvider } from "./nighty-wallet-adapter";

(window as any).nightly = {
  near: new NightlyWalletProvider(),
  postMessage: null,
};

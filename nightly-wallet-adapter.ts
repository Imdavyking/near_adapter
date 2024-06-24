// nightly-wallet-provider.ts
import { WalletProvider } from "./wallet-provider";
import { SignMessageParams } from "@near-wallet-selector/core";
import { AccountImportData, NearAccount, NearNightly } from "./types";
import {
  SignedTransaction as NearSignedTransaction,
  Transaction as NearTransaction,
  Signature,
} from "near-api-js/lib/transaction";
import { PublicKey } from "near-api-js/lib/utils";
import { ProviderRpcError } from "./error";
import { BaseProvider } from "./base-adapter";
import { Utils } from "./utils";

const DEFAULT_NEAR_PUBLIC_KEY = PublicKey.from(
  "11111111111111111111111111111111"
);

export class NightlyWalletProvider
  extends BaseProvider
  implements WalletProvider
{
  account: NearAccount;
  _connected: boolean;

  constructor() {
    super({
      isDebug: false,
    });
    this.callbacks = new Map();
    this._connected = false;
    this.account = { accountId: "", publicKey: DEFAULT_NEAR_PUBLIC_KEY };
  }

  isConnected() {
    return this._connected;
  }

  get connected() {
    return this._connected;
  }

  async signAllTransactions(
    transactions: NearTransaction[]
  ): Promise<NearSignedTransaction[]> {
    return Promise.all(transactions.map((tx) => this.signTransaction(tx)));
  }

  async signTransaction(
    transaction: NearTransaction
  ): Promise<NearSignedTransaction> {
    const request = await this._request("signTransaction", transaction);
    const signature = JSON.parse(request as any) as Signature;

    return {
      transaction: transaction,
      signature: signature,
      encode: () => {
        return new Uint8Array();
      },
    };
  }

  async signMessage(msg: SignMessageParams): Promise<any> {
    const request = await this._request("signMessage", msg);
  }

  async connect(onDisconnect?: () => void): Promise<NearAccount> {
    try {
      const request = await this._request("connect", onDisconnect);
      const acc = JSON.parse(request as any) as NearAccount;
      this.account = {
        accountId: acc.accountId,
        publicKey: PublicKey.from(acc.publicKey.toString()),
      };
      this._connected = true;
      return this.account;
    } catch (error) {
      console.error(error);
      throw new Error("User refused connection");
    }
  }

  async disconnect(): Promise<void> {
    if (this.account.accountId !== "") {
      await this._request("disconnect", null);
      this.account = { accountId: "", publicKey: DEFAULT_NEAR_PUBLIC_KEY };
      this._connected = false;
    }
  }

  async importWalletsNear(accounts: AccountImportData[]): Promise<any> {
    const request = await this._request("importWalletsNear", accounts);
  }

  _request(method, payload) {
    if (this.isDebug) {
      console.log(
        `==> _request method: ${method}, payload ${JSON.stringify(payload)}`
      );
    }
    return new Promise((resolve, reject) => {
      const id = Utils.genId();
      console.log(`==> setting id ${id}`);
      this.callbacks.set(id, (error: any, data: any) => {
        if (error) {
          reject(error);
        } else {
          resolve(data);
        }
      });

      switch (method) {
        case "signAllTransactions":
          return this.postMessage("signAllTransactions", id, payload);

        case "signTransaction":
          return this.postMessage("signTransaction", id, payload);

        case "signMessage":
          return this.postMessage("signMessage", id, payload);

        case "connect":
          return this.postMessage("connect", id, payload);

        case "disconnect":
          return this.postMessage("disconnect", id, payload);

        case "importWalletsNear":
          return this.postMessage("importWalletsNear", id, payload);

        default:
          // throw errors for unsupported methods
          throw new ProviderRpcError(
            4200,
            `Nightly does not support calling ${payload.method} yet.`
          );
      }
    });
  }
}

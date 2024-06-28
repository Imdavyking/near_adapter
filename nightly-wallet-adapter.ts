// nightly-wallet-provider.ts
import { WalletProvider } from "./wallet-provider";
import { SignMessageParams, SignedMessage } from "@near-wallet-selector/core";
import { serialize } from "borsh";
import {
  AccountImportData,
  NearAccount,
  NearDappTx,
  NearNightly,
} from "./types";
import {
  Action,
  SignedTransaction,
  Transaction,
  Signature,
  AccessKey,
  FullAccessPermission,
  AccessKeyPermission,
  FunctionCallPermission,
  CreateAccount,
  DeployContract,
  FunctionCall,
  Transfer,
  Stake,
  AddKey,
  DeleteKey,
  DeleteAccount,
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
    transactions: Transaction[]
  ): Promise<SignedTransaction[]> {
    return Promise.all(transactions.map((tx) => this.signTransaction(tx)));
  }

  async signTransaction(transaction: Transaction): Promise<SignedTransaction> {
    const request = await this._request("signTransaction", {
      ...transaction,
      encoded: transaction.encode(),
    });

    const nearDappTx = JSON.parse(request as any) as NearDappTx;
    const signature = new Signature({
      keyType: transaction.publicKey.keyType,
      data: nearDappTx.signature,
    });
    return new SignedTransaction({
      transaction,
      signature: signature,
      encode() {
        const encoded = [
          ...Array.from(transaction.encode()),
          signature.keyType,
          ...Array.from(signature.data),
        ];
        return new Uint8Array(encoded);
      },
    });
  }

  async signMessage(msg: SignMessageParams): Promise<any> {
    const request = await this._request("signMessage", msg);
    return JSON.parse(request as any) as SignedMessage;
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

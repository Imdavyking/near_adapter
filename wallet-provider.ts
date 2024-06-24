// wallet-provider.ts
import { SignMessageParams } from "@near-wallet-selector/core";
import {
  AccountImportData,
  NearAccount,
  NearNightly,
  WalletAdapter,
} from "./types";
import {
  SignedTransaction as NearSignedTransaction,
  Transaction as NearTransaction,
} from "near-api-js/lib/transaction";
import { PublicKey } from "near-api-js/lib/utils";

export interface WalletProvider {
  account: NearAccount;
  connected: boolean;
  signAllTransactions(
    transactions: NearTransaction[]
  ): Promise<NearSignedTransaction[]>;
  signTransaction(transaction: NearTransaction): Promise<NearSignedTransaction>;
  signMessage(msg: SignMessageParams): Promise<any>;
  connect(onDisconnect?: () => void): Promise<NearAccount>;
  disconnect(): Promise<void>;
  importWalletsNear(accounts: AccountImportData[]): Promise<any>;
}

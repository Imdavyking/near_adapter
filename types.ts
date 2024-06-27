import { SignMessageParams, SignedMessage } from "@near-wallet-selector/core";
import { PublicKey } from "near-api-js/lib/utils";
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
import { PublicKey as NearPublicKey } from "near-api-js/lib/utils";
export interface NearAccount {
  accountId: string;
  publicKey: NearPublicKey;
}
export interface WalletAdapter {
  account: NearAccount;
  connected: boolean;
  signTransaction: (transaction: Transaction) => Promise<SignedTransaction>;
  signAllTransactions: (
    transaction: Transaction[]
  ) => Promise<SignedTransaction[]>;
  connect: () => any;
  disconnect: () => any;
}

export declare class Nightly {
  near: NearNightly;
  private readonly _nightlyEventsMap;
  constructor();
  invalidate(): void;
}

export declare class NearDappTx {
  signature: Signature;
  encoded: Uint8Array;
}

export declare class NearNightly {
  account: NearAccount;
  _onDisconnect: () => void;
  private readonly _nightlyEventsMap;
  constructor(eventMap: Map<string, (data: any) => any>);
  connect(onDisconnect?: () => void): Promise<NearAccount>;
  disconnect(): Promise<void>;
  signTransaction: (transaction: Transaction) => Promise<SignedTransaction>;
  signAllTransactions: (
    transaction: Transaction[]
  ) => Promise<SignedTransaction[]>;
  signMessage: (msg: SignMessageParams) => Promise<SignedMessage>;
  importWalletsNear: (privKeys: Array<AccountImportData>) => Promise<void>;
}

export interface AccountImportData {
  accountId: string;
  privateKey: string;
}

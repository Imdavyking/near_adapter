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

export let SCHEMA = new Map([
  [
    Signature,
    {
      kind: "struct",
      fields: [
        ["keyType", "u8"],
        ["data", [64]],
      ],
    },
  ],
  [
    SignedTransaction,
    {
      kind: "struct",
      fields: [
        ["transaction", Transaction],
        ["signature", Signature],
      ],
    },
  ],
  [
    Transaction,
    {
      kind: "struct",
      fields: [
        ["signerId", "string"],
        ["publicKey", PublicKey],
        ["nonce", "u64"],
        ["receiverId", "string"],
        ["blockHash", [32]],
        ["actions", [Action]],
      ],
    },
  ],
  [
    PublicKey,
    {
      kind: "struct",
      fields: [
        ["keyType", "u8"],
        ["data", [32]],
      ],
    },
  ],
  [
    AccessKey,
    {
      kind: "struct",
      fields: [
        ["nonce", "u64"],
        ["permission", AccessKeyPermission],
      ],
    },
  ],
  [
    AccessKeyPermission,
    {
      kind: "enum",
      field: "enum",
      values: [
        ["functionCall", FunctionCallPermission],
        ["fullAccess", FullAccessPermission],
      ],
    },
  ],
  [
    FunctionCallPermission,
    {
      kind: "struct",
      fields: [
        ["allowance", { kind: "option", type: "u128" }],
        ["receiverId", "string"],
        ["methodNames", ["string"]],
      ],
    },
  ],
  [FullAccessPermission, { kind: "struct", fields: [] }],
  [
    Action,
    {
      kind: "enum",
      field: "enum",
      values: [
        ["createAccount", CreateAccount],
        ["deployContract", DeployContract],
        ["functionCall", FunctionCall],
        ["transfer", Transfer],
        ["stake", Stake],
        ["addKey", AddKey],
        ["deleteKey", DeleteKey],
        ["deleteAccount", DeleteAccount],
      ],
    },
  ],
  [CreateAccount, { kind: "struct", fields: [] }],
  [DeployContract, { kind: "struct", fields: [["code", ["u8"]]] }],
  [
    FunctionCall,
    {
      kind: "struct",
      fields: [
        ["methodName", "string"],
        ["args", ["u8"]],
        ["gas", "u64"],
        ["deposit", "u128"],
      ],
    },
  ],
  [Transfer, { kind: "struct", fields: [["deposit", "u128"]] }],
  [
    Stake,
    {
      kind: "struct",
      fields: [
        ["stake", "u128"],
        ["publicKey", PublicKey],
      ],
    },
  ],
  [
    AddKey,
    {
      kind: "struct",
      fields: [
        ["publicKey", PublicKey],
        ["accessKey", AccessKey],
      ],
    },
  ],
  [DeleteKey, { kind: "struct", fields: [["publicKey", PublicKey]] }],
  [DeleteAccount, { kind: "struct", fields: [["beneficiaryId", "string"]] }],
]);

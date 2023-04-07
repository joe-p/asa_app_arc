import algosdk from "algosdk";
import * as bkr from "beaker-ts";
export class TokenMetadata extends bkr.ApplicationClient {
    desc: string = "";
    override appSchema: bkr.Schema = { declared: {}, reserved: {} };
    override acctSchema: bkr.Schema = { declared: {}, reserved: {} };
    override approvalProgram: string = "I3ByYWdtYSB2ZXJzaW9uIDgKCWIgbWFpbgoKYWJpX3JvdXRlX3VwZGF0ZU1ldGFkYXRhRW50cnk6Cgl0eG4gT25Db21wbGV0aW9uCglpbnQgTm9PcAoJPT0KCXR4biBBcHBsaWNhdGlvbklECglpbnQgMAoJIT0KCSYmCglhc3NlcnQKCWJ5dGUgMHgKCXBvcAoJdHhuYSBBcHBsaWNhdGlvbkFyZ3MgMwoJYnRvaQoJdHhuYXMgQXNzZXRzCgl0eG5hIEFwcGxpY2F0aW9uQXJncyAyCglleHRyYWN0IDIgMAoJdHhuYSBBcHBsaWNhdGlvbkFyZ3MgMQoJZXh0cmFjdCAyIDAKCWNhbGxzdWIgdXBkYXRlTWV0YWRhdGFFbnRyeQoJaW50IDEKCXJldHVybgoKdXBkYXRlTWV0YWRhdGFFbnRyeToKCXByb3RvIDMgMAoKCS8vIHRva2VuX21ldGFkYXRhLmFsZ28udHM6MTAKCS8vIGFzc2VydCh0aGlzLnR4bi5zZW5kZXIgPT09IGFzYS5tYW5hZ2VyKQoJdHhuIFNlbmRlcgoJZnJhbWVfZGlnIC0zIC8vIGFzYTogYXNzZXQKCWFzc2V0X3BhcmFtc19nZXQgQXNzZXRNYW5hZ2VyCglhc3NlcnQKCT09Cglhc3NlcnQKCgkvLyB0b2tlbl9tZXRhZGF0YS5hbGdvLnRzOjExCgkvLyB0aGlzLm1ldGFkYXRhRW50cnkucHV0KGNvbmNhdChBUkNfU1RSSU5HLCBrZXkpLCB2YWx1ZSkKCWJ5dGUgIkFSQ1hYWFgiCglmcmFtZV9kaWcgLTEgLy8ga2V5OiBieXRlcwoJY29uY2F0CglkdXAKCWJveF9kZWwKCXBvcAoJZnJhbWVfZGlnIC0yIC8vIHZhbHVlOiBieXRlcwoJYm94X3B1dAoJcmV0c3ViCgphYmlfcm91dGVfZGVsZXRlTWV0YWRhdGFFbnRyeToKCXR4biBPbkNvbXBsZXRpb24KCWludCBOb09wCgk9PQoJdHhuIEFwcGxpY2F0aW9uSUQKCWludCAwCgkhPQoJJiYKCWFzc2VydAoJYnl0ZSAweAoJcG9wCgl0eG5hIEFwcGxpY2F0aW9uQXJncyAyCglidG9pCgl0eG5hcyBBc3NldHMKCXR4bmEgQXBwbGljYXRpb25BcmdzIDEKCWV4dHJhY3QgMiAwCgljYWxsc3ViIGRlbGV0ZU1ldGFkYXRhRW50cnkKCWludCAxCglyZXR1cm4KCmRlbGV0ZU1ldGFkYXRhRW50cnk6Cglwcm90byAyIDAKCgkvLyB0b2tlbl9tZXRhZGF0YS5hbGdvLnRzOjE1CgkvLyBhc3NlcnQodGhpcy50eG4uc2VuZGVyID09PSBhc2EubWFuYWdlcikKCXR4biBTZW5kZXIKCWZyYW1lX2RpZyAtMiAvLyBhc2E6IGFzc2V0Cglhc3NldF9wYXJhbXNfZ2V0IEFzc2V0TWFuYWdlcgoJYXNzZXJ0Cgk9PQoJYXNzZXJ0CgoJLy8gdG9rZW5fbWV0YWRhdGEuYWxnby50czoxNgoJLy8gdGhpcy5tZXRhZGF0YUVudHJ5LmRlbGV0ZShjb25jYXQoQVJDX1NUUklORywga2V5KSkKCWJ5dGUgIkFSQ1hYWFgiCglmcmFtZV9kaWcgLTEgLy8ga2V5OiBieXRlcwoJY29uY2F0Cglib3hfZGVsCglyZXRzdWIKCmFiaV9yb3V0ZV9yZWNsYWltQUxHT3M6Cgl0eG4gT25Db21wbGV0aW9uCglpbnQgTm9PcAoJPT0KCXR4biBBcHBsaWNhdGlvbklECglpbnQgMAoJIT0KCSYmCglhc3NlcnQKCWJ5dGUgMHgKCXBvcAoJdHhuYSBBcHBsaWNhdGlvbkFyZ3MgMQoJYnRvaQoJdHhuYXMgQXNzZXRzCgljYWxsc3ViIHJlY2xhaW1BTEdPcwoJaW50IDEKCXJldHVybgoKcmVjbGFpbUFMR09zOgoJcHJvdG8gMSAwCgoJLy8gdG9rZW5fbWV0YWRhdGEuYWxnby50czoyMAoJLy8gYXNzZXJ0KHRoaXMudHhuLnNlbmRlciA9PT0gYXNhLm1hbmFnZXIpCgl0eG4gU2VuZGVyCglmcmFtZV9kaWcgLTEgLy8gYXNhOiBhc3NldAoJYXNzZXRfcGFyYW1zX2dldCBBc3NldE1hbmFnZXIKCWFzc2VydAoJPT0KCWFzc2VydAoKCS8vIHRva2VuX21ldGFkYXRhLmFsZ28udHM6MjEKCS8vIHNlbmRQYXltZW50KHsKCWl0eG5fYmVnaW4KCWludCBwYXkKCWl0eG5fZmllbGQgVHlwZUVudW0KCgkvLyB0b2tlbl9tZXRhZGF0YS5hbGdvLnRzOjIyCgkvLyBzZW5kZXI6IHRoaXMuYXBwLmFkZHJlc3MKCXR4bmEgQXBwbGljYXRpb25zIDAKCWFwcF9wYXJhbXNfZ2V0IEFwcEFkZHJlc3MKCWFzc2VydAoJaXR4bl9maWVsZCBTZW5kZXIKCgkvLyB0b2tlbl9tZXRhZGF0YS5hbGdvLnRzOjIzCgkvLyByZWNlaXZlcjogYXNhLm1hbmFnZXIKCWZyYW1lX2RpZyAtMSAvLyBhc2E6IGFzc2V0Cglhc3NldF9wYXJhbXNfZ2V0IEFzc2V0TWFuYWdlcgoJYXNzZXJ0CglpdHhuX2ZpZWxkIFJlY2VpdmVyCgoJLy8gdG9rZW5fbWV0YWRhdGEuYWxnby50czoyNAoJLy8gYW1vdW50OiB0aGlzLmFwcC5hZGRyZXNzLmJhbGFuY2UgLSB0aGlzLmFwcC5hZGRyZXNzLm1pbkJhbGFuY2UKCXR4bmEgQXBwbGljYXRpb25zIDAKCWFwcF9wYXJhbXNfZ2V0IEFwcEFkZHJlc3MKCWFzc2VydAoJYWNjdF9wYXJhbXNfZ2V0IEFjY3RCYWxhbmNlCglhc3NlcnQKCXR4bmEgQXBwbGljYXRpb25zIDAKCWFwcF9wYXJhbXNfZ2V0IEFwcEFkZHJlc3MKCWFzc2VydAoJYWNjdF9wYXJhbXNfZ2V0IEFjY3RNaW5CYWxhbmNlCglhc3NlcnQKCS0KCWl0eG5fZmllbGQgQW1vdW50CgoJLy8gdG9rZW5fbWV0YWRhdGEuYWxnby50czoyNQoJLy8gZmVlOiAwCglpbnQgMAoJaXR4bl9maWVsZCBGZWUKCWl0eG5fc3VibWl0CglyZXRzdWIKCm1haW46Cgl0eG4gTnVtQXBwQXJncwoJYm56IHJvdXRlX2FiaQoKCS8vIGRlZmF1bHQgY3JlYXRlQXBwbGljYXRpb24KCXR4biBBcHBsaWNhdGlvbklECglpbnQgMAoJPT0KCXR4biBPbkNvbXBsZXRpb24KCWludCBOb09wCgk9PQoJJiYKCXJldHVybgoKcm91dGVfYWJpOgoJbWV0aG9kICJ1cGRhdGVNZXRhZGF0YUVudHJ5KGJ5dGVbXSxieXRlW10sYXNzZXQpdm9pZCIKCW1ldGhvZCAiZGVsZXRlTWV0YWRhdGFFbnRyeShieXRlW10sYXNzZXQpdm9pZCIKCW1ldGhvZCAicmVjbGFpbUFMR09zKGFzc2V0KXZvaWQiCgl0eG5hIEFwcGxpY2F0aW9uQXJncyAwCgltYXRjaCBhYmlfcm91dGVfdXBkYXRlTWV0YWRhdGFFbnRyeSBhYmlfcm91dGVfZGVsZXRlTWV0YWRhdGFFbnRyeSBhYmlfcm91dGVfcmVjbGFpbUFMR09z";
    override clearProgram: string = "I3ByYWdtYSB2ZXJzaW9uIDgKaW50IDEKcmV0dXJu";
    override methods: algosdk.ABIMethod[] = [
        new algosdk.ABIMethod({ name: "updateMetadataEntry", desc: "", args: [{ type: "byte[]", name: "key", desc: "" }, { type: "byte[]", name: "value", desc: "" }, { type: "asset", name: "asa", desc: "" }], returns: { type: "void", desc: "" } }),
        new algosdk.ABIMethod({ name: "deleteMetadataEntry", desc: "", args: [{ type: "byte[]", name: "key", desc: "" }, { type: "asset", name: "asa", desc: "" }], returns: { type: "void", desc: "" } }),
        new algosdk.ABIMethod({ name: "reclaimALGOs", desc: "", args: [{ type: "asset", name: "asa", desc: "" }], returns: { type: "void", desc: "" } })
    ];
    async updateMetadataEntry(args: {
        key: Uint8Array;
        value: Uint8Array;
        asa: bigint;
    }, txnParams?: bkr.TransactionOverrides): Promise<bkr.ABIResult<void>> {
        const result = await this._execute(await this.compose.updateMetadataEntry({ key: args.key, value: args.value, asa: args.asa }, txnParams));
        return new bkr.ABIResult<void>(result);
    }
    async deleteMetadataEntry(args: {
        key: Uint8Array;
        asa: bigint;
    }, txnParams?: bkr.TransactionOverrides): Promise<bkr.ABIResult<void>> {
        const result = await this._execute(await this.compose.deleteMetadataEntry({ key: args.key, asa: args.asa }, txnParams));
        return new bkr.ABIResult<void>(result);
    }
    async reclaimALGOs(args: {
        asa: bigint;
    }, txnParams?: bkr.TransactionOverrides): Promise<bkr.ABIResult<void>> {
        const result = await this._execute(await this.compose.reclaimALGOs({ asa: args.asa }, txnParams));
        return new bkr.ABIResult<void>(result);
    }
    compose = {
        updateMetadataEntry: async (args: {
            key: Uint8Array;
            value: Uint8Array;
            asa: bigint;
        }, txnParams?: bkr.TransactionOverrides, atc?: algosdk.AtomicTransactionComposer): Promise<algosdk.AtomicTransactionComposer> => {
            return this._addMethodCall(algosdk.getMethodByName(this.methods, "updateMetadataEntry"), { key: args.key, value: args.value, asa: args.asa }, txnParams, atc);
        },
        deleteMetadataEntry: async (args: {
            key: Uint8Array;
            asa: bigint;
        }, txnParams?: bkr.TransactionOverrides, atc?: algosdk.AtomicTransactionComposer): Promise<algosdk.AtomicTransactionComposer> => {
            return this._addMethodCall(algosdk.getMethodByName(this.methods, "deleteMetadataEntry"), { key: args.key, asa: args.asa }, txnParams, atc);
        },
        reclaimALGOs: async (args: {
            asa: bigint;
        }, txnParams?: bkr.TransactionOverrides, atc?: algosdk.AtomicTransactionComposer): Promise<algosdk.AtomicTransactionComposer> => {
            return this._addMethodCall(algosdk.getMethodByName(this.methods, "reclaimALGOs"), { asa: args.asa }, txnParams, atc);
        }
    };
}

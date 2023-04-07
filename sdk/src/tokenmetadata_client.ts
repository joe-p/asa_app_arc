import algosdk from "algosdk";
import * as bkr from "beaker-ts";
export class TokenMetadata extends bkr.ApplicationClient {
    desc: string = "";
    override appSchema: bkr.Schema = { declared: { asa: { type: bkr.AVMType.uint64, key: "asa", desc: "", static: false } }, reserved: {} };
    override acctSchema: bkr.Schema = { declared: {}, reserved: {} };
    override approvalProgram: string = "I3ByYWdtYSB2ZXJzaW9uIDgKCWIgbWFpbgoKdmVyaWZ5T3JTZXRBU0E6Cglwcm90byAxIDAKCgkvLyBpZjBfY29uZGl0aW9uCgkvLyB0b2tlbl9tZXRhZGF0YS5hbGdvLnRzOjExCgkvLyB0aGlzLmFzYS5leGlzdHMoKQoJdHhuYSBBcHBsaWNhdGlvbnMgMAoJYnl0ZSAiYXNhIgoJYXBwX2dsb2JhbF9nZXRfZXgKCXN3YXAKCXBvcAoJYnogaWYwX2Vsc2UKCgkvLyBpZjBfY29uc2VxdWVudAoJLy8gdG9rZW5fbWV0YWRhdGEuYWxnby50czoxMgoJLy8gYXNzZXJ0KHRoaXMuYXNhLmdldCgpID09PSBhc2EpCglieXRlICJhc2EiCglhcHBfZ2xvYmFsX2dldAoJZnJhbWVfZGlnIC0xIC8vIGFzYTogYXNzZXQKCT09Cglhc3NlcnQKCWIgaWYwX2VuZAoKaWYwX2Vsc2U6CgkvLyB0b2tlbl9tZXRhZGF0YS5hbGdvLnRzOjE0CgkvLyBhc3NlcnQodGhpcy50eG4uc2VuZGVyID09PSB0aGlzLmFwcC5jcmVhdG9yKQoJdHhuIFNlbmRlcgoJdHhuYSBBcHBsaWNhdGlvbnMgMAoJYXBwX3BhcmFtc19nZXQgQXBwQ3JlYXRvcgoJYXNzZXJ0Cgk9PQoJYXNzZXJ0CgoJLy8gdG9rZW5fbWV0YWRhdGEuYWxnby50czoxNQoJLy8gdGhpcy5hc2EucHV0KGFzYSkKCWJ5dGUgImFzYSIKCWZyYW1lX2RpZyAtMSAvLyBhc2E6IGFzc2V0CglhcHBfZ2xvYmFsX3B1dAoKaWYwX2VuZDoKCS8vIHRva2VuX21ldGFkYXRhLmFsZ28udHM6MTgKCS8vIGFzc2VydCh0aGlzLnR4bi5zZW5kZXIgPT09IHRoaXMuYXNhLmdldCgpLm1hbmFnZXIpCgl0eG4gU2VuZGVyCglieXRlICJhc2EiCglhcHBfZ2xvYmFsX2dldAoJYXNzZXRfcGFyYW1zX2dldCBBc3NldE1hbmFnZXIKCWFzc2VydAoJPT0KCWFzc2VydAoJcmV0c3ViCgphYmlfcm91dGVfdXBkYXRlTWV0YWRhdGFFbnRyeToKCXR4biBPbkNvbXBsZXRpb24KCWludCBOb09wCgk9PQoJdHhuIEFwcGxpY2F0aW9uSUQKCWludCAwCgkhPQoJJiYKCWFzc2VydAoJYnl0ZSAweAoJcG9wCgl0eG5hIEFwcGxpY2F0aW9uQXJncyAzCglidG9pCgl0eG5hcyBBc3NldHMKCXR4bmEgQXBwbGljYXRpb25BcmdzIDIKCWV4dHJhY3QgMiAwCgl0eG5hIEFwcGxpY2F0aW9uQXJncyAxCglleHRyYWN0IDIgMAoJY2FsbHN1YiB1cGRhdGVNZXRhZGF0YUVudHJ5CglpbnQgMQoJcmV0dXJuCgp1cGRhdGVNZXRhZGF0YUVudHJ5OgoJcHJvdG8gMyAwCgoJLy8gdG9rZW5fbWV0YWRhdGEuYWxnby50czoyMgoJLy8gdGhpcy52ZXJpZnlPclNldEFTQShhc2EpCglieXRlIDB4Cglwb3AKCWZyYW1lX2RpZyAtMyAvLyBhc2E6IGFzc2V0CgljYWxsc3ViIHZlcmlmeU9yU2V0QVNBCgoJLy8gdG9rZW5fbWV0YWRhdGEuYWxnby50czoyNAoJLy8gdGhpcy5tZXRhZGF0YUVudHJ5LnB1dChjb25jYXQoQVJDX1NUUklORywga2V5KSwgdmFsdWUpCglieXRlICJBUkNYWFhYIgoJZnJhbWVfZGlnIC0xIC8vIGtleTogYnl0ZXMKCWNvbmNhdAoJZHVwCglib3hfZGVsCglwb3AKCWZyYW1lX2RpZyAtMiAvLyB2YWx1ZTogYnl0ZXMKCWJveF9wdXQKCXJldHN1YgoKYWJpX3JvdXRlX3VwZGF0ZU1ldGFkYXRhRW50cmllczoKCXR4biBPbkNvbXBsZXRpb24KCWludCBOb09wCgk9PQoJdHhuIEFwcGxpY2F0aW9uSUQKCWludCAwCgkhPQoJJiYKCWFzc2VydAoJYnl0ZSAweAoJZHVwbiAwCgl0eG5hIEFwcGxpY2F0aW9uQXJncyAzCglidG9pCgl0eG5hcyBBc3NldHMKCXR4bmEgQXBwbGljYXRpb25BcmdzIDIKCXR4bmEgQXBwbGljYXRpb25BcmdzIDEKCWNhbGxzdWIgdXBkYXRlTWV0YWRhdGFFbnRyaWVzCglpbnQgMQoJcmV0dXJuCgp1cGRhdGVNZXRhZGF0YUVudHJpZXM6Cglwcm90byA0IDAKCgkvLyB0b2tlbl9tZXRhZGF0YS5hbGdvLnRzOjI4CgkvLyB0aGlzLnZlcmlmeU9yU2V0QVNBKGFzYSkKCWJ5dGUgMHgKCXBvcAoJZnJhbWVfZGlnIC0zIC8vIGFzYTogYXNzZXQKCWNhbGxzdWIgdmVyaWZ5T3JTZXRBU0EKCgkvLyB0b2tlbl9tZXRhZGF0YS5hbGdvLnRzOjMwCgkvLyBpID0gOAoJaW50IDgKCWZyYW1lX2J1cnkgLTQgLy8gaTogdWludDY0Cgpmb3JfMDoKCWZyYW1lX2RpZyAtNCAvLyBpOiB1aW50NjQKCWludCA4Cgk8CglieiBmb3JfMF9lbmQKCgkvLyBpZjFfY29uZGl0aW9uCgkvLyB0b2tlbl9tZXRhZGF0YS5hbGdvLnRzOjMxCgkvLyB2YWx1ZXNbaV0gPT09ICcnCglmcmFtZV9kaWcgLTIgLy8gdmFsdWVzOiBieXRlc1s4XQoJZnJhbWVfZGlnIC00IC8vIGk6IHVpbnQ2NAoJaW50IDEKCSoKCWludCAxCglleHRyYWN0MwoJYnl0ZSAiIgoJPT0KCWJ6IGlmMV9lbmQKCgkvLyBpZjFfY29uc2VxdWVudAoJLy8gdG9rZW5fbWV0YWRhdGEuYWxnby50czozMQoJLy8gcmV0dXJuCglpdG9iCglieXRlIDB4CgliJgoJYnl0ZSAweDE1MWY3Yzc1Cglzd2FwCgljb25jYXQKCWxvZwoJcmV0c3ViCgppZjFfZW5kOgoJLy8gdG9rZW5fbWV0YWRhdGEuYWxnby50czozMgoJLy8gdGhpcy51cGRhdGVNZXRhZGF0YUVudHJ5KGtleXNbaV0sIHZhbHVlc1tpXSwgYXNhKQoJYnl0ZSAweAoJcG9wCglmcmFtZV9kaWcgLTMgLy8gYXNhOiBhc3NldAoJZnJhbWVfZGlnIC0yIC8vIHZhbHVlczogYnl0ZXNbOF0KCWZyYW1lX2RpZyAtNCAvLyBpOiB1aW50NjQKCWludCAxCgkqCglpbnQgMQoJZXh0cmFjdDMKCWZyYW1lX2RpZyAtMSAvLyBrZXlzOiBieXRlc1s4XQoJZnJhbWVfZGlnIC00IC8vIGk6IHVpbnQ2NAoJaW50IDEKCSoKCWludCAxCglleHRyYWN0MwoJY2FsbHN1YiB1cGRhdGVNZXRhZGF0YUVudHJ5CgoJLy8gdG9rZW5fbWV0YWRhdGEuYWxnby50czozMAoJLy8gaSA9IGkgKyAxCglmcmFtZV9kaWcgLTQgLy8gaTogdWludDY0CglpbnQgMQoJKwoJZnJhbWVfYnVyeSAtNCAvLyBpOiB1aW50NjQKCWIgZm9yXzAKCmZvcl8wX2VuZDoKCXJldHN1YgoKYWJpX3JvdXRlX2RlbGV0ZU1ldGFkYXRhRW50cnk6Cgl0eG4gT25Db21wbGV0aW9uCglpbnQgTm9PcAoJPT0KCXR4biBBcHBsaWNhdGlvbklECglpbnQgMAoJIT0KCSYmCglhc3NlcnQKCWJ5dGUgMHgKCXBvcAoJdHhuYSBBcHBsaWNhdGlvbkFyZ3MgMgoJYnRvaQoJdHhuYXMgQXNzZXRzCgl0eG5hIEFwcGxpY2F0aW9uQXJncyAxCglleHRyYWN0IDIgMAoJY2FsbHN1YiBkZWxldGVNZXRhZGF0YUVudHJ5CglpbnQgMQoJcmV0dXJuCgpkZWxldGVNZXRhZGF0YUVudHJ5OgoJcHJvdG8gMiAwCgoJLy8gdG9rZW5fbWV0YWRhdGEuYWxnby50czozNwoJLy8gdGhpcy52ZXJpZnlPclNldEFTQShhc2EpCglieXRlIDB4Cglwb3AKCWZyYW1lX2RpZyAtMiAvLyBhc2E6IGFzc2V0CgljYWxsc3ViIHZlcmlmeU9yU2V0QVNBCgoJLy8gdG9rZW5fbWV0YWRhdGEuYWxnby50czozOQoJLy8gdGhpcy5tZXRhZGF0YUVudHJ5LmRlbGV0ZShjb25jYXQoQVJDX1NUUklORywga2V5KSkKCWJ5dGUgIkFSQ1hYWFgiCglmcmFtZV9kaWcgLTEgLy8ga2V5OiBieXRlcwoJY29uY2F0Cglib3hfZGVsCglyZXRzdWIKCmFiaV9yb3V0ZV9yZWNsYWltQUxHT3M6Cgl0eG4gT25Db21wbGV0aW9uCglpbnQgTm9PcAoJPT0KCXR4biBBcHBsaWNhdGlvbklECglpbnQgMAoJIT0KCSYmCglhc3NlcnQKCWJ5dGUgMHgKCXBvcAoJdHhuYSBBcHBsaWNhdGlvbkFyZ3MgMQoJYnRvaQoJdHhuYXMgQXNzZXRzCgljYWxsc3ViIHJlY2xhaW1BTEdPcwoJaW50IDEKCXJldHVybgoKcmVjbGFpbUFMR09zOgoJcHJvdG8gMSAwCgoJLy8gdG9rZW5fbWV0YWRhdGEuYWxnby50czo0MwoJLy8gdGhpcy52ZXJpZnlPclNldEFTQShhc2EpCglieXRlIDB4Cglwb3AKCWZyYW1lX2RpZyAtMSAvLyBhc2E6IGFzc2V0CgljYWxsc3ViIHZlcmlmeU9yU2V0QVNBCgoJLy8gdG9rZW5fbWV0YWRhdGEuYWxnby50czo0NQoJLy8gc2VuZFBheW1lbnQoewoJaXR4bl9iZWdpbgoJaW50IHBheQoJaXR4bl9maWVsZCBUeXBlRW51bQoKCS8vIHRva2VuX21ldGFkYXRhLmFsZ28udHM6NDYKCS8vIHNlbmRlcjogdGhpcy5hcHAuYWRkcmVzcwoJdHhuYSBBcHBsaWNhdGlvbnMgMAoJYXBwX3BhcmFtc19nZXQgQXBwQWRkcmVzcwoJYXNzZXJ0CglpdHhuX2ZpZWxkIFNlbmRlcgoKCS8vIHRva2VuX21ldGFkYXRhLmFsZ28udHM6NDcKCS8vIHJlY2VpdmVyOiBhc2EubWFuYWdlcgoJZnJhbWVfZGlnIC0xIC8vIGFzYTogYXNzZXQKCWFzc2V0X3BhcmFtc19nZXQgQXNzZXRNYW5hZ2VyCglhc3NlcnQKCWl0eG5fZmllbGQgUmVjZWl2ZXIKCgkvLyB0b2tlbl9tZXRhZGF0YS5hbGdvLnRzOjQ4CgkvLyBhbW91bnQ6IHRoaXMuYXBwLmFkZHJlc3MuYmFsYW5jZSAtIHRoaXMuYXBwLmFkZHJlc3MubWluQmFsYW5jZQoJdHhuYSBBcHBsaWNhdGlvbnMgMAoJYXBwX3BhcmFtc19nZXQgQXBwQWRkcmVzcwoJYXNzZXJ0CglhY2N0X3BhcmFtc19nZXQgQWNjdEJhbGFuY2UKCWFzc2VydAoJdHhuYSBBcHBsaWNhdGlvbnMgMAoJYXBwX3BhcmFtc19nZXQgQXBwQWRkcmVzcwoJYXNzZXJ0CglhY2N0X3BhcmFtc19nZXQgQWNjdE1pbkJhbGFuY2UKCWFzc2VydAoJLQoJaXR4bl9maWVsZCBBbW91bnQKCgkvLyB0b2tlbl9tZXRhZGF0YS5hbGdvLnRzOjQ5CgkvLyBmZWU6IDAKCWludCAwCglpdHhuX2ZpZWxkIEZlZQoJaXR4bl9zdWJtaXQKCXJldHN1YgoKbWFpbjoKCXR4biBOdW1BcHBBcmdzCglibnogcm91dGVfYWJpCgoJLy8gZGVmYXVsdCBjcmVhdGVBcHBsaWNhdGlvbgoJdHhuIEFwcGxpY2F0aW9uSUQKCWludCAwCgk9PQoJdHhuIE9uQ29tcGxldGlvbgoJaW50IE5vT3AKCT09CgkmJgoJcmV0dXJuCgpyb3V0ZV9hYmk6CgltZXRob2QgInVwZGF0ZU1ldGFkYXRhRW50cnkoYnl0ZVtdLGJ5dGVbXSxhc3NldCl2b2lkIgoJbWV0aG9kICJ1cGRhdGVNZXRhZGF0YUVudHJpZXMoc3RyaW5nWzhdLHN0cmluZ1s4XSxhc3NldCl2b2lkIgoJbWV0aG9kICJkZWxldGVNZXRhZGF0YUVudHJ5KGJ5dGVbXSxhc3NldCl2b2lkIgoJbWV0aG9kICJyZWNsYWltQUxHT3MoYXNzZXQpdm9pZCIKCXR4bmEgQXBwbGljYXRpb25BcmdzIDAKCW1hdGNoIGFiaV9yb3V0ZV91cGRhdGVNZXRhZGF0YUVudHJ5IGFiaV9yb3V0ZV91cGRhdGVNZXRhZGF0YUVudHJpZXMgYWJpX3JvdXRlX2RlbGV0ZU1ldGFkYXRhRW50cnkgYWJpX3JvdXRlX3JlY2xhaW1BTEdPcw==";
    override clearProgram: string = "I3ByYWdtYSB2ZXJzaW9uIDgKaW50IDEKcmV0dXJu";
    override methods: algosdk.ABIMethod[] = [
        new algosdk.ABIMethod({ name: "updateMetadataEntry", desc: "", args: [{ type: "byte[]", name: "key", desc: "" }, { type: "byte[]", name: "value", desc: "" }, { type: "asset", name: "asa", desc: "" }], returns: { type: "void", desc: "" } }),
        new algosdk.ABIMethod({ name: "updateMetadataEntries", desc: "", args: [{ type: "string[8]", name: "keys", desc: "" }, { type: "string[8]", name: "values", desc: "" }, { type: "asset", name: "asa", desc: "" }], returns: { type: "void", desc: "" } }),
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
    async updateMetadataEntries(args: {
        keys: string[];
        values: string[];
        asa: bigint;
    }, txnParams?: bkr.TransactionOverrides): Promise<bkr.ABIResult<void>> {
        const result = await this._execute(await this.compose.updateMetadataEntries({ keys: args.keys, values: args.values, asa: args.asa }, txnParams));
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
        updateMetadataEntries: async (args: {
            keys: string[];
            values: string[];
            asa: bigint;
        }, txnParams?: bkr.TransactionOverrides, atc?: algosdk.AtomicTransactionComposer): Promise<algosdk.AtomicTransactionComposer> => {
            return this._addMethodCall(algosdk.getMethodByName(this.methods, "updateMetadataEntries"), { keys: args.keys, values: args.values, asa: args.asa }, txnParams, atc);
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

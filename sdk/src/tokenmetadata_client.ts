import algosdk from "algosdk";
import * as bkr from "beaker-ts";
export class TokenMetadata extends bkr.ApplicationClient {
    desc: string = "";
    override appSchema: bkr.Schema = { declared: { asa: { type: bkr.AVMType.uint64, key: "asa", desc: "", static: false } }, reserved: {} };
    override acctSchema: bkr.Schema = { declared: {}, reserved: {} };
    override approvalProgram: string = "I3ByYWdtYSB2ZXJzaW9uIDgKCWIgbWFpbgoKcHJlQXJyYXlBY2Nlc3M6Cglwcm90byAzIDAKCWZyYW1lX2RpZyAtMyAvLyBmdWxsIHR1cGxlCglzdG9yZSAwIC8vIGZ1bGwgdHVwbGUKCWxvYWQgMCAvLyBmdWxsIHR1cGxlCglmcmFtZV9kaWcgLTEgLy8gaGVhZCBvZmZzZXQKCWV4dHJhY3RfdWludDE2IC8vIGV4dHJhY3QgYXJyYXkgb2Zmc2V0CglzdG9yZSAxIC8vIGFycmF5IG9mZnNldAoJbG9hZCAwIC8vIGZ1bGwgdHVwbGUKCWxvYWQgMSAvLyBhcnJheSBvZmZzZXQKCWV4dHJhY3RfdWludDE2IC8vIGV4dHJhY3QgYXJyYXkgbGVuZ3RoCglmcmFtZV9kaWcgLTIgLy8gdHlwZSBsZW5ndGgKCSogLy8gYXJyYXkgc2l6ZQoJaW50IDIKCSsgLy8gYXJyYXkgc2l6ZSArIGxlbgoJc3RvcmUgMiAvLyBmdWxsIGFycmF5IGxlbmd0aAoJcmV0c3ViCgp2ZXJpZnlPclNldEFTQToKCXByb3RvIDEgMAoKCS8vIGlmMF9jb25kaXRpb24KCS8vIHRva2VuX21ldGFkYXRhLmFsZ28udHM6MTEKCS8vIHRoaXMuYXNhLmV4aXN0cygpCgl0eG5hIEFwcGxpY2F0aW9ucyAwCglieXRlICJhc2EiCglhcHBfZ2xvYmFsX2dldF9leAoJc3dhcAoJcG9wCglieiBpZjBfZWxzZQoKCS8vIGlmMF9jb25zZXF1ZW50CgkvLyB0b2tlbl9tZXRhZGF0YS5hbGdvLnRzOjEyCgkvLyBhc3NlcnQodGhpcy5hc2EuZ2V0KCkgPT09IGFzYSkKCWJ5dGUgImFzYSIKCWFwcF9nbG9iYWxfZ2V0CglmcmFtZV9kaWcgLTEgLy8gYXNhOiBhc3NldAoJPT0KCWFzc2VydAoJYiBpZjBfZW5kCgppZjBfZWxzZToKCS8vIHRva2VuX21ldGFkYXRhLmFsZ28udHM6MTQKCS8vIGFzc2VydCh0aGlzLnR4bi5zZW5kZXIgPT09IHRoaXMuYXBwLmNyZWF0b3IpCgl0eG4gU2VuZGVyCgl0eG5hIEFwcGxpY2F0aW9ucyAwCglhcHBfcGFyYW1zX2dldCBBcHBDcmVhdG9yCglhc3NlcnQKCT09Cglhc3NlcnQKCgkvLyB0b2tlbl9tZXRhZGF0YS5hbGdvLnRzOjE1CgkvLyB0aGlzLmFzYS5wdXQoYXNhKQoJYnl0ZSAiYXNhIgoJZnJhbWVfZGlnIC0xIC8vIGFzYTogYXNzZXQKCWFwcF9nbG9iYWxfcHV0CgppZjBfZW5kOgoJLy8gdG9rZW5fbWV0YWRhdGEuYWxnby50czoxOAoJLy8gYXNzZXJ0KHRoaXMudHhuLnNlbmRlciA9PT0gdGhpcy5hc2EuZ2V0KCkubWFuYWdlcikKCXR4biBTZW5kZXIKCWJ5dGUgImFzYSIKCWFwcF9nbG9iYWxfZ2V0Cglhc3NldF9wYXJhbXNfZ2V0IEFzc2V0TWFuYWdlcgoJYXNzZXJ0Cgk9PQoJYXNzZXJ0CglyZXRzdWIKCnVwZGF0ZU1ldGFkYXRhRW50cnk6Cglwcm90byAzIDAKCgkvLyB0b2tlbl9tZXRhZGF0YS5hbGdvLnRzOjIyCgkvLyB0aGlzLnZlcmlmeU9yU2V0QVNBKGFzYSkKCWJ5dGUgMHgKCXBvcAoJZnJhbWVfZGlnIC0zIC8vIGFzYTogYXNzZXQKCWNhbGxzdWIgdmVyaWZ5T3JTZXRBU0EKCgkvLyB0b2tlbl9tZXRhZGF0YS5hbGdvLnRzOjI0CgkvLyB0aGlzLm1ldGFkYXRhRW50cnkucHV0KGNvbmNhdChBUkNfU1RSSU5HLCBrZXkpLCB2YWx1ZSkKCWJ5dGUgIkFSQ1hYWFgiCglmcmFtZV9kaWcgLTEgLy8ga2V5OiBieXRlcwoJY29uY2F0CglkdXAKCWJveF9kZWwKCXBvcAoJZnJhbWVfZGlnIC0yIC8vIHZhbHVlOiBieXRlcwoJYm94X3B1dAoJcmV0c3ViCgphYmlfcm91dGVfdXBkYXRlTWV0YWRhdGFFbnRyaWVzOgoJdHhuIE9uQ29tcGxldGlvbgoJaW50IE5vT3AKCT09Cgl0eG4gQXBwbGljYXRpb25JRAoJaW50IDAKCSE9CgkmJgoJYXNzZXJ0CglieXRlIDB4CglkdXBuIDAKCXR4bmEgQXBwbGljYXRpb25BcmdzIDMKCWJ0b2kKCXR4bmFzIEFzc2V0cwoJdHhuYSBBcHBsaWNhdGlvbkFyZ3MgMgoJdHhuYSBBcHBsaWNhdGlvbkFyZ3MgMQoJY2FsbHN1YiB1cGRhdGVNZXRhZGF0YUVudHJpZXMKCWludCAxCglyZXR1cm4KCnVwZGF0ZU1ldGFkYXRhRW50cmllczoKCXByb3RvIDQgMAoKCS8vIHRva2VuX21ldGFkYXRhLmFsZ28udHM6MjgKCS8vIHRoaXMudmVyaWZ5T3JTZXRBU0EoYXNhKQoJYnl0ZSAweAoJcG9wCglmcmFtZV9kaWcgLTMgLy8gYXNhOiBhc3NldAoJY2FsbHN1YiB2ZXJpZnlPclNldEFTQQoKCS8vIHRva2VuX21ldGFkYXRhLmFsZ28udHM6MzAKCS8vIGkgPSAwCglpbnQgMAoJZnJhbWVfYnVyeSAtNCAvLyBpOiB1aW50NjQKCmZvcl8wOgoJZnJhbWVfZGlnIC00IC8vIGk6IHVpbnQ2NAoJaW50IDQKCTwKCWJ6IGZvcl8wX2VuZAoKCS8vIGlmMV9jb25kaXRpb24KCS8vIHRva2VuX21ldGFkYXRhLmFsZ28udHM6MzEKCS8vIHZhbHVlc1tpXSA9PT0gJycKCWZyYW1lX2RpZyAtMiAvLyB2YWx1ZXM6IGJ5dGVzWzRdCglpbnQgMSAvLyB0eXBlIGxlbmd0aAoJZnJhbWVfZGlnIC00IC8vIGk6IHVpbnQ2NAoJaW50IDIKCSogLy8gaGVhZCBvZmZzZXQKCWNhbGxzdWIgcHJlQXJyYXlBY2Nlc3MKCWxvYWQgMCAvLyBmdWxsIHR1cGxlCglsb2FkIDEgLy8gYXJyYXkgb2Zmc2V0Cglsb2FkIDIgLy8gZnVsbCBhcnJheSBsZW5ndGgKCWV4dHJhY3QzCglleHRyYWN0IDIgMCAvLyBleHRyYWN0IGJ5dGVzIGZyb20gc3RyaW5nCglieXRlICIiCgk9PQoJYnogaWYxX2VuZAoKCS8vIGlmMV9jb25zZXF1ZW50CgkvLyB0b2tlbl9tZXRhZGF0YS5hbGdvLnRzOjMxCgkvLyByZXR1cm4KCXJldHN1YgoKaWYxX2VuZDoKCS8vIHRva2VuX21ldGFkYXRhLmFsZ28udHM6MzIKCS8vIHRoaXMudXBkYXRlTWV0YWRhdGFFbnRyeShrZXlzW2ldLCB2YWx1ZXNbaV0sIGFzYSkKCWJ5dGUgMHgKCXBvcAoJZnJhbWVfZGlnIC0zIC8vIGFzYTogYXNzZXQKCWZyYW1lX2RpZyAtMiAvLyB2YWx1ZXM6IGJ5dGVzWzRdCglpbnQgMSAvLyB0eXBlIGxlbmd0aAoJZnJhbWVfZGlnIC00IC8vIGk6IHVpbnQ2NAoJaW50IDIKCSogLy8gaGVhZCBvZmZzZXQKCWNhbGxzdWIgcHJlQXJyYXlBY2Nlc3MKCWxvYWQgMCAvLyBmdWxsIHR1cGxlCglsb2FkIDEgLy8gYXJyYXkgb2Zmc2V0Cglsb2FkIDIgLy8gZnVsbCBhcnJheSBsZW5ndGgKCWV4dHJhY3QzCglleHRyYWN0IDIgMCAvLyBleHRyYWN0IGJ5dGVzIGZyb20gc3RyaW5nCglmcmFtZV9kaWcgLTEgLy8ga2V5czogYnl0ZXNbNF0KCWludCAxIC8vIHR5cGUgbGVuZ3RoCglmcmFtZV9kaWcgLTQgLy8gaTogdWludDY0CglpbnQgMgoJKiAvLyBoZWFkIG9mZnNldAoJY2FsbHN1YiBwcmVBcnJheUFjY2VzcwoJbG9hZCAwIC8vIGZ1bGwgdHVwbGUKCWxvYWQgMSAvLyBhcnJheSBvZmZzZXQKCWxvYWQgMiAvLyBmdWxsIGFycmF5IGxlbmd0aAoJZXh0cmFjdDMKCWV4dHJhY3QgMiAwIC8vIGV4dHJhY3QgYnl0ZXMgZnJvbSBzdHJpbmcKCWNhbGxzdWIgdXBkYXRlTWV0YWRhdGFFbnRyeQoKCS8vIHRva2VuX21ldGFkYXRhLmFsZ28udHM6MzAKCS8vIGkgPSBpICsgMQoJZnJhbWVfZGlnIC00IC8vIGk6IHVpbnQ2NAoJaW50IDEKCSsKCWZyYW1lX2J1cnkgLTQgLy8gaTogdWludDY0CgliIGZvcl8wCgpmb3JfMF9lbmQ6CglyZXRzdWIKCmFiaV9yb3V0ZV9kZWxldGVNZXRhZGF0YUVudHJ5OgoJdHhuIE9uQ29tcGxldGlvbgoJaW50IE5vT3AKCT09Cgl0eG4gQXBwbGljYXRpb25JRAoJaW50IDAKCSE9CgkmJgoJYXNzZXJ0CglieXRlIDB4Cglwb3AKCXR4bmEgQXBwbGljYXRpb25BcmdzIDIKCWJ0b2kKCXR4bmFzIEFzc2V0cwoJdHhuYSBBcHBsaWNhdGlvbkFyZ3MgMQoJZXh0cmFjdCAyIDAKCWNhbGxzdWIgZGVsZXRlTWV0YWRhdGFFbnRyeQoJaW50IDEKCXJldHVybgoKZGVsZXRlTWV0YWRhdGFFbnRyeToKCXByb3RvIDIgMAoKCS8vIHRva2VuX21ldGFkYXRhLmFsZ28udHM6MzcKCS8vIHRoaXMudmVyaWZ5T3JTZXRBU0EoYXNhKQoJYnl0ZSAweAoJcG9wCglmcmFtZV9kaWcgLTIgLy8gYXNhOiBhc3NldAoJY2FsbHN1YiB2ZXJpZnlPclNldEFTQQoKCS8vIHRva2VuX21ldGFkYXRhLmFsZ28udHM6MzkKCS8vIHRoaXMubWV0YWRhdGFFbnRyeS5kZWxldGUoY29uY2F0KEFSQ19TVFJJTkcsIGtleSkpCglieXRlICJBUkNYWFhYIgoJZnJhbWVfZGlnIC0xIC8vIGtleTogYnl0ZXMKCWNvbmNhdAoJYm94X2RlbAoJcmV0c3ViCgphYmlfcm91dGVfcmVjbGFpbUFMR09zOgoJdHhuIE9uQ29tcGxldGlvbgoJaW50IE5vT3AKCT09Cgl0eG4gQXBwbGljYXRpb25JRAoJaW50IDAKCSE9CgkmJgoJYXNzZXJ0CglieXRlIDB4Cglwb3AKCXR4bmEgQXBwbGljYXRpb25BcmdzIDEKCWJ0b2kKCXR4bmFzIEFzc2V0cwoJY2FsbHN1YiByZWNsYWltQUxHT3MKCWludCAxCglyZXR1cm4KCnJlY2xhaW1BTEdPczoKCXByb3RvIDEgMAoKCS8vIHRva2VuX21ldGFkYXRhLmFsZ28udHM6NDMKCS8vIHRoaXMudmVyaWZ5T3JTZXRBU0EoYXNhKQoJYnl0ZSAweAoJcG9wCglmcmFtZV9kaWcgLTEgLy8gYXNhOiBhc3NldAoJY2FsbHN1YiB2ZXJpZnlPclNldEFTQQoKCS8vIHRva2VuX21ldGFkYXRhLmFsZ28udHM6NDUKCS8vIHNlbmRQYXltZW50KHsKCWl0eG5fYmVnaW4KCWludCBwYXkKCWl0eG5fZmllbGQgVHlwZUVudW0KCgkvLyB0b2tlbl9tZXRhZGF0YS5hbGdvLnRzOjQ2CgkvLyBzZW5kZXI6IHRoaXMuYXBwLmFkZHJlc3MKCXR4bmEgQXBwbGljYXRpb25zIDAKCWFwcF9wYXJhbXNfZ2V0IEFwcEFkZHJlc3MKCWFzc2VydAoJaXR4bl9maWVsZCBTZW5kZXIKCgkvLyB0b2tlbl9tZXRhZGF0YS5hbGdvLnRzOjQ3CgkvLyByZWNlaXZlcjogYXNhLm1hbmFnZXIKCWZyYW1lX2RpZyAtMSAvLyBhc2E6IGFzc2V0Cglhc3NldF9wYXJhbXNfZ2V0IEFzc2V0TWFuYWdlcgoJYXNzZXJ0CglpdHhuX2ZpZWxkIFJlY2VpdmVyCgoJLy8gdG9rZW5fbWV0YWRhdGEuYWxnby50czo0OAoJLy8gYW1vdW50OiB0aGlzLmFwcC5hZGRyZXNzLmJhbGFuY2UgLSB0aGlzLmFwcC5hZGRyZXNzLm1pbkJhbGFuY2UKCXR4bmEgQXBwbGljYXRpb25zIDAKCWFwcF9wYXJhbXNfZ2V0IEFwcEFkZHJlc3MKCWFzc2VydAoJYWNjdF9wYXJhbXNfZ2V0IEFjY3RCYWxhbmNlCglhc3NlcnQKCXR4bmEgQXBwbGljYXRpb25zIDAKCWFwcF9wYXJhbXNfZ2V0IEFwcEFkZHJlc3MKCWFzc2VydAoJYWNjdF9wYXJhbXNfZ2V0IEFjY3RNaW5CYWxhbmNlCglhc3NlcnQKCS0KCWl0eG5fZmllbGQgQW1vdW50CgoJLy8gdG9rZW5fbWV0YWRhdGEuYWxnby50czo0OQoJLy8gZmVlOiAwCglpbnQgMAoJaXR4bl9maWVsZCBGZWUKCWl0eG5fc3VibWl0CglyZXRzdWIKCm1haW46Cgl0eG4gTnVtQXBwQXJncwoJYm56IHJvdXRlX2FiaQoKCS8vIGRlZmF1bHQgY3JlYXRlQXBwbGljYXRpb24KCXR4biBBcHBsaWNhdGlvbklECglpbnQgMAoJPT0KCXR4biBPbkNvbXBsZXRpb24KCWludCBOb09wCgk9PQoJJiYKCXJldHVybgoKcm91dGVfYWJpOgoJbWV0aG9kICJ1cGRhdGVNZXRhZGF0YUVudHJpZXMoc3RyaW5nWzRdLHN0cmluZ1s0XSxhc3NldCl2b2lkIgoJbWV0aG9kICJkZWxldGVNZXRhZGF0YUVudHJ5KGJ5dGVbXSxhc3NldCl2b2lkIgoJbWV0aG9kICJyZWNsYWltQUxHT3MoYXNzZXQpdm9pZCIKCXR4bmEgQXBwbGljYXRpb25BcmdzIDAKCW1hdGNoIGFiaV9yb3V0ZV91cGRhdGVNZXRhZGF0YUVudHJpZXMgYWJpX3JvdXRlX2RlbGV0ZU1ldGFkYXRhRW50cnkgYWJpX3JvdXRlX3JlY2xhaW1BTEdPcw==";
    override clearProgram: string = "I3ByYWdtYSB2ZXJzaW9uIDgKaW50IDEKcmV0dXJu";
    override methods: algosdk.ABIMethod[] = [
        new algosdk.ABIMethod({ name: "updateMetadataEntries", desc: "", args: [{ type: "string[4]", name: "keys", desc: "" }, { type: "string[4]", name: "values", desc: "" }, { type: "asset", name: "asa", desc: "" }], returns: { type: "void", desc: "" } }),
        new algosdk.ABIMethod({ name: "deleteMetadataEntry", desc: "", args: [{ type: "byte[]", name: "key", desc: "" }, { type: "asset", name: "asa", desc: "" }], returns: { type: "void", desc: "" } }),
        new algosdk.ABIMethod({ name: "reclaimALGOs", desc: "", args: [{ type: "asset", name: "asa", desc: "" }], returns: { type: "void", desc: "" } })
    ];
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

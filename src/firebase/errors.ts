export type SecurityRuleContext = {
  path: string;
  operation: 'get' | 'list' | 'create' | 'update' | 'delete' | 'write';
  requestResourceData?: any;
};

export class FirestorePermissionError extends Error {
  constructor(public context: SecurityRuleContext) {
    const { path, operation, requestResourceData } = context;
    const requestDetails = JSON.stringify(
      {
        path,
        operation,
        resource: requestResourceData,
      },
      null,
      2
    );

    super(
      `FirestoreError: Missing or insufficient permissions: The following request was denied by Firestore Security Rules:\n${requestDetails}`
    );
    this.name = 'FirestorePermissionError';
  }
}

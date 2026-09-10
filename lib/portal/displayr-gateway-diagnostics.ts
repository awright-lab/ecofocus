const codes = [
  'AUTHORIZATION_UNAVAILABLE', 'AUTHORIZATION_DENIED', 'PUBLIC_ORIGIN_INVALID',
  'CONTROL_ORIGIN_INVALID', 'CONTROL_SECRET_MISSING', 'CONTROL_REQUEST_FAILED',
  'CONTROL_UNAUTHORIZED', 'CONTROL_ACCESS_DENIED', 'CONTROL_ROUTE_NOT_FOUND',
  'CONTROL_UNAVAILABLE', 'CONTROL_RESPONSE_INVALID', 'LAUNCH_UNEXPECTED',
] as const;

type GatewayFailureCode = typeof codes[number];

export class DisplayrGatewayError extends Error {
  readonly code: GatewayFailureCode;
  constructor(code: GatewayFailureCode) {
    super(code);
    this.code = code;
  }
}

// Never serialize an arbitrary exception: fetch/Auth errors may contain URLs
// or credentials. Only these fixed codes may reach logs or the pilot viewer.
export function displayrGatewayFailureCode(error: unknown): GatewayFailureCode {
  return error instanceof DisplayrGatewayError && codes.includes(error.code)
    ? error.code : 'LAUNCH_UNEXPECTED';
}

export function controlFailureCode(status: number): GatewayFailureCode {
  if (status === 401) return 'CONTROL_UNAUTHORIZED';
  if (status === 403) return 'CONTROL_ACCESS_DENIED';
  if (status === 404) return 'CONTROL_ROUTE_NOT_FOUND';
  return 'CONTROL_UNAVAILABLE';
}

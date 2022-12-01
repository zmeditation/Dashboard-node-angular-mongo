export interface Request {
  readonly query: any;
  readonly body: any;
  readonly method: string;
  readonly params: any;
}

export interface Response {
  status(code: number): Response;
  send(data?: string | object): void;
  json(data: any): void;
}

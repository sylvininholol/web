export class DomainException extends Error {
  constructor(public readonly statusCode: number) {
    super();
  }
}

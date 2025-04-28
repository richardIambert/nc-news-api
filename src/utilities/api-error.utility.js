export class APIError extends Error {
  #status;

  constructor(status, message, options) {
    super(message, options);
    this.#status = status;
  }

  get status() {
    return this.#status;
  }
}

import { pathOr } from 'ramda';

export const shouldDisplayError = error => {
  return error && error.status === 401;
};

function NormalError(status, message, error) {
  if (!(this instanceof NormalError)) {
    return new NormalError(status, message, error);
  }
  this.response = { message: pathOr(message, ['response', 'message'], error) };
  this.status = status;
  this.message = message;
}

NormalError.prototype = Object.create(Error.prototype);
NormalError.prototype.constructor = NormalError;

export default NormalError;

class Base {
  constructor({ args, isAdditionalRequired }) {
    if (isAdditionalRequired && (!args || !args.body.additional)) throw new Error('MISSING_ADDITIONAL_PARAMETERS');
    this.parameters = args;
  }

  run() {
    return this.execute(this.parameters);
  }

  execute(params) {
    throw Error('Must be override.');
  }
}

module.exports = Base;

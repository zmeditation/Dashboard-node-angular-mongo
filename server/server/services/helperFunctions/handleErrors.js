exports.handleErrors = (err, beginOfError = 'Error', isLog = true) => {
  const error = {
    msg: err.msg
      ? `${beginOfError}, ${err.msg}`
        : err.message
      ? `${beginOfError}, ${err.message}`
        : err
      ? `${beginOfError}  ${JSON.stringify(err)}`
        : beginOfError
  };

  isLog && console.error(error.msg);
  return { error };
};

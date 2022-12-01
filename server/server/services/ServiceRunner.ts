export default (Service: any, requestData: any, isAdditionalRequired = true) => {
  return async (req: any, res: any) => {
    const serviceInstance = new Service({ args: requestData(req), isAdditionalRequired });
    const status = await serviceInstance.run();
    if (res.status) {
      res.status(200).json(status);
    } else {
      // If run test, res from Sinon.
      res.send(status);
    }
  };
};

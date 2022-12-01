const grpc = require('grpc');
const protoLoader = require('@grpc/proto-loader');

// endpoint - string like "IP:port", path to analytics endpoint

// serviceObject - object with required fields 'type' and 'service', and non-required field 'additional'.
// Describes path to using grpc service, like '.wbid.analytics.charts': 'wbid' - type, 'analytics' - service, 'charts' - additional

class grpcService {
  constructor(args, PROTO_PATH, endpoint, serviceObject) {
    this.reqBody = args;
    this.PROTO_PATH = PROTO_PATH;
    this.endpoint = endpoint;
    this.serviceObject = serviceObject;
  }

  async makeRequest(service) {
    return new Promise(async (resolve, reject) => {
      try {
        const protoData = this.prepareProtoData(this.PROTO_PATH);
        const client = new protoData[service](this.endpoint, grpc.credentials.createInsecure());
        if (client && client['GetData']) {
          client['GetData'](this.reqBody, function (err, response) {
            if (response === undefined || err) { 
              reject(response);
            }
            resolve(response);
          });
        }
      } catch (error) {
        console.error(error);
        throw error;
      }
    });
  }

  prepareProtoData(PROTO_PATH) {
    const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
      keepCase: true,
      longs: String,
      enums: String,
      defaults: true,
      oneofs: true
    });
    if (this.serviceObject && this.serviceObject.additional) {
      return grpc.loadPackageDefinition(packageDefinition)[this.serviceObject.type][this.serviceObject.service][
        this.serviceObject.additional
      ];
    } else {
      return grpc.loadPackageDefinition(packageDefinition)[this.serviceObject.type][this.serviceObject.service];
    }
  }
}

export default grpcService;

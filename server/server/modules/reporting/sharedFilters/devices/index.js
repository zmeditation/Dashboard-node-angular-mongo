

class DevicesConfig {
  constructor() {

  }
  run() {
    return {
      success: true,
      name: 'DEVICES',
      results: [
        'desktop',
        'mobile',
        'tablet'
      ]
    }
  }
}

module.exports = DevicesConfig;

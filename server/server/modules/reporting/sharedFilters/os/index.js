class OperationSystems {
  constructor() {

  }
  run() {
    return {
      success: true,
        name: 'OS',
        results: [
          'Windows',
          'Android',
          'Linux',
          'Macintosh',
          'PlayBook',
          'Kindle',
          'iOS',
          'unknown'
        ]
    }
  }
}

module.exports = OperationSystems;
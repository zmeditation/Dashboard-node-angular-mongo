const isValidDomain = {
  validator(value) {
    const check = value.match(/^(http:\/\/|https:\/\/)?((?!-))(xn--)?[a-z0-9][a-z0-9-_]{0,61}[a-z0-9]{0,1}\.(xn--)?([a-z0-9\-]{1,61}|[a-z0-9-]{1,30}\.[a-z]{2,})\/?$/g);
    return !!check;
  },
  message(props) {
    return `Domain - ${props.value} - is not valid.`;
  }
}

const isUnique = {
  async validator(value, done) {
    const Domains = this.model('Domains');
    const repeat = await Domains.findOne({ domain: value });
    return !repeat;    
  },
  message(props) {
    return `Domain - ${props.value} - already exist.`; 
  }
}

module.exports = { 
  isValidDomain,
  isUnique 
};
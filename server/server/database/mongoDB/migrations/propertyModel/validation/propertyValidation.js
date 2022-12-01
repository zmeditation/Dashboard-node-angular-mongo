const isUnique = {
  async validator(value, done) {
    const Properties = this.model('Property');
    const repeat = await Properties.findOne({ property_id: value });
    return !repeat;
  },
  message(props) {
    return `Ad Unit - ${props.value} - already exist.`; 
  }
}

module.exports = { 
  isUnique 
};
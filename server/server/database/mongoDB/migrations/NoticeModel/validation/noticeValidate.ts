const noticeTypes = [
  'information',
  'warning'
];

const isTypeExist = {
  async validator(value: string) {
    return noticeTypes.includes(value);
  },
  message(props: any) {
      return `${props.value} - is NOT a valid type of notice. Should be one of the: ${noticeTypes.join(', ')}`;
  },
};

module.exports = { 
  isTypeExist 
};
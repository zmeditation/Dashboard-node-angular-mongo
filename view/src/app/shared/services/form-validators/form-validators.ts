import { FormGroup, ValidatorFn } from '@angular/forms';

export class FormValidators {
  constructor() {}

  public validatorForPublishers(valid): ValidatorFn {
    return (group: FormGroup): { [key: string]: any } => {
      const checking = valid.some((i) => {
        return i === group.value;
      });
      if (checking) { return null; } else {
        return {
          check: false
        };
      }


    };
  }

  public validatorForDomains(valid): ValidatorFn {
    return (group: FormGroup): { [key: string]: any } => {
      const checking = valid.some((i) => {
        return i === group.value;
      });
      if (checking) { return null; } else {
        return {
          check: false
        };
      }


    };
  }

  public validatorForPlacements(valid): ValidatorFn {
    return (group: FormGroup): { [key: string]: any } => {
      const checking = valid.some((i) => {
        return i === group.value;
      });
      if (checking) { return null; } else {
        return {
          check: false
        };
      }


    };
  }

  public validatorForTypes(valid): ValidatorFn {
    return (group: FormGroup): { [key: string]: any } => {
      const checking = valid.some((i) => {
        return i === group.value;
      });
      if (checking) { return null; } else {
        return {
          check: false
        };
      }


    };
  }

  public validatorForDate(): ValidatorFn {
    return (group: FormGroup): { [key: string]: any } => {
      const checking = new Date();

      if (checking >= group.value) { return null; } else {
        return {
          check: false
        };
      }


    };
  }

  public validatorForProgrammatics(valid): ValidatorFn {
    return (group: FormGroup): { [key: string]: any } => {
      if (valid !== undefined) {
        const checking = valid.some((i) => {
          return i === group.value;
        });
        if (checking) { return null; } else {
          return {
            check: false
          };
        }


      }
    };
  }

  public validatorForRequests(valid): ValidatorFn {
    return (group: FormGroup): { [key: string]: any } => {
      if (typeof group.value === 'number') { return null; }

      return {
        type: {
          actual: typeof group.value,
          need: 'number'
        }
      };
      // if (this['uploadFormManual']) {
      //   const checking = valid.value.matched_request;
      //   const checking_next = valid.value.clicks;
      //
      //   if (checking_next <= checking) {
      //     return null;
      //   } else {
      //     return {
      //       check: false
      //     }
      //   }
      // }
    };
  }

  public validatorForImpressions(valid): ValidatorFn {
    return (group: FormGroup): { [key: string]: any } => {
      if (valid) {
        // const checking = valid.value.ad_request;
        const checking_next = valid.value.clicks;

        if (checking_next <= group.value) { return null; } else {
          return {
            check: false
          };
        }


      }
    };
  }

  public validatorForClicks(valid): ValidatorFn {
    return (group: FormGroup): { [key: string]: any } => {
      if (valid) {
        const checking = valid.value.matched_request;
        // const checking_prev = valid.value.ad_request;

        if (group.value <= checking) { return null; } else {
          return {
            check: false
          };
        }


      }
    };
  }

  public validatorForUserPassword(): ValidatorFn {
    return (group: FormGroup): { [key: string]: any } => {
      const check_1 = !group.value.includes(' ');
      const check_2 = [];
      for (const i of group.value) { if (i.charCodeAt(0) < 33 || i.charCodeAt(0) > 126) { check_2.push(i.charCodeAt(0)); } }


      if (group.value.length >= 8 && group.value.length < 51 && check_1 && check_2.length === 0) {
        return null;
      } else if (group.value === 'placeholder') {
        return null;
      } else {
        return {
          check: false,
          message: 'PASSWORD'
        };
      }


    };
  }

  public validatorForUserName(): ValidatorFn {
    return (group: FormGroup): { [key: string]: any } => {
      const check = [];
      for (const i of group.value) {
        if (i.charCodeAt(0) < 32 || (i.charCodeAt(0) > 126 && i.charCodeAt(0) < 1040) || i.charCodeAt(0) > 1103) {
          check.push(i.charCodeAt(0));
        }
      }


      if (check.length === 0 && group.value.length <= 50 && group.value.length >= 2) {
        return null;
      } else {
        return {
          check: false,
          message: 'USER_NAME'
        };
      }


    };
  }

  public validatorForCompany(): ValidatorFn {
    return (group: FormGroup): { [key: string]: any } => {
      const check = [];
      for (const i of group.value) {
        if (i.charCodeAt(0) < 32 || (i.charCodeAt(0) > 126 && i.charCodeAt(0) < 1040) || i.charCodeAt(0) > 1103) {
          check.push(i.charCodeAt(0));
        }
      }


      if (check.length === 0 && group.value.length <= 30) {
        return null;
      } else {
        return {
          check: false,
          message: 'USER_COMPANY'
        };
      }


    };
  }

  public validatorForPhone(): ValidatorFn {
    return (group: FormGroup): { [key: string]: any } => {
      const check = [];
      for (const i of group.value) {
        if (i.charCodeAt(0) < 48 || i.charCodeAt(0) > 57) {
          check.push(i.charCodeAt(0));
        }
      }


      if (check.length === 0 && group.value.length <= 13) {
        return null;
      } else {
        return {
          check: false,
          message: 'USER_PHONE'
        };
      }


    };
  }

  public validatorForBirthday(): ValidatorFn {
    return (group: FormGroup): { [key: string]: any } => {
      const check = new Date();

      if (new Date(group.value).getTime() < check.getTime() && check.getFullYear() - new Date(group.value).getFullYear() >= 18) {
        return null;
      } else if (group.value === '') {
        return null;
      } else {
        return {
          check: false,
          message: 'USER_BIRTHDAY'
        };
      }


    };
  }

  public validatorForSigningEmail(): ValidatorFn {
    return (group: FormGroup): { [key: string]: any } => {
      const check = [];
      if (group.value && group.value.search(/@/) !== -1) {
        for (const i of group.value) {
          if (i.charCodeAt(0) < 32 || (i.charCodeAt(0) > 126 && i.charCodeAt(0) < 1040) || i.charCodeAt(0) > 1103) {
            check.push(i.charCodeAt(0));
          }
        }


        if (check.length === 0 && group.value.length <= 50 && group.value.length >= 2) { return null; }

      }
      return {
        check: false,
        message: 'SIGNIN_EMAIL'
      };
    };
  }
}

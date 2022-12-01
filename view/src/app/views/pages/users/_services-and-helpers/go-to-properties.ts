import { Router } from '@angular/router';

export class GoToProperties {
  constructor(public router: Router) {}

  // goToProperties(data) {
  //   sessionStorage.removeItem('user_prop_temp');
  //   sessionStorage.setItem('user_prop_temp', JSON.stringify({object: {userObject: data}, id: data._id}));
  //   this.router.navigate(['/users', 'properties', data.name.toLowerCase()]);
  // }
}

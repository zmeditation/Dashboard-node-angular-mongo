import { UsersProfileModule } from './users-profile.module';

xdescribe('UsersProfileModule', () => {
  let usersProfileModule: UsersProfileModule;

  beforeEach(() => {
    usersProfileModule = new UsersProfileModule();
  });

  it('should create an instance', () => {
    expect(usersProfileModule).toBeTruthy();
  });
});

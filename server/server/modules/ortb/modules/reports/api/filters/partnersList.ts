import { UserMDB } from '../../../../../../types/user';
import GetUsers from '../../../../../../services/users/getUsers/getUsers';
import { ROLES } from '../../../../../../constants/roles';

export default class PartnersList {
  query = {
    roles: ROLES.PARTNER,
    sort: 'name:asc',
    page: '1',
    limit: '50',
    step: '5',
    include: '[{"key":"enabled.status","value":true,"extraValue":false}]',
    indent: '0'
  };
  body: any;

  constructor(req: any) {
    this.body = req.args.body;
  }

  async run() {
    return {
      success: true,
      name: 'PUBLISHERS',
      results: await this.getPartners(this.body, this.query)
    };
  }

  getPartners = async (body: any, query: any) => {
    const getUsersService = new GetUsers(query);
    let { users } = await getUsersService.execute({ body, query });
    return users.map((user: UserMDB) => {
      return {
        _id: user._id,
        name: user.name,
        oRTBId: user.oRTBId,
        oRTBType: user.oRTBType,
        role: user.role
      };
    });
  };
}

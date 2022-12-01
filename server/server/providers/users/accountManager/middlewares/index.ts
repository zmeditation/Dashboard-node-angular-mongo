import CheckAMExistBindAMToPubMiddleware from '../../../../http/middlewares/users/accountManager/checkAMExistBindAMToPubMiddleware';
import CheckPubExistBindAMToPubMiddleware from '../../../../http/middlewares/users/accountManager/checkPubExistBindAMToPubMiddleware';
import CheckCurrentAMExistBindToPubMiddleware from '../../../../http/middlewares/users/accountManager/checkCurrentAMExistBindToPubMiddleware';

const checkAMExistBindAMToPubMiddleware = new CheckAMExistBindAMToPubMiddleware();
const checkPubExistBindAMToPubMiddleware = new CheckPubExistBindAMToPubMiddleware();
const checkCurrentAMExistBindToPubMiddleware = new CheckCurrentAMExistBindToPubMiddleware();

export {
  checkAMExistBindAMToPubMiddleware,
  checkPubExistBindAMToPubMiddleware,
  checkCurrentAMExistBindToPubMiddleware
}

import VersionController from '../../http/controllers/versionController';
import { versionService } from './services';

const versionController = new VersionController(versionService);

export {
  versionController
};


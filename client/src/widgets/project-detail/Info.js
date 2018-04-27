import { options } from 'sham-ui';
import InfoTemplate from './Info.sht';

export default class Info extends InfoTemplate {
    @options get project() { return {}; }

    _routerParams( project ) {
        return {
            id: project === undefined ? null : project.id
        }
    }
}
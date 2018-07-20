import { options, inject } from 'sham-ui';
import LoadProjectMixin from '../../../../mixins/load-project';
import ChainCreatePageTemplate from './page.sht';

export default class ChainCreatePage extends LoadProjectMixin( ChainCreatePageTemplate ) {
    @inject store = 'store';
    @inject router = 'router';

    @options get errors() {
        return [];
    }
    @options get dataSaving() {
        return false;
    }

    createProjectChain( formData ) {
        this.update( {
            dataSaving: true,
            errors: []
        } );
        const data = {
            ...formData,
            projectId: this.options.project.id
        };
        this.store.createProjectChain( data ).then(
            ::this._createProjectChainSuccess,
            ::this._createProjectChainFail
        );
    }

    _createProjectChainSuccess() {
        this.router.navigate(
            this.router.generate(
                'project-detail',
                { id: this.options.project.id }
            )
        );
    }

    _createProjectChainFail() {
        this.update( {
            errors: [ 'Create project fail!' ],
            dataSaving: false
        } );
    }
}

import ProjectCreateForm from '../../../src/widgets/ProjectCreateForm.js';
import disabled from '../../../src/directives/disabled';
import directives from '../../../src/directives/event-listener';
import renderer from 'sham-ui-test-helpers';

it( 'renders correctly', () => {
    const meta = renderer( ProjectCreateForm, {
        directives: {
            disabled,
            ...directives
        }
    } );
    expect( meta.toJSON() ).toMatchSnapshot();
} );

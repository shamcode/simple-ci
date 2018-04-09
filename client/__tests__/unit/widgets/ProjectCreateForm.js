import ProjectCreateForm from '../../../src/widgets/ProjectCreateForm.js';
import disabled from '../../../src/directives/disabled';
import renderer from 'sham-ui-test-helpers';

it( 'renders correctly', () => {
    const meta = renderer( ProjectCreateForm, {
        directives: {
            disabled
        }
    } );
    expect( meta.toJSON() ).toMatchSnapshot();
} );

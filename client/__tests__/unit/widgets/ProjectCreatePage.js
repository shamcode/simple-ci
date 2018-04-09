import ProjectCreatePage from '../../../src/widgets/ProjectCreatePage.js';
import disabled from '../../../src/directives/disabled';
import renderer from 'sham-ui-test-helpers';

it( 'renders correctly', () => {
    const meta = renderer( ProjectCreatePage, {
        directives: {
            disabled
        }
    } );
    expect( meta.toJSON() ).toMatchSnapshot();
} );

import ProjectCreatePage from '../../../src/widgets/ProjectCreatePage.sht';
import renderer from 'sham-ui-test-helpers';

it( 'renders correctly', () => {
    const meta = renderer( ProjectCreatePage, {} );
    expect( meta.toJSON() ).toMatchSnapshot();
} );

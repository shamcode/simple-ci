import ProjectsPage from '../../../src/widgets/ProjectsPage.sht';
import renderer from 'sham-ui-test-helpers';

it( 'renders correctly', () => {
    const meta = renderer( ProjectsPage, {} );
    expect( meta.toJSON() ).toMatchSnapshot();
} );

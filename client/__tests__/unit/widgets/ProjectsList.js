import ProjectsList from '../../../src/widgets/ProjectsList.sht';
import renderer from 'sham-ui-test-helpers';

it( 'renders correctly', () => {
    const meta = renderer( ProjectsList, {} );
    expect( meta.toJSON() ).toMatchSnapshot();
} );

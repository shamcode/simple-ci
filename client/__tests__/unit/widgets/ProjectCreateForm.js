import ProjectCreateForm from '../../../src/widgets/ProjectCreateForm.sht';
import renderer from 'sham-ui-test-helpers';

it( 'renders correctly', () => {
    const meta = renderer( ProjectCreateForm, {} );
    expect( meta.toJSON() ).toMatchSnapshot();
} );

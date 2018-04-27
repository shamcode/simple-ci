import Page from '../../../../src/widgets/project-edit/page';
import renderer from 'sham-ui-test-helpers';

it( 'renders correctly', () => {
    const meta = renderer( Page, {} );
    expect( meta.toJSON() ).toMatchSnapshot();
} );

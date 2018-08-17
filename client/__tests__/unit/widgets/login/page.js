import Page from '../../../../src/widgets/login/page';
import renderer from 'sham-ui-test-helpers';
import directives from 'sham-ui-directives';

it( 'renders correctly', () => {
    const meta = renderer( Page, {
        directives
    } );
    expect( meta.toJSON() ).toMatchSnapshot();
} );

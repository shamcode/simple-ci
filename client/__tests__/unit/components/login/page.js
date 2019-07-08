import Page from '../../../../src/components/login/page';
import renderer from 'sham-ui-test-helpers';
import * as directives from 'sham-ui-directives';

it( 'renders correctly', () => {
    const meta = renderer( Page, {
        directives
    } );
    expect( meta.toJSON() ).toMatchSnapshot();
} );

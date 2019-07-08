import CodeFlask from '../../../src/components/CodeFlask.sfc';
import renderer from 'sham-ui-test-helpers';
import * as directives from 'sham-ui-directives';

it( 'renders correctly', () => {
    const meta = renderer( CodeFlask, {
        directives
    } );
    expect( meta.toJSON() ).toMatchSnapshot();
} );

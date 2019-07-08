import Info from '../../../../../../src/components/project-detail/chains/detail/Info';
import * as directives from 'sham-ui-directives';
import renderer from 'sham-ui-test-helpers';

it( 'renders correctly', () => {
    const meta = renderer( Info, {
        directives,
        chain: {
            name: 'ls',
            command: 'ls -la'
        }
    } );
    expect( meta.toJSON() ).toMatchSnapshot();
} );

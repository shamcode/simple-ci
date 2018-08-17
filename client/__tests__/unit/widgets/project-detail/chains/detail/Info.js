import Info from '../../../../../../src/widgets/project-detail/chains/detail/Info';
import directives from 'sham-ui-directives';
import renderer from 'sham-ui-test-helpers';

it( 'renders correctly', () => {
    const meta = renderer( Info, {
        directives
    } );
    expect( meta.toJSON() ).toMatchSnapshot();
} );

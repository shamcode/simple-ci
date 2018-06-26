import Info from '../../../../../../src/widgets/project-detail/chains/detail/Info';
import directives from '../../../../../../src/directives/event-listener';
import disabled from '../../../../../../src/directives/disabled';
import renderer from 'sham-ui-test-helpers';

it( 'renders correctly', () => {
    const meta = renderer( Info, {
        directives: {
            disabled,
            ...directives
        }
    } );
    expect( meta.toJSON() ).toMatchSnapshot();
} );

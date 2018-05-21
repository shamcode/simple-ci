import Page from '../../../../src/widgets/registry/page';
import renderer from 'sham-ui-test-helpers';
import disabled from '../../../../src/directives/disabled';
import directives from '../../../../src/directives/event-listener';

it( 'renders correctly', () => {
    const meta = renderer( Page, {
        directives: {
            disabled,
            ...directives
        }
    } );
    expect( meta.toJSON() ).toMatchSnapshot();
} );

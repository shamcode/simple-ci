import Chain from '../../../../src/widgets/project-detail/Chain';
import directives from '../../../../src/directives/event-listener';
import renderer from 'sham-ui-test-helpers';

it( 'renders correctly', () => {
    const meta = renderer( Chain, {
        directives
    } );
    expect( meta.toJSON() ).toMatchSnapshot();
} );

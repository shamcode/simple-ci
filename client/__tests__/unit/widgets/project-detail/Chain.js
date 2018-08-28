import Chain from '../../../../src/widgets/project-detail/Chain';
import * as directives from 'sham-ui-directives';
import renderer from 'sham-ui-test-helpers';

it( 'renders correctly', () => {
    const meta = renderer( Chain, {
        directives
    } );
    expect( meta.toJSON() ).toMatchSnapshot();
} );

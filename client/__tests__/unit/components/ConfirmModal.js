import ConfirmModal from '../../../src/components/ConfirmModal.sfc';
import * as directives from 'sham-ui-directives';
import renderer from 'sham-ui-test-helpers';

it( 'renders correctly', () => {
    const meta = renderer( ConfirmModal, {
        title: 'Title text',
        body: 'Body text'
    }, {
        directives
    } );
    expect( meta.toJSON() ).toMatchSnapshot();
} );

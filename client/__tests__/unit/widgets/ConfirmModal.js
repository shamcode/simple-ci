import ConfirmModal from '../../../src/widgets/ConfirmModal';
import * as directives from 'sham-ui-directives';
import renderer from 'sham-ui-test-helpers';

it( 'renders correctly', () => {
    const meta = renderer( ConfirmModal, {
        directives,
        title: 'Title text',
        body: 'Body text'
    } );
    expect( meta.toJSON() ).toMatchSnapshot();
} );

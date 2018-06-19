import ConfirmModal from '../../../src/widgets/ConfirmModal';
import disabled from '../../../src/directives/disabled';
import directives from '../../../src/directives/event-listener';
import renderer from 'sham-ui-test-helpers';

it( 'renders correctly', () => {
    const meta = renderer( ConfirmModal, {
        directives: {
            disabled,
            ...directives
        },
        title: 'Title text',
        body: 'Body text'
    } );
    expect( meta.toJSON() ).toMatchSnapshot();
} );

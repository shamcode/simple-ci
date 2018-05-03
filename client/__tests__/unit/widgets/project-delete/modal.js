import Modal from '../../../../src/widgets/project-delete/modal';
import disabled from '../../../../src/directives/disabled';
import directives from '../../../../src/directives/event-listener';
import renderer from 'sham-ui-test-helpers';

it( 'renders correctly', () => {
    const meta = renderer( Modal, {
        directives: {
            disabled,
            ...directives
        },
        project: {
            id: '1',
            name: 'Test'
        }
    } );
    expect( meta.toJSON() ).toMatchSnapshot();
} );

import { DI } from 'sham-ui';
import Info from '../../../../src/widgets/project-detail/Info';
import directives from '../../../../src/directives/event-listener';
import renderer from 'sham-ui-test-helpers';

afterEach( () => {
    DI.bind( 'store', null );
    DI.bind( 'router', null );
} );

it( 'renders correctly', () => {
    DI.bind( 'router', {
        generate: jest.fn().mockReturnValueOnce( '/' )
    } );
    const meta = renderer( Info, {
        directives
    } );
    expect( meta.toJSON() ).toMatchSnapshot();
} );

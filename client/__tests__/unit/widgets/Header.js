import { DI } from 'sham-ui';
import Header from '../../../src/widgets/Header.sht';
import renderer from 'sham-ui-test-helpers';

afterEach( () => {
    DI.bind( 'router', null );
} );

it( 'renders correctly', () => {
    DI.bind( 'router', {
        generate: jest.fn().mockReturnValueOnce( '/' )
    } );

    const meta = renderer( Header, {} );
    expect( meta.toJSON() ).toMatchSnapshot();
} );

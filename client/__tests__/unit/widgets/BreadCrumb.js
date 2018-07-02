import { DI } from 'sham-ui';
import BreadCrumb from '../../../src/widgets/BreadCrumb';
import renderer from 'sham-ui-test-helpers';

afterEach( () => {
    DI.bind( 'router', null );
} );

it( 'renders correctly', () => {
    DI.bind( 'router', {
        generate: jest.fn().mockReturnValueOnce( '/' )
    } );

    const meta = renderer( BreadCrumb, {} );
    expect( meta.toJSON() ).toMatchSnapshot();
} );

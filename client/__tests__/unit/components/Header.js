import { DI } from 'sham-ui';
import Header from '../../../src/components/Header.sht';
import hrefto from 'sham-ui-router/href-to';
import renderer from 'sham-ui-test-helpers';

afterEach( () => {
    DI.bind( 'router', null );
} );

it( 'renders correctly', () => {
    DI.bind( 'router', {
        generate: jest.fn().mockReturnValueOnce( '/' )
    } );

    const meta = renderer( Header, {
        directives: {
            hrefto
        }
    } );
    expect( meta.toJSON() ).toMatchSnapshot();
} );

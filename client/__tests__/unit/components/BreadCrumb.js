import { DI } from 'sham-ui';
import hrefto from 'sham-ui-router/href-to';
import BreadCrumb from '../../../src/components/BreadCrumb.sfc';
import renderer from 'sham-ui-test-helpers';

afterEach( () => {
    DI.bind( 'router', null );
} );

it( 'renders correctly', () => {
    DI.bind( 'router', {
        generate: jest.fn().mockReturnValueOnce( '/' )
    } );

    const meta = renderer( BreadCrumb, {
        directives: {
            hrefto
        }
    } );
    expect( meta.toJSON() ).toMatchSnapshot();
} );

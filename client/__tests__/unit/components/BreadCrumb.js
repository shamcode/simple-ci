import { createDI } from 'sham-ui';
import hrefto from 'sham-ui-router/lib/href-to';
import BreadCrumb from '../../../src/components/BreadCrumb.sfc';
import renderer from 'sham-ui-test-helpers';

it( 'renders correctly', () => {
    const DI = createDI();
    DI.bind( 'router', {
        generate: jest.fn().mockReturnValue( '/' )
    } );

    const meta = renderer( BreadCrumb, {
        DI,
        directives: {
            hrefto
        }
    } );
    expect( meta.toJSON() ).toMatchSnapshot();
} );

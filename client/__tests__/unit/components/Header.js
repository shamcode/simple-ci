import { createDI } from 'sham-ui';
import Header from '../../../src/components/Header.sht';
import hrefto from 'sham-ui-router/lib/href-to';
import renderer from 'sham-ui-test-helpers';

it( 'renders correctly', () => {
    const DI = createDI();
    DI.bind( 'router', {
        generate: jest.fn().mockReturnValue( '/' )
    } );

    const meta = renderer( Header, {}, {
        DI,
        directives: {
            hrefto
        }
    } );
    expect( meta.toJSON() ).toMatchSnapshot();
} );

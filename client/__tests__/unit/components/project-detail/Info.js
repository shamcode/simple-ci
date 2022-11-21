import { createDI } from 'sham-ui';
import Info from '../../../../src/components/project-detail/Info';
import * as directives from 'sham-ui-directives';
import hrefto from 'sham-ui-router/lib/href-to';
import renderer from 'sham-ui-test-helpers';

it( 'renders correctly', () => {
    const DI = createDI();
    DI.bind( 'store', {
        getProjectById: jest.fn().mockReturnValue(
            Promise.resolve( {
                project: { id: 1, chains: [] }
            } )
        )
    } );
    DI.bind( 'router', {
        storage: { params: { id: 1 } },
        generate: jest.fn().mockReturnValue( '/' )
    } );

    const meta = renderer( Info, {}, {
        DI,
        directives: {
            ...directives,
            hrefto
        }
    } );
    expect( meta.toJSON() ).toMatchSnapshot();
} );

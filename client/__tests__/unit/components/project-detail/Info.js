import { DI } from 'sham-ui';
import Info from '../../../../src/components/project-detail/Info';
import * as directives from 'sham-ui-directives';
import hrefto from 'sham-ui-router/href-to';
import renderer from 'sham-ui-test-helpers';

afterEach( () => {
    DI.bind( 'store', null );
    DI.bind( 'router', null );
} );

it( 'renders correctly', () => {
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

    const meta = renderer( Info, {
        directives: {
            ...directives,
            hrefto
        }
    } );
    expect( meta.toJSON() ).toMatchSnapshot();
} );

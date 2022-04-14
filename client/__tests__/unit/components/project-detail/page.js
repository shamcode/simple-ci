import { createDI } from 'sham-ui';
import Page from '../../../../src/components/project-detail/page.sfc';
import * as directives from 'sham-ui-directives';
import hrefto from 'sham-ui-router/lib/href-to';
import renderer from 'sham-ui-test-helpers';

it( 'renders correctly', () => {
    const DI = createDI();
    const storeMock = jest.fn().mockReturnValue(
        Promise.resolve( {
            project: {
                id: 1,
                name: '',
                chains: []
            }
        } )
    );
    DI.bind( 'store', {
        getProjectById: storeMock
    } );
    DI.bind( 'router', {
        storage: { params: { id: 1 } },
        generate: jest.fn().mockReturnValue( '/' )
    } );

    const meta = renderer( Page, {
        DI,
        directives: {
            ...directives,
            hrefto
        }
    } );
    expect( storeMock.mock.calls[ 0 ][ 0 ] ).toBe( 1 );
    expect( meta.toJSON() ).toMatchSnapshot();
} );

it( 'render errors', () => {
    const DI = createDI();
    const storeMock = jest.fn().mockReturnValue( Promise.reject() );
    DI.bind( 'store', {
        getProjectById: storeMock
    } );
    DI.bind( 'router', {
        storage: { params: {} },
        generate: jest.fn().mockReturnValue( '/' )
    } );

    const meta = renderer( Page, {
        DI,
        directives: {
            ...directives,
            hrefto
        }
    } );
    expect( meta.toJSON() ).toMatchSnapshot();
} );


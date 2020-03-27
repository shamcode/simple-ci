import { DI } from 'sham-ui';
import Page from '../../../../src/components/project-detail/page';
import * as directives from 'sham-ui-directives';
import hrefto from 'sham-ui-router/href-to';
import renderer from 'sham-ui-test-helpers';

afterEach( () => {
    DI.bind( 'store', null );
    DI.bind( 'router', null );
} );

it( 'renders correctly', () => {
    const storeMock = jest.fn().mockReturnValue( Promise.resolve( { project: { id: 1 } } ) );
    DI.bind( 'store', {
        getProjectById: storeMock
    } );
    DI.bind( 'router', {
        storage: { params: { id: 1 } },
        generate: jest.fn().mockReturnValueOnce( '/' )
    } );

    const meta = renderer( Page, {
        directives: {
            ...directives,
            hrefto
        }
    } );
    expect( storeMock.mock.calls[ 0 ][ 0 ] ).toBe( 1 );
    expect( meta.toJSON() ).toMatchSnapshot();
} );

it( 'render errors', () => {
    const storeMock = jest.fn().mockReturnValue( Promise.reject() );
    DI.bind( 'store', {
        getProjectById: storeMock
    } );
    DI.bind( 'router', {
        storage: { params: {} },
        generate: jest.fn().mockReturnValueOnce( '/' )
    } );

    const meta = renderer( Page, {
        directives: {
            ...directives,
            hrefto
        }
    } );
    expect( meta.toJSON() ).toMatchSnapshot();
} );


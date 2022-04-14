import { createDI } from 'sham-ui';
import Page from '../../../../src/components/project-edit/page.sfc';
import * as directives from 'sham-ui-directives';
import hrefto from 'sham-ui-router/lib/href-to';
import renderer from 'sham-ui-test-helpers';

const flushPromises = () => new Promise( resolve => setImmediate( resolve ) );

afterEach( () => {
    jest.resetModules();
    jest.clearAllMocks();
} );

it( 'renders correctly', async() => {
    expect.assertions( 5 );

    const DI = createDI();
    const storeMock = jest.fn().mockReturnValue( Promise.resolve( {
        project: {
            id: 1,
            name: 'Test',
            cwd: '/tmp/'
        }
    } ) );
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
    const { component: { container } } = meta;
    expect( storeMock.mock.calls[ 0 ][ 0 ] ).toBe( 1 );
    expect( meta.toJSON() ).toMatchSnapshot();

    await flushPromises();
    expect( container.querySelector( '[name="name"]' ).value ).toBe( 'Test' );
    expect( container.querySelector( '[name="cwd"]' ).value ).toBe( '/tmp/' );
    expect( meta.toJSON() ).toMatchSnapshot();
    await flushPromises();
} );

it( 'update fail', async() => {
    expect.assertions( 2 );

    const DI = createDI();
    const updateProjectMock = jest.fn();
    DI.bind( 'store', {
        getProjectById: jest.fn().mockReturnValue( Promise.resolve( {
            project: {
                id: 1,
                name: 'Test',
                cwd: '/tmp/'
            }
        } ) ),
        updateProject: updateProjectMock
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
    const { component: { container } } = meta;
    await flushPromises();


    updateProjectMock.mockReturnValueOnce( Promise.reject() );
    container.querySelector( '[type="submit"]' ).click();
    expect( updateProjectMock.mock.calls ).toHaveLength( 1 );

    await flushPromises();
    expect( meta.toJSON() ).toMatchSnapshot();
} );

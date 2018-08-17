import { DI } from 'sham-ui';
import Page from '../../../../../../src/widgets/project-detail/chains/create/page';
import directives from 'sham-ui-directives';
import renderer from 'sham-ui-test-helpers';

const flushPromises = () => new Promise( resolve => setImmediate( resolve ) );

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
        lastRouteResolved: jest.fn().mockReturnValueOnce( { params: { id: 1 } } ),
        generate: jest.fn().mockReturnValueOnce( '/' )
    } );

    const meta = renderer( Page, {
        directives
    } );
    expect( storeMock.mock.calls[ 0 ][ 0 ] ).toBe( 1 );
    expect( meta.toJSON() ).toMatchSnapshot();
} );


it( 'create fail', async() => {
    expect.assertions( 2 );

    const createProjectChain = jest.fn();
    DI.bind( 'store', {
        getProjectById: jest.fn().mockReturnValue( Promise.resolve( {
            project: {
                id: 1,
                name: 'Test',
                cwd: '/tmp/'
            }
        } ) ),
        createProjectChain: createProjectChain
    } );
    DI.bind( 'router', {
        lastRouteResolved: jest.fn().mockReturnValueOnce( { params: { id: 1 } } ),
        generate: jest.fn().mockReturnValueOnce( '/' )
    } );

    const meta = renderer( Page, {
        directives
    } );
    const { widget: { container } } = meta;
    await flushPromises();

    const formData = {
        name: 'Test name'
    };
    container.querySelector( '[name="name"]' ).value = formData.name;

    createProjectChain.mockReturnValueOnce( Promise.reject() );
    container.querySelector( '[type="submit"]' ).click();
    expect( createProjectChain.mock.calls ).toHaveLength( 1 );

    await flushPromises();
    expect( meta.toJSON() ).toMatchSnapshot();
} );

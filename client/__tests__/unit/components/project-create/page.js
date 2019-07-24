import { DI } from 'sham-ui';
import ProjectCreatePage from '../../../../src/components/project-create/page.sfc';
import * as directives from 'sham-ui-directives';
import hrefto from 'sham-ui-router/href-to';
import renderer from 'sham-ui-test-helpers';

const flushPromises = () => new Promise( resolve => setImmediate( resolve ) );

afterEach( () => {
    DI.bind( 'router', null );
    jest.resetModules();
    jest.clearAllMocks();
} );

it( 'renders correctly', () => {
    DI.bind( 'router', {
        generate: jest.fn().mockReturnValueOnce( '/' )
    } );

    const meta = renderer( ProjectCreatePage, {
        directives: {
            ...directives,
            hrefto
        }
    } );
    expect( meta.toJSON() ).toMatchSnapshot();
} );

it( 'create', () => {
    DI.bind( 'router', {
        generate: jest.fn().mockReturnValueOnce( '/' ),
        navigate: jest.fn()
    } );
    const createProjectMock = jest.fn();
    DI.bind( 'store', {
        createProject: createProjectMock.mockReturnValueOnce( Promise.resolve() )
    } );

    const { component: { container } } = renderer( ProjectCreatePage, {
        directives: {
            ...directives,
            hrefto
        }
    } );
    const formData = {
        name: 'Test name',
        cwd: 'test cwd'
    };
    container.querySelector( '[name="name"]' ).value = formData.name;
    container.querySelector( '[name="cwd"]' ).value = formData.cwd;
    container.querySelector( '[type="submit"]' ).click();

    expect( createProjectMock.mock.calls ).toHaveLength( 1 );
    expect( createProjectMock.mock.calls[ 0 ] ).toHaveLength( 1 );

    const data = createProjectMock.mock.calls[ 0 ][ 0 ];
    expect( Object.keys( data ) ).toEqual( [ 'name', 'cwd' ] );
    expect( data.name ).toBe( formData.name );
    expect( data.cwd ).toBe( formData.cwd );
} );

it( 'create fail', async() => {
    expect.assertions( 3 );

    DI.bind( 'router', {
        generate: jest.fn().mockReturnValueOnce( '/' ),
        navigate: jest.fn()
    } );
    const createProjectMock = jest.fn();
    DI.bind( 'store', {
        createProject: createProjectMock.mockReturnValueOnce( Promise.reject() )
    } );

    const meta = renderer( ProjectCreatePage, {
        directives: {
            ...directives,
            hrefto
        }
    } );
    const formData = {
        name: 'Test name',
        cwd: 'test cwd'
    };
    const { component: { container } } = meta;
    container.querySelector( '[name="name"]' ).value = formData.name;
    container.querySelector( '[name="cwd"]' ).value = formData.cwd;
    container.querySelector( '[type="submit"]' ).click();

    await flushPromises();

    expect( createProjectMock.mock.calls ).toHaveLength( 1 );
    expect( createProjectMock.mock.calls[ 0 ] ).toHaveLength( 1 );
    expect( meta.toJSON() ).toMatchSnapshot();
} );
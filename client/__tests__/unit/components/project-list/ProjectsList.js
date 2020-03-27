import { DI } from 'sham-ui';
import ProjectsList from '../../../../src/components/project-list/ProjectsList.sht';
import * as directives from 'sham-ui-directives';
import hrefto from 'sham-ui-router/href-to';
import renderer from 'sham-ui-test-helpers';

afterEach( () => {
    DI.bind( 'router', null );
} );

it( 'renders correctly', () => {
    const generateMock = jest.fn().mockReturnValueOnce( '/' );
    DI.bind( 'router', {
        generate: generateMock
    } );

    const meta = renderer( ProjectsList, {
        directives: {
            ...directives,
            hrefto
        }
    } );
    expect( generateMock.mock.calls ).toHaveLength( 1 );
    expect( generateMock.mock.calls[ 0 ][ 0 ] ).toEqual( 'project-create' );
    expect( Object.keys( generateMock.mock.calls[ 0 ][ 1 ] ) ).toHaveLength( 0 );
    expect( meta.toJSON() ).toMatchSnapshot();
} );

it( 'go to create page', () => {
    const navigateMock = jest.fn();
    DI.bind( 'router', {
        generate: jest.fn().mockReturnValueOnce( '/' ),
        navigate: navigateMock
    } );

    const meta = renderer( ProjectsList, {
        directives: {
            ...directives,
            hrefto
        }
    } );
    meta.component.container.querySelector( '.project-card-create' ).click();

    expect( navigateMock.mock.calls ).toHaveLength( 1 );
    expect( meta.toJSON() ).toMatchSnapshot();
} );

it( 'renders list', () => {
    DI.bind( 'router', {
        generate: jest.fn().mockReturnValueOnce( '/' )
    } );

    const meta = renderer( ProjectsList, {
        directives: {
            ...directives,
            hrefto
        },
        projects: [
            { id: 1, name: 'Simple CI', cwd: '/tmp/' },
            { id: 1, name: 'ShamUI', cwd: '/home/' }
        ]
    } );
    expect( meta.toJSON() ).toMatchSnapshot();
} );

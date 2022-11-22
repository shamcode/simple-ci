import { createDI } from 'sham-ui';
import ProjectsList from '../../../../src/components/project-list/ProjectsList.sht';
import * as directives from 'sham-ui-directives';
import hrefto from 'sham-ui-router/lib/href-to';
import renderer from 'sham-ui-test-helpers';

it( 'renders correctly', () => {
    const DI = createDI();
    const generateMock = jest.fn().mockReturnValue( '/' );
    DI.bind( 'router', {
        generate: generateMock
    } );

    const meta = renderer( ProjectsList, {}, {
        DI,
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
    const DI = createDI();
    const navigateMock = jest.fn();
    DI.bind( 'router', {
        generate: jest.fn().mockReturnValue( '/' ),
        navigate: navigateMock
    } );

    const meta = renderer( ProjectsList, {}, {
        DI,
        directives: {
            ...directives,
            hrefto
        }
    } );
    meta.ctx.container.querySelector( '.project-card-create' ).click();

    expect( navigateMock.mock.calls ).toHaveLength( 1 );
    expect( meta.toJSON() ).toMatchSnapshot();
} );

it( 'renders list', () => {
    const DI = createDI();
    DI.bind( 'router', {
        generate: jest.fn().mockReturnValue( '/' )
    } );

    const meta = renderer( ProjectsList, {
        projects: [
            { id: 1, name: 'Simple CI', cwd: '/tmp/' },
            { id: 1, name: 'ShamUI', cwd: '/home/' }
        ]
    }, {
        DI,
        directives: {
            ...directives,
            hrefto
        }
    } );
    expect( meta.toJSON() ).toMatchSnapshot();
} );

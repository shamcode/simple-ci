import { createDI } from 'sham-ui';
import ProjectsPage from '../../../../src/components/project-list/page.sfc';
import * as directives from 'sham-ui-directives';
import hrefto from 'sham-ui-router/lib/href-to';
import renderer from 'sham-ui-test-helpers';

it( 'renders correctly', () => {
    const DI = createDI();
    const storeMock = jest.fn().mockReturnValue( Promise.resolve( { projects: [] } ) );
    DI.bind( 'store', {
        getProjects: storeMock
    } );
    DI.bind( 'router', {
        generate: jest.fn().mockReturnValue( '/' )
    } );

    const meta = renderer( ProjectsPage, {}, {
        DI,
        directives: {
            ...directives,
            hrefto
        }
    } );
    expect( storeMock.mock.calls ).toHaveLength( 1 );
    expect( meta.toJSON() ).toMatchSnapshot();
} );

it( 'render errors', () => {
    const DI = createDI();
    const storeMock = jest.fn().mockReturnValue( Promise.reject() );
    DI.bind( 'store', {
        getProjects: storeMock
    } );
    DI.bind( 'router', {
        generate: jest.fn().mockReturnValue( '/' )
    } );

    const meta = renderer( ProjectsPage, {}, {
        DI,
        directives: {
            ...directives,
            hrefto
        }
    } );
    expect( meta.toJSON() ).toMatchSnapshot();
} );

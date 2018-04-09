import ProjectsPage from '../../../src/widgets/ProjectsPage.js';
import renderer from 'sham-ui-test-helpers';


afterEach( () => {
    DI.bind( 'store', null );
} );

it( 'renders correctly', () => {
    const storeMock = jest.fn().mockReturnValue( Promise.resolve( { projects: [] } ) );
    DI.bind( 'store', {
        getProjects: storeMock
    } );

    const meta = renderer( ProjectsPage, {} );
    expect( storeMock.mock.calls.length ).toBe( 1 );
    expect( meta.toJSON() ).toMatchSnapshot();
} );

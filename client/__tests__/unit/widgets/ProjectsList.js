import ProjectsList from '../../../src/widgets/ProjectsList.js';
import renderer from 'sham-ui-test-helpers';

afterEach( () => {
    DI.bind( 'router', null );
} );

it( 'renders correctly', () => {
    DI.bind( 'router', {
        generate: jest.fn().mockReturnValueOnce( '/' )
    } );

    const meta = renderer( ProjectsList, {} );
    expect( meta.toJSON() ).toMatchSnapshot();
} );

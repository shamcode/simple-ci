import { DI } from 'sham-ui';
import ProjectCreatePage from '../../../src/widgets/ProjectCreatePage';
import disabled from '../../../src/directives/disabled';
import renderer from 'sham-ui-test-helpers';

afterEach( () => {
    DI.bind( 'router', null );
} );

it( 'renders correctly', () => {
    DI.bind( 'router', {
        generate: jest.fn().mockReturnValueOnce( '/' )
    } );

    const meta = renderer( ProjectCreatePage, {
        directives: {
            disabled
        }
    } );
    expect( meta.toJSON() ).toMatchSnapshot();
} );

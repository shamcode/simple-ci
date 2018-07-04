import CodeFlask from '../../../src/widgets/CodeFlask';
import renderer from 'sham-ui-test-helpers';

it( 'renders correctly', () => {
    const meta = renderer( CodeFlask, {} );
    expect( meta.toJSON() ).toMatchSnapshot();
} );

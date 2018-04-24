import Info from '../../../../src/widgets/project-detail/Info.sht';
import renderer from 'sham-ui-test-helpers';

it( 'renders correctly', () => {
    const meta = renderer( Info, {} );
    expect( meta.toJSON() ).toMatchSnapshot();
} );

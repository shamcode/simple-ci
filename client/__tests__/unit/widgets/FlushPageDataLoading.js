import FlushPageDataLoading from '../../../src/widgets/FlushPageDataLoading';
import renderer from 'sham-ui-test-helpers';

it( 'renders correctly', () => {
    const meta = renderer( FlushPageDataLoading, {} );
    expect( meta.toJSON() ).toMatchSnapshot();
} );


it( 'delay', () => {
    jest.useFakeTimers();
    const meta = renderer( FlushPageDataLoading, {});
    jest.runAllTimers();
    expect( meta.toJSON() ).toMatchSnapshot();
} );

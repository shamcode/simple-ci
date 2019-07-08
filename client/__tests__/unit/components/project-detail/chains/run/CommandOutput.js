// eslint-disable-next-line max-len
import CommandOutput from '../../../../../../src/components/project-detail/chains/run/CommandOutput.sht';
import renderer from 'sham-ui-test-helpers';

it( 'renders correctly', () => {
    const meta = renderer( CommandOutput, {} );
    expect( meta.toJSON() ).toMatchSnapshot();
} );

import renderer from 'sham-ui-test-helpers';
import ChainForm from '../../../../../src/components/project-detail/chains/ChainForm';
import * as directives from 'sham-ui-directives';

it( 'renders correctly', () => {
    const meta = renderer( ChainForm, {
        directives
    } );
    expect( meta.toJSON() ).toMatchSnapshot();
} );


it( 'submit form', () => {
    const onSubmitMock = jest.fn();
    const { ctx } = renderer( ChainForm, {
        saveButtonText: 'Create',
        onSubmit: onSubmitMock
    }, {
        directives
    } );

    const formData = {
        name: 'Test name',
        command: 'echo 1'
    };
    ctx.container.querySelector( '[name="name"]' ).value = formData.name;
    ctx.container.querySelector( '[name="command"]' ).value = formData.command;
    ctx.container.querySelector( '[type="submit"]' ).click();

    expect( onSubmitMock.mock.calls ).toHaveLength( 1 );
    expect( onSubmitMock.mock.calls[ 0 ] ).toHaveLength( 1 );
    const data = onSubmitMock.mock.calls[ 0 ][ 0 ];
    expect( Object.keys( data ) ).toEqual( [ 'name', 'command' ] );
    expect( data.name ).toBe( formData.name );
    expect( data.command ).toBe( formData.command );
} );

it( 'form validation (name)', () => {
    const onSubmitMock = jest.fn();
    const { ctx } = renderer( ChainForm, {
        saveButtonText: 'Create',
        onSubmit: onSubmitMock
    }, {
        directives
    } );

    ctx.container.querySelector( '[type="submit"]' ).click();
    expect( onSubmitMock.mock.calls ).toHaveLength( 0 );

    ctx.container.querySelector( '[type="submit"]' ).click();
    expect( onSubmitMock.mock.calls ).toHaveLength( 0 );
} );

const METHODS = [
    'get',
    'post',
    'put',
    'delete'
];

const FIXTURES = {};
const MOCKS = {};

function mockMethodFactory( method ) {
    return jest.fn().mockImplementation(
        ( url ) => {
            if ( !FIXTURES[ method ].hasOwnProperty( url ) ) {
                throw new Error( `Missing fixture for ${method.toUpperCase()} url = "${url}"` );
            }
            return Promise.resolve( {
                data: FIXTURES[ method ][ url ]
            } );
        }
    )
}

METHODS.forEach(
    method => {
        MOCKS[ method ] = mockMethodFactory( method );
        FIXTURES[ method ] = {};
    }
);

const defaultMocksData = ( () => {
    const data = {};
    data.chain = {
        id: 2,
        name: 'Test chain'
    };
    data.project = {
        id: 1,
        name: 'Test',
        cwd: '/tmp/',
        chains: [ data.chain ]
    };
    return data;
} )();

export default {
    defaultMocksData: defaultMocksData,
    mocks: MOCKS,
    create: jest.fn().mockImplementation( () => {
        return {
            ...MOCKS,
            interceptors: {
                request: {
                    use: () => {}
                },
                response: {
                    use: () => {}
                }
            }
        }
    } ),
    use( method, url, data ) {
        if ( !METHODS.includes( method ) ) {
            throw new Error( `Unknown method: "${method}"`);
        }
        FIXTURES[ method ][ url ] = data;
        return this;
    },
    useDefaultMocks() {
        this
            .use( 'get', '/projects', [ defaultMocksData.project ] )
            .use( 'get', '/projects/1', defaultMocksData.project )
            .use( 'get',  '/chains/2', defaultMocksData.chain );
        return this;
    }
};
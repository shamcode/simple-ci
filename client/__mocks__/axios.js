export default {
    get: jest.fn(),
    post: jest.fn(),
    create: jest.fn( function() {
        return this;
    } )
}
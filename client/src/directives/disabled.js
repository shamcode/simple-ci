export default class {
    constructor() {
        this.node = null;
    }

    bind( node ) {
        this.node = node;
    }

    unbind( node ) {
        this.node = null;
    }

    update( value ) {
        this.node.disabled = value;
    }
}
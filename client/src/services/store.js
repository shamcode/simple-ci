import axios from 'axios';
import { DI, inject } from 'sham-ui';

export default class Store {
    @inject session;

    constructor() {
        DI.bind( 'store', this );
        this.axios = axios.create( {
            baseURL: `${document.location.protocol}//localhost:3001/api/v1/`
        } );
        this.axios.interceptors.request.use(
            ::this._requestAuthInterceptor
        );
        this.axios.interceptors.response.use(
            ( response ) => response,
            ::this._responseFailAuthInterceptor
        );
    }

    _requestAuthInterceptor( request ) {
        if ( !this.session.isAuthenticated && (
            this._isGetTokenRequest( request ) || this._isRegistryRequest( request )
        ) ) {
            return request;
        }
        if ( !this.session.isAuthenticated ) {
            this.session.invalidateSession();
        } else {
            request.headers.Bearer = this.session.token;
            return request;
        }
    }

    _responseFailAuthInterceptor( error ) {
        if ( error.response && 401 === error.response.status ) {
            this.session.invalidateSession();
        }
        return Promise.reject( error );
    }

    getToken( username, password ) {
        return this.axios.post( '/login', { username, password } );
    }

    _isGetTokenRequest( request ) {
        return '/login' === request.url;
    }

    registry( username, password ) {
        return this.axios.post( '/registry', { username, password } );
    }

    _isRegistryRequest( request ) {
        return '/registry' === request.url;
    }

    getProjects() {
        return this.axios
            .get( '/projects' )
            .then( ( { data } ) => ( { projects: data } ) );
    }

    getProjectById( id ) {
        return this.axios
            .get( `/projects/${id}` )
            .then( ( { data } ) => ( { project: data } ) );
    }

    getProjectChainById( id ) {
        return this.axios
            .get( `/chains/${id}` )
            .then( ( { data } ) => ( { chain: data } ) );
    }

    createProject( data ) {
        return this.axios.post( '/projects', data );
    }

    updateProject( id, data ) {
        return this.axios.put( `/projects/${id}`, data );
    }

    deleteProject( id ) {
        return this.axios.delete( `/projects/${id}` );
    }

    deleteChain( id ) {
        return this.axios.delete( `/chains/${id}` );
    }

    createProjectChain( data ) {
        return this.axios.post( '/chains', data );
    }

    updateProjectChain( id, data ) {
        return this.axios.put( `/chains/${id}`, data );
    }

    runProjectChain( id ) {
        return this.axios.post( `/chains/${id}/run` );
    }
}

/**
 * Internal dependencies
 */
import { toHTMLString } from './to-html-string';

export class RichTextValue {
	constructor( args ) {
		for ( const key in args.value ) {
			Object.defineProperty( this, key, {
				value: args.value[ key ],
				enumerable: true,
			} );
		}

		function _toHTMLString( _args ) {
			if ( ! _toHTMLString.cached ) {
				_toHTMLString.cached = toHTMLString( _args );
			}
			return _toHTMLString.cached;
		}

		Object.getOwnPropertyNames( String.prototype )
			.filter(
				( prop ) =>
					typeof String.prototype[ prop ] === 'function' &&
					prop !== 'constructor'
			)
			.forEach( ( method ) => {
				Object.defineProperty( this, method, {
					value() {
						return _toHTMLString( args )[ method ]( ...arguments );
					},
				} );
			} );

		Object.defineProperty( this, 'length', {
			get() {
				return _toHTMLString( args ).length;
			},
		} );
	}
}

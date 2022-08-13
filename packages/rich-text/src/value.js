/**
 * Internal dependencies
 */
import { toHTMLString } from './to-html-string';

export class RichTextValue extends String {
	constructor( { value } ) {
		super( toHTMLString( ...arguments ) );

		for ( const key in value ) {
			Object.defineProperty( this, key, {
				value: value[ key ],
				enumerable: true,
			} );
		}
	}
}

/**
 * Internal dependencies
 */
import { toHTMLString } from './to-html-string';
export class RichTextString extends String {
	constructor( { value, ...settings } ) {
		super( toHTMLString( { value, ...settings } ) );
		for ( const key in value ) {
			Object.defineProperty( this, key, {
				value: value[ key ],
				enumerable: true,
			} );
		}

		for ( const key in settings ) {
			Object.defineProperty( this, key, {
				value: settings[ key ],
			} );
		}
	}
}

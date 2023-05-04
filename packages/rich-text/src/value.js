/**
 * Internal dependencies
 */
import { toHTMLString } from './to-html-string';

export function createRichTextString( args ) {
	const string = new String( toHTMLString( args ) );

	for ( const key in args ) {
		Object.defineProperty( string, key, {
			value: args[ key ],
		} );
	}

	return string;
}

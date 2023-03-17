/**
 * External dependencies
 */
import parser from 'css-tree/parser';

export function parseCSS( css, options ) {
	return parser( css, options );
}

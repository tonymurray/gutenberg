/**
 * External dependencies
 */
import generate from 'css-tree/generator';

export function generateCSS( ast ) {
	return generate( ast );
}

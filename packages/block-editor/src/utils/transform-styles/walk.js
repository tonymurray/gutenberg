/**
 * External dependencies
 */
import walk from 'css-tree/walker';

export function walkCSSTree( ast, callback ) {
	return walk( ast, callback );
}

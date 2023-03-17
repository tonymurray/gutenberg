/**
 * Internal dependencies
 */
import { generateCSS } from './generate';
import { parseCSS } from './parse';
import { walkCSSTree } from './walk';

/**
 * External dependencies
 *
 * @param css
 * @param callback
 */
function traverseCSS( css, callback ) {
	try {
		const ast = parseCSS( css );
		walkCSSTree( ast, callback );
		return generateCSS( ast );
	} catch ( err ) {
		// eslint-disable-next-line no-console
		console.warn( 'Error while traversing the CSS: ' + err );

		return null;
	}
}

export default traverseCSS;

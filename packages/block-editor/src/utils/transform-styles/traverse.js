/**
 * External dependencies
 */
import parser from 'css-tree/parser';
import walker from 'css-tree/walker';
import generator from 'css-tree/generator';

function traverseCSS( css, callback ) {
	try {
		const ast = parser.parse( css );
		walker.walk( ast, callback );
		return generator.generate( ast );
	} catch ( err ) {
		// eslint-disable-next-line no-console
		console.warn( 'Error while traversing the CSS: ' + err );

		return null;
	}
}

export default traverseCSS;

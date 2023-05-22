/**
 * WordPress dependencies
 */

import { chevronUp, chevronDown, moreVertical } from '@wordpress/icons';
import { DropdownMenu, MenuItem, MenuGroup } from '@wordpress/components';
import { useDispatch, useSelect } from '@wordpress/data';
import { __, sprintf } from '@wordpress/i18n';
import { BlockTitle, store as blockEditorStore } from '@wordpress/block-editor';
import { privateApis as routerPrivateApis } from '@wordpress/router';

/**
 * Internal dependencies
 */
import {
	isPreviewingTheme,
	currentlyPreviewingTheme,
} from '../../utils/is-previewing-theme';
import { unlock } from '../../private-apis';

const { useHistory } = unlock( routerPrivateApis );

const POPOVER_PROPS = {
	className: 'block-editor-block-settings-menu__popover',
	position: 'bottom right',
	variant: 'toolbar',
};

export default function LeafMoreMenu( props ) {
	const { block } = props;
	const { clientId } = block;
	const { moveBlocksDown, moveBlocksUp, removeBlocks } =
		useDispatch( blockEditorStore );
	const history = useHistory();

	const removeLabel = sprintf(
		/* translators: %s: block name */
		__( 'Remove %s' ),
		BlockTitle( { clientId, maximumLength: 25 } )
	);

	const navigateLabel = sprintf(
		/* translators: %s: block name */
		__( 'Navigate to %s' ),
		BlockTitle( { clientId, maximumLength: 25 } )
	);

	const rootClientId = useSelect(
		( select ) => {
			const { getBlockRootClientId } = select( blockEditorStore );

			return getBlockRootClientId( clientId );
		},
		[ clientId ]
	);

	const onNavigate = () => {
		const { attributes, name } = block;
		if (
			attributes.kind === 'post-type' &&
			attributes.id &&
			attributes.type &&
			history
		) {
			history.push( {
				postType: attributes.type,
				postId: attributes.id,
				...( isPreviewingTheme() && {
					theme_preview: currentlyPreviewingTheme(),
				} ),
			} );
		}
		if ( name === 'core/page-list-item' && attributes.id && history ) {
			history.push( {
				postType: 'page',
				postId: attributes.id,
				...( isPreviewingTheme() && {
					theme_preview: currentlyPreviewingTheme(),
				} ),
			} );
		}
	};

	return (
		<DropdownMenu
			icon={ moreVertical }
			label={ __( 'Options' ) }
			className="block-editor-block-settings-menu"
			popoverProps={ POPOVER_PROPS }
			noIcons
			{ ...props }
		>
			{ ( { onClose } ) => (
				<>
					<MenuGroup>
						<MenuItem
							icon={ chevronUp }
							onClick={ () => {
								moveBlocksUp( [ clientId ], rootClientId );
								onClose();
							} }
						>
							{ __( 'Move up' ) }
						</MenuItem>
						<MenuItem
							icon={ chevronDown }
							onClick={ () => {
								moveBlocksDown( [ clientId ], rootClientId );
								onClose();
							} }
						>
							{ __( 'Move down' ) }
						</MenuItem>
						{ block.attributes?.id && (
							<MenuItem
								onClick={ () => {
									onNavigate();
									onClose();
								} }
							>
								{ navigateLabel }
							</MenuItem>
						) }
					</MenuGroup>
					<MenuGroup>
						<MenuItem
							onClick={ () => {
								removeBlocks( [ clientId ], false );
								onClose();
							} }
						>
							{ removeLabel }
						</MenuItem>
					</MenuGroup>
				</>
			) }
		</DropdownMenu>
	);
}

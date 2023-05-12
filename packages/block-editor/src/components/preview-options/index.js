/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
import { useViewportMatch } from '@wordpress/compose';
import { DropdownMenu, MenuGroup, MenuItem } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { check, desktop, mobile, tablet } from '@wordpress/icons';
import { PluginPreview } from '@wordpress/interface';

export default function PreviewOptions( {
	children,
	viewLabel,
	className,
	isEnabled = true,
	deviceType,
	setDeviceType,
} ) {
	const isMobile = useViewportMatch( 'small', '<' );
	if ( isMobile ) return null;

	const popoverProps = {
		className: classnames(
			className,
			'block-editor-post-preview__dropdown-content'
		),
		position: 'bottom left',
	};
	const toggleProps = {
		variant: 'tertiary',
		className: 'block-editor-post-preview__button-toggle',
		disabled: ! isEnabled,
		children: viewLabel,
	};
	const menuProps = {
		'aria-label': __( 'View options' ),
	};

	const deviceIcons = {
		mobile,
		tablet,
		desktop,
	};

	const devices = [
		{ type: 'Desktop', label: __( 'Desktop' ) },
		{ type: 'Tablet', label: __( 'Tablet' ) },
		{ type: 'Mobile', label: __( 'Mobile' ) },
	];

	return (
		<DropdownMenu
			className="block-editor-post-preview__dropdown"
			popoverProps={ popoverProps }
			toggleProps={ toggleProps }
			menuProps={ menuProps }
			icon={ deviceIcons[ deviceType.toLowerCase() ] }
		>
			{ () => (
				<>
					<MenuGroup>
						{ devices.map( ( { type, label } ) => (
							<MenuItem
								key={ type }
								className="block-editor-post-preview__button-resize"
								onClick={ () => setDeviceType( type ) }
								icon={ deviceType === type && check }
							>
								{ label }
							</MenuItem>
						) ) }
					</MenuGroup>
					<PluginPreview.Slot
						devices={ devices }
						fillProps={ {
							deviceType,
							setDeviceType,
						} }
					/>
					{ children }
				</>
			) }
		</DropdownMenu>
	);
}

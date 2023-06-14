/**
 * WordPress dependencies
 */
import { useSelect, useDispatch } from '@wordpress/data';
import { useMemo, useState, useCallback } from '@wordpress/element';
import { decodeEntities } from '@wordpress/html-entities';
import { __experimentalBlockPatternsList as BlockPatternsList } from '@wordpress/block-editor';
import { Button, Modal } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import {
	useEntityRecords,
	useEntityRecord,
	store as coreStore,
} from '@wordpress/core-data';
import { store as noticesStore } from '@wordpress/notices';
import { parse } from '@wordpress/blocks';
import { useAsyncList } from '@wordpress/compose';

/**
 * Internal dependencies
 */
import { store as editSiteStore } from '../../../store';

export default function SwapTemplateButton() {
	const [ showSwapTemplateModal, setShowSwapTemplateModal ] =
		useState( false );
	const { records: templates } = useEntityRecords(
		'postType',
		'wp_template',
		{ per_page: -1 }
	);
	const currentTemplate = useSelect( ( select ) => {
		const { getEditedPostType, getEditedPostId } = select( editSiteStore );
		const { getEditedEntityRecord } = select( coreStore );
		return getEditedEntityRecord(
			'postType',
			getEditedPostType(),
			getEditedPostId()
		);
	}, [] );
	const customTemplates = useMemo( () => {
		return templates?.filter(
			( template ) =>
				template.is_custom &&
				! template.has_theme_file &&
				template.id !== currentTemplate.id &&
				!! template.content.raw // Skip empty templates.
		);
	}, [ templates, currentTemplate.id ] );
	const onClose = useCallback( () => setShowSwapTemplateModal( false ), [] );
	if ( ! customTemplates?.length ) {
		return null;
	}
	return (
		<>
			<Button
				className="edit-site-page-panels__swap-template-button"
				variant="secondary"
				onClick={ () => setShowSwapTemplateModal( true ) }
			>
				{ __( 'Swap template' ) }
			</Button>
			{ showSwapTemplateModal && (
				<Modal
					title={ __( 'Swap template' ) }
					onRequestClose={ onClose }
					isFullScreen
				>
					<div className="edit-site-start-template-options__modal-content">
						<TemplatesList
							templates={ customTemplates }
							currentTemplate={ currentTemplate }
							onSelect={ onClose }
						/>
					</div>
				</Modal>
			) }
		</>
	);
}

function TemplatesList( { templates, currentTemplate, onSelect } ) {
	const { postId, postType } = useSelect( ( select ) => {
		const _context = select( editSiteStore ).getEditedPostContext();
		return {
			postId: _context.postId,
			postType: _context.postType,
		};
	}, [] );
	const entitiy = useEntityRecord( 'postType', postType, postId );
	const { setEditedPost } = useDispatch( editSiteStore );
	const { createSuccessNotice } = useDispatch( noticesStore );
	const templatesAsPatterns = useMemo(
		() =>
			templates.map( ( template ) => ( {
				name: template.slug,
				blocks: parse( template.content.raw ),
				title: decodeEntities( template.title.rendered ),
				id: template.id,
			} ) ),
		[ templates ]
	);
	const shownTemplates = useAsyncList( templatesAsPatterns );
	const onClickPattern = async ( template ) => {
		entitiy.edit( { template: template.name }, { undoIgnore: true } );
		await entitiy.save();
		setEditedPost( {
			postType: 'wp_template',
			id: template.id,
			context: {
				postType,
				postId,
				templateSlug: template.name,
			},
		} );
		createSuccessNotice( __( 'Template swapped.' ), {
			type: 'snackbar',
			actions: [
				{
					label: __( 'Undo' ),
					async onClick() {
						entitiy.edit(
							{ template: currentTemplate.slug },
							{ undoIgnore: true }
						);
						await entitiy.save();
						setEditedPost( {
							postType: 'wp_template',
							id: currentTemplate.id,
							context: {
								postType,
								postId,
								templateSlug: currentTemplate.slug,
							},
						} );
					},
				},
			],
		} );
		onSelect();
	};
	return (
		<BlockPatternsList
			label={ __( 'Templates' ) }
			blockPatterns={ templatesAsPatterns }
			shownPatterns={ shownTemplates }
			onClickPattern={ onClickPattern }
			showTitlesAsTooltip
		/>
	);
}

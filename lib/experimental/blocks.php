<?php
/**
 * Temporary compatibility shims for block APIs present in Gutenberg.
 *
 * @package gutenberg
 */

if ( ! function_exists( 'wp_enqueue_block_view_script' ) ) {
	/**
	 * Enqueues a frontend script for a specific block.
	 *
	 * Scripts enqueued using this function will only get printed
	 * when the block gets rendered on the frontend.
	 *
	 * @since 6.2.0
	 *
	 * @param string $block_name The block name, including namespace.
	 * @param array  $args       An array of arguments [handle,src,deps,ver,media,textdomain].
	 *
	 * @return void
	 */
	function wp_enqueue_block_view_script( $block_name, $args ) {
		$args = wp_parse_args(
			$args,
			array(
				'handle'     => '',
				'src'        => '',
				'deps'       => array(),
				'ver'        => false,
				'in_footer'  => false,

				// Additional args to allow translations for the script's textdomain.
				'textdomain' => '',
			)
		);

		/**
		 * Callback function to register and enqueue scripts.
		 *
		 * @param string $content When the callback is used for the render_block filter,
		 *                        the content needs to be returned so the function parameter
		 *                        is to ensure the content exists.
		 * @return string Block content.
		 */
		$callback = static function( $content, $block ) use ( $args, $block_name ) {

			// Sanity check.
			if ( empty( $block['blockName'] ) || $block_name !== $block['blockName'] ) {
				return $content;
			}

			// Register the stylesheet.
			if ( ! empty( $args['src'] ) ) {
				wp_register_script( $args['handle'], $args['src'], $args['deps'], $args['ver'], $args['in_footer'] );
			}

			// Enqueue the stylesheet.
			wp_enqueue_script( $args['handle'] );

			// If a textdomain is defined, use it to set the script translations.
			if ( ! empty( $args['textdomain'] ) && in_array( 'wp-i18n', $args['deps'], true ) ) {
				wp_set_script_translations( $args['handle'], $args['textdomain'], $args['domainpath'] );
			}

			return $content;
		};

		/*
		 * The filter's callback here is an anonymous function because
		 * using a named function in this case is not possible.
		 *
		 * The function cannot be unhooked, however, users are still able
		 * to dequeue the script registered/enqueued by the callback
		 * which is why in this case, using an anonymous function
		 * was deemed acceptable.
		 */
		add_filter( 'render_block', $callback, 10, 2 );
	}
}


/**
 * Registers the metadata block attribute for block types.
 *
 * @param array $args Array of arguments for registering a block type.
 * @return array $args
 */
function gutenberg_register_metadata_attribute( $args ) {
	// Setup attributes if needed.
	if ( ! isset( $args['attributes'] ) || ! is_array( $args['attributes'] ) ) {
		$args['attributes'] = array();
	}

	if ( ! array_key_exists( 'metadata', $args['attributes'] ) ) {
		$args['attributes']['metadata'] = array(
			'type' => 'object',
		);
	}

	return $args;
}
add_filter( 'register_block_type_args', 'gutenberg_register_metadata_attribute' );

/**
 * Return a function that auto-inserts blocks relative to a given block.
 *
 * @param string $anchor_block      The block to insert relative to.
 * @param string $relative_position The position relative to the given block.
 * @param array  $inserted_block    The block to insert.
 * @return callable A function that accepts a block's content and returns the content with the inserted block.
 */
function gutenberg_auto_insert_block( $anchor_block, $relative_position, $inserted_block ) {
	return function( $block ) use ( $anchor_block, $relative_position, $inserted_block ) {
		if ( $anchor_block === $block['blockName'] ) {
			if ( 'first_child' === $relative_position ) {
				array_unshift( $block['innerBlocks'], $inserted_block );
				// Since WP_Block::render() iterates over `inner_content` (rather than `inner_blocks`)
				// when rendering blocks, we also need to prepend a value (`null`, to mark a block
				// location) to that array.
				array_unshift( $block['innerContent'], null );
			} elseif ( 'last_child' === $relative_position ) {
				array_push( $block['innerBlocks'], $inserted_block );
				// Since WP_Block::render() iterates over `inner_content` (rather than `inner_blocks`)
				// when rendering blocks, we also need to prepend a value (`null`, to mark a block
				// location) to that array.
				array_push( $block['innerContent'], null );
			}
			return $block;
		}

		$anchor_block_index = array_search( $anchor_block, array_column( $block['innerBlocks'], 'blockName' ), true );
		if ( false !== $anchor_block_index && ( 'after' === $relative_position || 'before' === $relative_position ) ) {
			if ( 'after' === $relative_position ) {
				$anchor_block_index++;
			}
			array_splice( $block['innerBlocks'], $anchor_block_index, 0, array( $inserted_block ) );

			// Find matching `innerContent` chunk index.
			$chunk_index = 0;
			while( $anchor_block_index > 0 ) {
				if ( ! is_string( $block['innerContent'][ $chunk_index ] ) ) {
					$anchor_block_index--;
				}
				$chunk_index++;
			}
			// Since WP_Block::render() iterates over `inner_content` (rather than `inner_blocks`)
			// when rendering blocks, we also need to insert a value (`null`, to mark a block
			// location) into that array.
			array_splice( $block['innerContent'], $chunk_index, 0, array( null ) );
		}
		return $block;
	};
}

function gutenberg_register_auto_inserted_blocks( $settings, $metadata ) {
	if ( ! isset( $metadata['autoInsert'] ) ) {
		return $settings;
	}

	$property_mappings = array(
		'before'     => 'before',
		'after'      => 'after',
		'firstChild' => 'first_child',
		'lastChild'  => 'last_child',
	);

	$auto_insert = $metadata['autoInsert'];
	foreach ( $auto_insert as $block_name => $block_data ) {
		$position = $block_data['position'];
		if ( ! isset( $property_mappings[ $position ] ) ) {
			continue;
		}

		$mapped_position = $property_mappings[ $position ];

		$inserted_block = array(
			'blockName'    => $metadata['name'],
			'attrs'        => $block_data['attrs'],
			'innerHTML'    => '',
			'innerContent' => array(),
			'innerBlocks'  => array(),
		);
		// TODO: In the long run, we'd likely want some sort of registry for auto-inserted blocks.

		// Auto-insert sibling and child blocks into the editor (via the templates and patterns
		// REST API endpoints), and auto-insert sibling blocks on the frontend.
		// TODO: Make work for child blocks auto-insertion on the frontend.
		$inserter = gutenberg_auto_insert_block( $block_name, $mapped_position, $inserted_block );
		add_filter( "gutenberg_serialize_block", $inserter, 10, 1 );

		// TODO: Remove the following in favor of the gutenberg_serialize_block filter above,
		// once that is working for child blocks on the frontend.
		if ( 'first_child' === $mapped_position || 'last_child' === $mapped_position ) {
			$inserter = gutenberg_auto_insert_block( $block_name, $mapped_position, $inserted_block );
			add_filter( "render_block_data", $inserter, 10, 1 );
		}
		$settings['auto_insert'][ $block_name ] = $mapped_position;
	}

	return $settings;
}
add_filter( 'block_type_metadata_settings', 'gutenberg_register_auto_inserted_blocks', 10, 2 );

function gutenberg_parse_and_serialize_block_templates( $query_result, $query, $template_type )  {
	foreach( $query_result as $block_template ) {
		if ( 'theme' !== $block_template->source ) {
			continue;
		}
		$blocks = parse_blocks( $block_template->content );
		$block_template->content = gutenberg_serialize_blocks( $blocks );
	}

	return $query_result;
}
add_filter( 'get_block_templates', 'gutenberg_parse_and_serialize_block_templates', 10, 3 );

/**
 * Filters the block template object after it has been (potentially) fetched from the theme file.
 *
 * @param WP_Block_Template|null $block_template The found block template, or null if there is none.
 * @param string                 $id             Template unique identifier (example: 'theme_slug//template_slug').
 * @param string                 $template_type  Template type: 'wp_template' or 'wp_template_part'.
 */
function gutenberg_parse_and_serialize_blocks( $block_template, $id, $template_type ) {

	$blocks = parse_blocks( $block_template->content );
	$block_template->content = gutenberg_serialize_blocks( $blocks );

	return $block_template;
}
add_filter( 'get_block_file_template', 'gutenberg_parse_and_serialize_blocks', 10, 3 );

function gutenberg_serialize_block( $block ) {
	$block_content = '';

	$block = apply_filters( 'gutenberg_serialize_block', $block );

	$index = 0;
	foreach ( $block['innerContent'] as $chunk ) {
		if ( is_string( $chunk ) ) {
			$block_content .= $chunk;
		} else { // Compare to WP_Block::render().
			$inner_block = $block['innerBlocks'][ $index++ ];
			$block_content .= gutenberg_serialize_block( $inner_block );
		}
	}

	if ( ! is_array( $block['attrs'] ) ) {
		$block['attrs'] = array();
	}

	return get_comment_delimited_block_content(
		$block['blockName'],
		$block['attrs'],
		$block_content
	);
}

function gutenberg_serialize_blocks( $blocks ) {
	return implode( '', array_map( 'gutenberg_serialize_block', $blocks ) );
}

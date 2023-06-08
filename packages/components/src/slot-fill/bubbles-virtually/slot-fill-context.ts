/**
 * External dependencies
 */
import { proxyMap } from 'valtio/utils';
/**
 * WordPress dependencies
 */
import { createContext } from '@wordpress/element';
import warning from '@wordpress/warning';
/**
 * Internal dependencies
 */
import type { BubblesVirtuallySlotFillContext } from '../types';

const initialContextValue: BubblesVirtuallySlotFillContext = {
	slots: proxyMap(),
	fills: proxyMap(),
	registerSlot: () => {
		warning(
			'Components must be wrapped within `SlotFillProvider`. ' +
				'See https://developer.wordpress.org/block-editor/components/slot-fill/'
		);
	},
	updateSlot: () => {},
	unregisterSlot: () => {},
	registerFill: () => {},
	unregisterFill: () => {},
};

const SlotFillContext = createContext( initialContextValue );

export default SlotFillContext;

import { ReportInventory } from '../../../database/mongoDB/migrations/reportModel/types';

const { inventory } = require('./inventory');
// Amazone inventory_sizes //// custom inventory_type //// banner
// E-Planning    // inventory_sizes //// Variable (300x250) inventory_type //// banner
// Google Ad Manager WMG // inventory_sizes //// Video/Overlay inventory_type //// video
// inventory_sizes //// 320x50 inventory_type //// banner
// inventory_sizes //// Video/Overlay inventory_type //// video

export const getInventory = (params: { inventory_sizes: string; inventory_type: string }): ReportInventory => {
  const { inventory_sizes, inventory_type } = params;
  const allowedSizes = inventory.getAllowedSizes();

  if (inventory_sizes === 'Native') {
    return {
      sizes: '1x1',
      width: 1,
      height: 1,
      inventory_type: 'Native'
    };
  } else if (allowedSizes.includes(inventory_sizes) && (inventory_type === 'banner' || inventory_type === 'display')) {
    const { width, height } = splitInventorySize(inventory_sizes);

    return {
      sizes: inventory_sizes,
      width,
      height,
      inventory_type: 'banner'
    };
  } else if (inventory_sizes === 'Video/Overlay' || inventory_sizes === 'Inpage' || inventory_type === 'video') {
    return {
      sizes: 'Video/Overlay',
      width: 0,
      height: 0,
      inventory_type: 'video'
    };
  } else if (
    !allowedSizes.includes(inventory_sizes) &&
    (inventory_type === 'banner' || inventory_type === 'display') &&
    inventory_sizes !== 'Inpage'
  ) {
    const doSplit = parseInt(inventory_sizes);
    let width, height;
    if (doSplit) {
      ({ width, height } = splitInventorySize(inventory_sizes));
    } else {
      width = height = inventory_sizes;
      width = isNaN(parseInt(width)) ? 1 : parseInt(width);
      height = isNaN(parseInt(height)) ? 1 : parseInt(height);
    }

    return {
      sizes: 'Fluid',
      width,
      height,
      inventory_type: 'banner'
    };
  } else if (inventory_sizes === 'unknown' && (inventory_type === 'banner' || inventory_type === 'video')) {
    return {
      sizes: 'unknown',
      width: -1,
      height: -1,
      inventory_type
    };
  } else {
    console.log('The inventory_sizes, inventory_type not in rule .....', inventory_sizes, '/////', inventory_type);
    return {
      sizes: 'unknown',
      width: 0,
      height: 0,
      inventory_type: ''
    };
  }
};

const splitInventorySize = (inventorySize: string | undefined): { width: number; height: number } => {
  if (typeof inventorySize === 'string' && inventorySize.length) {
    let [width, height] = inventorySize.split('x');

    return { width: parseInt(width), height: parseInt(height) };
  }

  return { width: 0, height: 0 };
};

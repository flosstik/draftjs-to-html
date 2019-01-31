/* @flow */

import { getBlockMarkup } from './block';
import { isList, getListMarkup } from './list';

/**
* The function will generate html markup for given draftjs editorContent.
*/
export default function draftToHtml(
  editorContent: Object,
  hashtagConfig: Object,
  directional: boolean,
  customEntityTransform: Function,
  tagsMapping: ?Object
): string {
  const html = [];
  tagsMapping = tagsMapping || {}

  if (editorContent) {
    const { blocks, entityMap } = editorContent;
    if (blocks && blocks.length > 0) {
      let listBlocks = [];
      blocks.forEach((block) => {
        if (isList(block.type)) {
          listBlocks.push(block);
        } else {
          if (listBlocks.length > 0) {
            const listHtml = getListMarkup(listBlocks, entityMap, hashtagConfig, customEntityTransform, tagsMapping); // eslint-disable-line max-len
            html.push(listHtml);
            listBlocks = [];
          }
          const blockHtml = getBlockMarkup(
            block,
            entityMap,
            hashtagConfig,
            directional,
            customEntityTransform,
            tagsMapping,
          );
          html.push(blockHtml);
        }
      });
      if (listBlocks.length > 0) {
        const listHtml = getListMarkup(listBlocks, entityMap, hashtagConfig, directional, customEntityTransform, tagsMapping); // eslint-disable-line max-len
        html.push(listHtml);
        listBlocks = [];
      }
    }
  }
  return html.join('');
}

import {
  ApplySchemaAttributes,
  extension,
  ExtensionTag,
  MarkExtension,
  MarkExtensionSpec,
  MarkSpecOverride,
} from '@remirror/core';

export interface SampOptions {}

// @extension<SampOptions>({ defaultOptions: {} })
export class SampExtension extends MarkExtension<SampOptions> {
  get name() {
    return 'samp' as const;
  }

  createTags() {
    return [ExtensionTag.FormattingMark, ExtensionTag.FontStyle];
  }

  createMarkSpec(extra: ApplySchemaAttributes, override: MarkSpecOverride): MarkExtensionSpec {
    return {
      ...override,
      attrs: extra.defaults(),
      parseDOM: [
        {
          tag: 'samp',
          getAttrs: extra.parse,
        },
        ...(override.parseDOM ?? []),
      ],
      toDOM: (node) => {
        return ['samp', extra.dom(node), 0];
      },
    };
  }
}
import path from 'path';

import { copy } from 'fs-extra';
import { DefaultTheme, PageEvent, Reflection, RendererEvent } from 'typedoc';
import { Renderer } from 'typedoc/dist/lib/output/renderer';

import { OverrideThemeContext } from './OverrideThemeContext';

export class OverrideTheme extends DefaultTheme {
  private _contextCache?: OverrideThemeContext;

  public constructor(renderer: Renderer) {
    super(renderer);

    this.listenTo(this.owner, RendererEvent.END, async () => {
      const out =
        this.application.options.getValue('out') ||
        path.join(process.cwd(), './docs');

      await copy(
        // eslint-disable-next-line unicorn/prefer-module
        path.join(require.resolve('typedoc-theme-hierarchy'), '../assets'),
        path.join(out, '/assets'),
      );
    });
  }

  /**
   * Переопределяет стандартный контекст.
   */
  public override getRenderContext(
    page: PageEvent<Reflection>,
  ): OverrideThemeContext {
    this._contextCache ||= new OverrideThemeContext(
      this,
      page,
      this.application.options,
    );

    return this._contextCache;
  }
}

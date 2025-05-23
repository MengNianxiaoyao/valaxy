import type { MenuItem } from '@valaxyjs/utils'
import type { DefaultTheme } from '../../../types'
import { getHeaders } from '@valaxyjs/utils'
import { computed, shallowRef } from 'vue'
import { useFrontmatter, useThemeConfig } from '../..'
import { onContentUpdated } from '../../utils'

/**
 * export headers & handleClick to generate outline
 */
export function useOutline() {
  const frontmatter = useFrontmatter()
  const themeConfig = useThemeConfig()
  const headers = shallowRef<MenuItem[]>([])
  const pageOutline = computed<DefaultTheme.Config['outline']>(
    () => frontmatter.value.outline ?? themeConfig.value.outline,
  )

  onContentUpdated(() => {
    if (pageOutline.value === false)
      return
    headers.value = getHeaders({
      range: pageOutline.value,
      selector: '.markdown-body',
      filter: el => !!el.id && el.hasChildNodes(),
    })
  })

  const handleClick = ({ target: el }: Event) => {
    const id = (el as HTMLAnchorElement).href!.split('#')[1]
    const heading = document.getElementById(
      decodeURIComponent(id),
    ) as HTMLAnchorElement
    heading?.focus({
      preventScroll: true,
    })
  }

  return {
    /**
     * headers for toc
     */
    headers,
    /**
     * click hash heading
     */
    handleClick,
  }
}

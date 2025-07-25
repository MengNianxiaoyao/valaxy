import { definePerson, defineWebPage, defineWebSite, useSchemaOrg } from '@unhead/schema-org/vue'
import { useSeoMeta } from '@unhead/vue'

// TODO: add docs to override ValaxyApp
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

import { useRoute } from 'vue-router'

import { useFrontmatter, useLocale, useValaxyHead, useValaxyI18n } from '../../composables'
import { useTimezone } from '../../composables/global'
// https://github.com/vueuse/head
// you can use this to manipulate the document head in any components,
// they will be rendered correctly in the html results with vite-ssg
import { useSiteConfig } from '../../config'

export function useValaxyApp() {
  const siteConfig = useSiteConfig()
  // todo, allow user config
  const fm = useFrontmatter()

  const { locale } = useI18n()
  const { $t, $tO } = useValaxyI18n()

  const title = computed(() => $tO(fm.value.title))

  const route = useRoute()
  const { toggleLocale } = useLocale()
  // if lang exist, toggle the locale
  if (route.query.lang) {
    toggleLocale(route.query.lang as string)
  }

  // seo
  // todo: get first image url from markdown
  const siteUrl = computed(() => fm.value.url || siteConfig.value.url)
  const description = computed(() => $tO(fm.value.excerpt) || $tO(fm.value.description) || $t(siteConfig.value.description))

  useSeoMeta({
    description,
    ogDescription: description,
    ogLocale: computed(() => locale.value || fm.value.lang || siteConfig.value.lang || 'en'),
    ogLocaleAlternate: computed(() => siteConfig.value.languages.filter(l => l !== locale.value)),
    ogSiteName: computed(() => $t(siteConfig.value.title)),
    ogTitle: computed(() => $tO(fm.value.title) || $t(siteConfig.value.title)),
    ogImage: computed(() => fm.value.ogImage || fm.value.cover || siteConfig.value.favicon),
    ogType: 'website',
    ogUrl: siteUrl,
  })

  // for SEO
  useSchemaOrg([
    // https://unhead.unjs.io/docs/schema-org/guides/recipes/identity
    // Personal Website or Blog
    definePerson({
      name: $t(siteConfig.value.author.name),
      url: siteUrl.value,
      image: $t(siteConfig.value.author.avatar),
      sameAs: siteConfig.value.social.map(s => s.link),
    }),
    defineWebSite({
      name: title.value,
      datePublished: computed(() => fm.value.date),
      dateModified: computed(() => fm.value.updated),
    }),
    defineWebPage(),
  ])

  useTimezone()
  useValaxyHead()
}

import { readFile } from 'node:fs/promises'
import path from 'node:path'
import fs from 'fs-extra'
import { resolveOptions } from '../../options'
import { userRoot } from './constants'

export async function getTemplate(layout: string): Promise<string | false> {
  const { clientRoot, themeRoot } = await resolveOptions({ userRoot })
  const roots = [userRoot, themeRoot, clientRoot]

  for (const root of roots) {
    const scaffoldPath = path.resolve(root, 'scaffolds', `${layout}.md`)
    if (await fs.exists(scaffoldPath))
      return readFile(scaffoldPath, 'utf-8')
  }

  return false
}

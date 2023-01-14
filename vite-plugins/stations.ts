import type { Plugin } from 'vite'
import { readFileSync } from 'fs'
import groupBy from 'lodash-es/groupBy'

function Stations(): Plugin {
  const virtualModuleId = 'virtual:vite-plugin-stations'
  const resolvedVirtualModuleId = '\0' + virtualModuleId
  const data = JSON.parse(readFileSync('src/data/station.json', 'utf-8'))

  return {
    name: 'vite-plugin-stations',

    resolveId(id) {
      if (id === virtualModuleId) {
        return resolvedVirtualModuleId
      }
    },
    load(id) {
      if (id === resolvedVirtualModuleId) {
        return `export const data = ${JSON.stringify(formatData(data))}`
      }
    }
  }
}

function formatData(data: any) {
  return groupBy(data.map(d => ({ pref_cd: d.pref_cd, station_name: d.station_name })), v => v.pref_cd)
}

export default Stations
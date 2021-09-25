import type { PrometheusRule, RecordingRule, Group, Labels } from './common.ts'
//import YAML from "https://esm.sh/yaml?dev"
//import YAML from "https://deno.land/x/yaml@v2.0.0-8/src/index.ts"
import {
	
  parse as yamlParse,

  parseAll as yamlParseAll,

  stringify as yamlStringify,
  EXTENDED_SCHEMA

} from 'https://deno.land/std@0.108.0/encoding/yaml.ts'

type Percentile =
  | "90"
  | "95"
  | "99"
export const percentiles: Percentile[] = [
  "90",
  "95",
  "99",
]

type TimeFrame = "1m" | "5m" | "30m" | "1h" | "6h" | "1d"
type Range = {
  interval: TimeFrame;
  windows: TimeFrame[];
}
export const ranges: Range[] = [
  {
    interval: "1m",
    windows: ["1m", "5m"],
  },
  {
    interval: "5m",
    windows: ["30m", "1h"],
  },
  {
    interval: "1h",
    windows: ["6h", "1d"],
  },
]
type ExpressionTemplate = (percentile: Percentile, app: string, window: TimeFrame) => string

type BaseQuery = {
  name: string
  expr: ExpressionTemplate
  labels?: Labels
}

type Query = {
  name: string
  expr: ExpressionTemplate
  recordingRule: (groupName: GroupName, app: string, percentile: Percentile, window: TimeFrame) => RecordingRule
}

export function latencyQuery(query: BaseQuery): Query {
  return {
    ...query,
    recordingRule: (groupName, app, percentile, window) => ({
      record: ["job", groupName, query.name, percentile, window].join(":"),
      expr: query.expr(percentile, app, window),
    })
  }
}

export function throughputQuery(query: BaseQuery): Query {
  return {
    ...query,
    recordingRule: (groupName, app, percentile, window) => ({
      record: ["job", groupName, query.name, window].join(":"),
      expr: query.expr(percentile, app, window),
      labels: query.labels
    })
  }
}

type GroupName = "latency" | "throughput"
export function recordingPrometheusRule(
  prometheusName: string,
  groupName: GroupName,
  queries: Query[],
  ranges: Range[],
  percentiles: Percentile[],
  apps: string[],
): PrometheusRule  {
  return {
    kind: "Prometheus/Rule",
    name: `${prometheusName}-prometheus-rules-${groupName}`,
    spec: {
      prometheus: `prometheus-${prometheusName}`,
      groups: [...group(groupName, queries, ranges, percentiles, apps)],
    }
  }
}

function* group(
  groupName: GroupName,
  queries: Query[],
  ranges: Range[],
  percentiles: Percentile[],
  apps: string[],
): Generator<Group> {
  for (const range of ranges) {
      yield {
      name: `${groupName}_${range.interval}`,
      interval: range.interval,
      rules: [...rule(groupName, queries, percentiles, apps, range.windows)],
    }
  }
  return
}

function* rule(
  groupName: GroupName,
  queries: Query[],
  percentiles: Percentile[],
  apps: string[],
  windows: TimeFrame[],
): Generator<RecordingRule> {
  for (const query of queries) {
    for (const percentile of percentiles) {
      for (const app of apps) {
        for (const window of windows) {
          yield query.recordingRule(groupName, app, percentile, window)
        }
      }
    }
  }
  return
}

export async function writeYaml(fileName: string, rule: PrometheusRule) {
  const yaml = yamlStringify(rule, {schema: EXTENDED_SCHEMA})
  await Deno.writeTextFile(fileName, yaml)
  console.log(`${fileName} written`)
}
// export async function writeYaml(fileName: string, rules: PrometheusRule[]) {
//   const yaml = YAML.stringify(rule)
//   await Deno.writeTextFile(fileName, yaml)
//   console.log(`${fileName} written`)
// }

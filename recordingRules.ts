import { latencyQuery, throughputQuery, writeYaml, recordingPrometheusRule, ranges, percentiles } from "./recording.ts"

export const apps = [
  "abcService",
  "defService",
  "xyzService",
]

export const latencyQueries = [
  latencyQuery({
    name: "http",
    expr: (percentile, app, window) =>
      `histogram_quantile(0.${percentile}, sum(rate(http_server_requests_seconds_bucket{job="${app}", uri!~".*/(test|admin|internal|\\*\\*).*|root"}[${window}])) by (le, job, service, uri, method, status))`,
  }),
  latencyQuery({
    name: "http_by_method",
    expr: (percentile, app, window) =>
      `histogram_quantile(0.${percentile}, sum(rate(http_server_requests_seconds_bucket{job="${app}", uri!~".*/(test|admin|internal|\\*\\*).*|root"}[${window}])) by (le, job, service, method))`,
  }),
  latencyQuery({
    name: "http_total",
    expr: (percentile, app, window) =>
      `histogram_quantile(0.${percentile}, sum(rate(http_server_requests_seconds_bucket{job="${app}", uri!~".*/(test|admin|internal|\\*\\*).*|root"}[${window}])) by (le, job, service))`,
  }),
  latencyQuery({
    name: "resilience4j",
    expr: (percentile, app, window) =>
      `histogram_quantile(0.${percentile}, sum(rate(resilience4j_circuitbreaker_calls_seconds_bucket{job="${app}", }[${window}])) by (le, job, service, name))`,
  }),
]

export const throughputQueries = [
  throughputQuery({
    name: "http",
    expr: (_percentile, app, window) =>
      `sum(rate(http_server_requests_seconds_count{job="${app}", uri!~".*/(test|admin|internal|\\*\\*).*|root"}[${window}])) by (job, service, uri, method, status)`,
  }),
  throughputQuery({
    name: "logging",
    expr: (_percentile, app, window) =>
      `sum(rate(logging_all_events_total{job="${app}", appender="general_log_statistics"}[${window}])) by (job, service, level, scope)`,
  }),
  throughputQuery({
    name: "resilience4j",
    expr: (_percentile, app, window) =>
      `sum(rate(resilience4j_circuitbreaker_calls_seconds_count{job="${app}", }[${window}])) by (job, service, kind, name)`,
  }),
]

writeYaml("./latencyRecording.yaml", recordingPrometheusRule("checkout", "latency", latencyQueries, ranges, percentiles, apps))
writeYaml("./throughputRecording.yaml", recordingPrometheusRule("checkout", "throughput", throughputQueries, ranges, percentiles, apps))
// writeYaml("./recording.yaml", [
//     recordingPrometheusRule("checkout", "latency", latencyQueries, ranges, percentiles, apps),
//     recordingPrometheusRule("checkout", "throughput", throughputQueries, ranges, percentiles, apps)]
//     )

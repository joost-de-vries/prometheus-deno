import { latencyQueries, throughputQueries, apps } from './recordingRules.ts'
import { writeYaml, recordingPrometheusRule, ranges, percentiles } from './recording.ts'

writeYaml("./latencyRecording.yaml", recordingPrometheusRule("checkout", "latency", latencyQueries, ranges, percentiles, apps))
writeYaml("./throughputRecording.yaml", recordingPrometheusRule("checkout", "throughput", throughputQueries, ranges, percentiles, apps))

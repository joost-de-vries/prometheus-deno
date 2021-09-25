export type Labels = {
  status: "failure" | "success"
}
export type RecordingRule = {
  record: string
  expr: string
  labels?: Labels
}

export type KubernetesPrometheusRules = {
  kind: string;
  name: string;
  spec: {
    prometheus: string
    groups: Group[]
  }
}
// a valid prometheus rule conform https://json.schemastore.org/prometheus.rules.json
export type PrometheusRule = {
  groups: Group[]
}

export type Group = {
  name: string
  rules: RecordingRule[]
  interval: string
}

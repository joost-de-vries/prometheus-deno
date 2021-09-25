export type Labels = {
  status: "failure" | "success"
}
export type RecordingRule = {
  record: string
  expr: string
  labels?: Labels
}

export type PrometheusRule = {
  kind: string;
  name: string;
  spec: {
    prometheus: string;
    groups: Group[]
  }
}

export type Group = {
  name: string
  rules: RecordingRule[]
  interval: string
}

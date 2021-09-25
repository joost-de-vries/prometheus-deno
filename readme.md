An experiment to generate Prometheus recording rules with Deno and Typescript. Instead of with jSonnet.

Install Deno. And for Visual Code the Deno plugin and Redhats yaml plugin.

Run with  
`deno run -A recordingRules.ts`

Compile with 
`deno compile -A recordingRules.ts`

Open the generated file `validRule.yaml`. The yaml plugin will validate it automatically as conforming to https://json.schemastore.org/prometheus.rules.json  
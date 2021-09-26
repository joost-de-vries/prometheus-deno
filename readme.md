# Generating Prometheus rule yaml with Deno and Typescript
An experiment to generate Prometheus recording rules with Deno and Typescript. Instead of with jSonnet.  
See my [write up](https://gist.github.com/joost-de-vries/054dd291ada0a5ee7251faf812ddf16b).  

Install Deno. And in Visual Code install the Deno plugin and Redhats yaml plugin.

Run with  
`deno run -A recordingRules.ts`

Compile with  
`deno compile -A recordingRules.ts`

Open the generated file `validRule.yaml`. The yaml plugin will validate it automatically as conforming to https://json.schemastore.org/prometheus.rules.json  
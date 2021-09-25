An experiment to generate Prometheus recording rules with Deno and Typescript. Instead of with jSonnet.

Install Deno. And for Visual Code the Deno plugin and Redhats yaml plugin.

Run with  
`deno run -A recordingRules.ts`

Compile with 
`deno compile -A recordingRules.ts`

Annotate yaml with
`# yaml-language-server: $schema=https://json.schemastore.org/prometheus.rules.json
` to have the file validated against the schema.
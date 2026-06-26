# mcp

# mcp

Read-only MCP adapter for `pvf-agent-core`.

The server proxies to the configured upstream `pvf_bridge` MCP server and exposes only read-only tools:

- `pvf_open`
- `pvf_session_info`
- `pvf_close`
- `pvf_list_files`
- `pvf_search`
- `pvf_list_registries`
- `pvf_resolve_lst_id`
- `pvf_resolve_id`
- `pvf_read_file`

It rejects write tools even if the upstream bridge supports them.

# Malaysia Data Government MCP Server

A Model Context Protocol (MCP) server that provides AI assistants with programmatic access to Malaysian government open data through the [OpenDOSM](https://open.dosm.gov.my) and [Data Catalogue](https://data.gov.my) APIs.

### Key Features

- **Fast and lightweight**. Built with FastMCP and async httpx for efficient data access.
- **Comprehensive data access**. Connects to both OpenDOSM and Data Catalogue APIs.
- **Easy integration**. Simple tool interface for querying datasets, filtering, and pagination.

### Requirements
- Python 3.10 or newer
- Node.js 18 or newer (for `npx` command)
- VS Code, Cursor, Windsurf, Claude Desktop, Goose or any other MCP client

### Getting started

First, install the Malaysia Data Government MCP server with your client.

**Standard config** works in most of the tools:

```js
{
  "mcpServers": {
    "datagovmy": {
      "command": "npx",
      "args": [
        "-y",
        "@lightyoruichi/datagovmy-mcp"
      ]
    }
  }
}
```

[<img src="https://img.shields.io/badge/VS_Code-VS_Code?style=flat-square&label=Install%20Server&color=0098FF" alt="Install in VS Code">](https://insiders.vscode.dev/redirect?url=vscode%3Amcp%2Finstall%3F%257B%2522name%2522%253A%2522datagovmy%2522%252C%2522command%2522%253A%2522npx%2522%252C%2522args%2522%253A%255B%2522-y%2522%252C%2522%2540lightyoruichi%252Fdatagovmy-mcp%2522%255D%257D) [<img alt="Install in VS Code Insiders" src="https://img.shields.io/badge/VS_Code_Insiders-VS_Code_Insiders?style=flat-square&label=Install%20Server&color=24bfa5">](https://insiders.vscode.dev/redirect?url=vscode-insiders%3Amcp%2Finstall%3F%257B%2522name%2522%253A%2522datagovmy%2522%252C%2522command%2522%253A%2522npx%2522%252C%2522args%2522%253A%255B%2522-y%2522%252C%2522%2540lightyoruichi%252Fdatagovmy-mcp%2522%255D%257D)

<details>
<summary>Amp</summary>

Add via the Amp VS Code extension settings screen or by updating your settings.json file:

```json
"amp.mcpServers": {
  "datagovmy": {
    "command": "npx",
    "args": [
      "-y",
      "@lightyoruichi/datagovmy-mcp"
    ]
  }
}
```

**Amp CLI Setup:**

Add via the `amp mcp add` command below

```bash
amp mcp add datagovmy -- npx -y @lightyoruichi/datagovmy-mcp
```

</details>

<details>
<summary>Claude Code</summary>

Use the Claude Code CLI to add the Malaysia Data Government MCP server:

```bash
claude mcp add datagovmy npx -y @lightyoruichi/datagovmy-mcp
```
</details>

<details>
<summary>Claude Desktop</summary>

Follow the MCP install [guide](https://modelcontextprotocol.io/quickstart/user), use the standard config above.

**Configuration file locations:**
- **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

After adding the configuration, restart Claude Desktop.

</details>

<details>
<summary>Codex</summary>

Use the Codex CLI to add the Malaysia Data Government MCP server:

```bash
codex mcp add datagovmy npx "-y" "@lightyoruichi/datagovmy-mcp"
```

Alternatively, create or edit the configuration file `~/.codex/config.toml` and add:

```toml
[mcp_servers.datagovmy]
command = "npx"
args = ["-y", "@lightyoruichi/datagovmy-mcp"]
```

For more information, see the [Codex MCP documentation](https://github.com/openai/codex/blob/main/codex-rs/config.md#mcp_servers).

</details>

<details>
<summary>Copilot</summary>

Use the Copilot CLI to interactively add the Malaysia Data Government MCP server:

```bash
/mcp add
```

Alternatively, create or edit the configuration file `~/.copilot/mcp-config.json` and add:

```json
{
  "mcpServers": {
    "datagovmy": {
      "type": "local",
      "command": "npx",
      "tools": [
        "*"
      ],
      "args": [
        "-y",
        "@lightyoruichi/datagovmy-mcp"
      ]
    }
  }
}
```

For more information, see the [Copilot CLI documentation](https://docs.github.com/en/copilot/concepts/agents/about-copilot-cli).

</details>

<details>
<summary>Cursor</summary>

#### Click the button to install:

[<img src="https://cursor.com/deeplink/mcp-install-dark.svg" alt="Install in Cursor">](https://cursor.com/en/install-mcp?name=Malaysia%20Data%20Government&config=eyJjb21tYW5kIjoibnB4IiwiYXJncyI6WyIteSIsIkBsaWdodHlvcnVpY2hpL2RhdGFnb3ZteS1tY3AiXX0%3D)

#### Or install manually:

Go to `Cursor Settings` -> `MCP` -> `Add new MCP Server`. Name to your liking, use `command` type with the command `npx -y @lightyoruichi/datagovmy-mcp`. You can also verify config or add command like arguments via clicking `Edit`.

</details>

<details>
<summary>Factory</summary>

Use the Factory CLI to add the Malaysia Data Government MCP server:

```bash
droid mcp add datagovmy "npx -y @lightyoruichi/datagovmy-mcp"
```

Alternatively, type `/mcp` within Factory droid to open an interactive UI for managing MCP servers.

For more information, see the [Factory MCP documentation](https://docs.factory.ai/cli/configuration/mcp).

</details>

<details>
<summary>Gemini CLI</summary>

Follow the MCP install [guide](https://github.com/google-gemini/gemini-cli/blob/main/docs/tools/mcp-server.md#configure-the-mcp-server-in-settingsjson), use the standard config above.

</details>

<details>
<summary>Goose</summary>

#### Click the button to install:

[![Install in Goose](https://block.github.io/goose/img/extension-install-dark.svg)](https://block.github.io/goose/extension?cmd=npx&arg=-y&arg=%40lightyoruichi%2Fdatagovmy-mcp&id=datagovmy&name=Malaysia%20Data%20Government&description=Access%20Malaysian%20government%20open%20data%20from%20OpenDOSM%20and%20Data%20Catalogue%20APIs)

#### Or install manually:

Go to `Advanced settings` -> `Extensions` -> `Add custom extension`. Name to your liking, use type `STDIO`, and set the `command` to `npx -y @lightyoruichi/datagovmy-mcp`. Click "Add Extension".
</details>

<details>
<summary>Kiro</summary>

Follow the MCP Servers [documentation](https://kiro.dev/docs/mcp/). For example in `.kiro/settings/mcp.json`:

```json
{
  "mcpServers": {
    "datagovmy": {
      "command": "npx",
      "args": [
        "-y",
        "@lightyoruichi/datagovmy-mcp"
      ]
    }
  }
}
```
</details>

<details>
<summary>LM Studio</summary>

#### Click the button to install:

[![Add MCP Server datagovmy to LM Studio](https://files.lmstudio.ai/deeplink/mcp-install-light.svg)](https://lmstudio.ai/install-mcp?name=datagovmy&config=eyJjb21tYW5kIjoibnB4IiwiYXJncyI6WyIteSIsIkBsaWdodHlvcnVpY2hpL2RhdGFnb3ZteS1tY3AiXX0=)

#### Or install manually:

Go to `Program` in the right sidebar -> `Install` -> `Edit mcp.json`. Use the standard config above.
</details>

<details>
<summary>opencode</summary>

Follow the MCP Servers [documentation](https://opencode.ai/docs/mcp-servers/). For example in `~/.config/opencode/opencode.json`:

```json
{
  "$schema": "https://opencode.ai/config.json",
  "mcp": {
    "datagovmy": {
      "type": "local",
      "command": [
        "npx",
        "-y",
        "@lightyoruichi/datagovmy-mcp"
      ],
      "enabled": true
    }
  }
}

```
</details>

<details>
<summary>Qodo Gen</summary>

Open [Qodo Gen](https://docs.qodo.ai/qodo-documentation/qodo-gen) chat panel in VSCode or IntelliJ → Connect more tools → + Add new MCP → Paste the standard config above.

Click <code>Save</code>.
</details>

<details>
<summary>VS Code</summary>

#### Click the button to install:

[<img src="https://img.shields.io/badge/VS_Code-VS_Code?style=flat-square&label=Install%20Server&color=0098FF" alt="Install in VS Code">](https://insiders.vscode.dev/redirect?url=vscode%3Amcp%2Finstall%3F%257B%2522name%2522%253A%2522datagovmy%2522%252C%2522command%2522%253A%2522npx%2522%252C%2522args%2522%253A%255B%2522-y%2522%252C%2522%2540lightyoruichi%252Fdatagovmy-mcp%2522%255D%257D) [<img alt="Install in VS Code Insiders" src="https://img.shields.io/badge/VS_Code_Insiders-VS_Code_Insiders?style=flat-square&label=Install%20Server&color=24bfa5">](https://insiders.vscode.dev/redirect?url=vscode-insiders%3Amcp%2Finstall%3F%257B%2522name%2522%253A%2522datagovmy%2522%252C%2522command%2522%253A%2522npx%2522%252C%2522args%2522%253A%255B%2522-y%2522%252C%2522%2540lightyoruichi%252Fdatagovmy-mcp%2522%255D%257D)

#### Or install manually:

Follow the MCP install [guide](https://code.visualstudio.com/docs/copilot/chat/mcp-servers#_add-an-mcp-server), use the standard config above. You can also install the Malaysia Data Government MCP server using the VS Code CLI:

```bash
# For VS Code
code --add-mcp '{"name":"datagovmy","command":"npx","args":["-y","@lightyoruichi/datagovmy-mcp"]}'
```

After installation, the Malaysia Data Government MCP server will be available for use with your GitHub Copilot agent in VS Code.
</details>

<details>
<summary>Warp</summary>

Go to `Settings` -> `AI` -> `Manage MCP Servers` -> `+ Add` to [add an MCP Server](https://docs.warp.dev/knowledge-and-collaboration/mcp#adding-an-mcp-server). Use the standard config above.

Alternatively, use the slash command `/add-mcp` in the Warp prompt and paste the standard config from above:
```js
{
  "mcpServers": {
    "datagovmy": {
      "command": "npx",
      "args": [
        "-y",
        "@lightyoruichi/datagovmy-mcp"
      ]
    }
  }
}
```

</details>

<details>
<summary>Windsurf</summary>

Follow Windsurf MCP [documentation](https://docs.windsurf.com/windsurf/cascade/mcp). Use the standard config above.

</details>

### Local Development

For local development before publishing to npm:

```bash
cd /Users/lightyoruichi/Dev/datagovmy-mcp
npm link
```

Then use this configuration:

```json
{
  "mcpServers": {
    "datagovmy": {
      "command": "datagovmy-mcp"
    }
  }
}
```

> **Note**: `npm link` creates a global symlink, making the `datagovmy-mcp` command available system-wide.

Alternatively, you can use the direct path to `cli.js`:

```json
{
  "mcpServers": {
    "datagovmy": {
      "command": "node",
      "args": [
        "/Users/lightyoruichi/Dev/datagovmy-mcp/cli.js"
      ]
    }
  }
}
```

### Finding Dataset IDs

Dataset IDs are not available through an API endpoint - you need to browse the data catalogues:

1. **OpenDOSM Datasets**: Visit [open.dosm.gov.my/data-catalogue](https://open.dosm.gov.my/data-catalogue)
2. **Data Catalogue Datasets**: Visit [data.gov.my/data-catalogue](https://data.gov.my/data-catalogue)

On each dataset page, scroll down to the **"Sample OpenAPI query"** section to find the dataset ID.

#### Popular Dataset IDs

**OpenDOSM** (`query_opendosm` tool):
- `cpi_core` - Core Consumer Price Index
- `gdp` - Gross Domestic Product
- `population` - Population statistics
- `unemployment` - Unemployment data

**Data Catalogue** (`query_data_catalogue` tool):
- `fuelprice` - Weekly fuel prices
- `healthcare` - Healthcare statistics
- `crime` - Crime statistics
- `education` - Education data

### Tools

<details>
<summary><b>Data Querying</b></summary>

<!-- Tools documentation -->

- **query_opendosm**
  - Title: Query OpenDOSM Dataset
  - Description: Query an OpenDOSM dataset (Department of Statistics Malaysia)
  - Parameters:
    - `dataset_id` (string, required): Dataset ID (e.g., 'cpi_core', 'gdp', 'population')
    - `filters` (string, optional): JSON string of filter parameters (e.g., '{"date": "2024-01-01"}')
    - `limit` (integer, optional): Maximum number of records to return (default: 100)
    - `offset` (integer, optional): Number of records to skip for pagination (default: 0)
  - Read-only: **false**
  - Example use cases:
    - Get latest CPI data: `dataset_id='cpi_core', limit=10`
    - Get GDP data for specific date: `dataset_id='gdp', filters='{"date": "2024-01-01"}'`

<!-- Tools documentation -->

- **query_data_catalogue**
  - Title: Query Data Catalogue Dataset
  - Description: Query a Data Catalogue dataset (broader government data)
  - Parameters:
    - `dataset_id` (string, required): Dataset ID (e.g., 'fuelprice', 'healthcare', 'crime')
    - `filters` (string, optional): JSON string of filter parameters (e.g., '{"date": "2024-01-01"}')
    - `limit` (integer, optional): Maximum number of records to return (default: 100)
    - `offset` (integer, optional): Number of records to skip for pagination (default: 0)
  - Read-only: **false**
  - Example use cases:
    - Get latest fuel prices: `dataset_id='fuelprice', limit=5`
    - Get filtered data: `dataset_id='fuelprice', filters='{"date": "2024-12-01"}'`

<!-- Tools documentation -->

- **get_dataset_metadata**
  - Title: Get Dataset Metadata
  - Description: Get metadata for a dataset without fetching the actual data records
  - Parameters:
    - `dataset_id` (string, required): Dataset ID to get metadata for
    - `source` (string, required): Data source - either 'opendosm' or 'data_catalogue'
  - Read-only: **true**
  - Example use cases:
    - Get fuel price metadata: `dataset_id='fuelprice', source='data_catalogue'`
    - Get CPI metadata: `dataset_id='cpi_core', source='opendosm'`

</details>

### API Details

#### OpenDOSM API
- **Base URL**: `https://api.data.gov.my/opendosm`
- **Data Source**: Department of Statistics Malaysia
- **Focus**: Economic and demographic statistics

#### Data Catalogue API
- **Base URL**: `https://api.data.gov.my/data-catalogue`
- **Data Source**: Various Malaysian government agencies
- **Focus**: Broader government data (healthcare, crime, education, etc.)

Both APIs support:
- Filtering with query parameters
- Pagination with `limit` and `offset`
- Metadata retrieval with `meta_only=true`

### Testing

#### With MCP Inspector

```bash
# Terminal 1: Start the server in development mode
cd /path/to/datagovmy-mcp/python
source .venv/bin/activate  # or: .venv\Scripts\activate on Windows
python -m datagovmy_mcp.server

# Terminal 2: In a new terminal, launch Inspector
npx -y @modelcontextprotocol/inspector
```

The Inspector will open in your browser. Connect to the stdio server you started in Terminal 1.

#### Direct API Testing

```python
import asyncio
from datagovmy_mcp.client import DataGovMyClient

async def test():
    client = DataGovMyClient()
    
    # Get latest fuel prices
    fuel_data = await client.query_data_catalogue("fuelprice", limit=5)
    print(f"Fuel prices: {fuel_data}")
    
    # Get CPI data
    cpi_data = await client.query_opendosm("cpi_core", limit=5)
    print(f"CPI data: {cpi_data}")
    
    await client.close()

asyncio.run(test())
```

### Data Categories

The catalogues include data across these categories:

- **Demography**: Population, births, deaths, migration
- **Economy**: GDP, inflation, trade, productivity
- **Labour**: Employment, wages, labour force
- **Prices**: Consumer prices, producer prices, fuel
- **Healthcare**: Health statistics, disease data, infrastructure
- **Education**: Schools, enrollment, outcomes
- **Public Safety**: Crime, justice system
- **Environment**: Energy, pollution, land use
- **Financial Markets**: Banking, foreign exchange
- **Transportation**: Vehicle registrations, ridership

### Installation (Manual)

#### Using `uv` (recommended)

```bash
# Clone or navigate to the project directory
cd /path/to/datagovmy-mcp

# Create virtual environment and install
uv venv
uv pip install -e python
```

#### Using `pip`

```bash
# Navigate to the python directory
cd /path/to/datagovmy-mcp/python

# Create virtual environment
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate

# Install the package
pip install -e .
```

### Contributing

Contributions are welcome! Please feel free to submit issues or pull requests.

### License

MIT License - see LICENSE file for details

### Links

- [Model Context Protocol](https://modelcontextprotocol.io/)
- [OpenDOSM Data Catalogue](https://open.dosm.gov.my/data-catalogue)
- [Malaysia Data Catalogue](https://data.gov.my/data-catalogue)
- [API Documentation](https://developer.data.gov.my/)

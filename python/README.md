# Malaysia Data Government MCP Server

A Model Context Protocol (MCP) server that provides AI assistants with programmatic access to Malaysian government open data through the [OpenDOSM](https://open.dosm.gov.my) and [Data Catalogue](https://data.gov.my) APIs.

### Key Features

- **Fast and lightweight**. Built with FastMCP and async httpx for efficient data access.
- **Comprehensive data access**. Connects to both OpenDOSM and Data Catalogue APIs.
- **Easy integration**. Simple tool interface for querying datasets, filtering, and pagination.

### Requirements

- **Python 3.10 or newer** - [Download Python](https://www.python.org/downloads/)
- **Node.js 18 or newer** (for `npx` method) - [Download Node.js](https://nodejs.org/)
- **uv** (recommended) - Fast Python package installer - [Install uv](https://docs.astral.sh/uv/getting-started/installation/)
- VS Code, Cursor, Windsurf, Claude Desktop, Goose or any other MCP client

### Troubleshooting Installation Issues

If you encounter errors during installation, run these commands **before** installing:

<details>
<summary><b>❌ "externally-managed-environment" error (macOS)</b></summary>

If you see this error on macOS:
```
error: externally-managed-environment
× This environment is externally managed
```

**Solution**: Use `uv` instead of `pip`:
```bash
# Install uv (one-time setup)
curl -LsSf https://astral.sh/uv/install.sh | sh

# Then install the package
uv pip install /Users/lightyoruichi/Dev/datagovmy-mcp/python
```

Or use the `--user` flag with pip:
```bash
pip install --user /Users/lightyoruichi/Dev/datagovmy-mcp/python
```

</details>

<details>
<summary><b>❌ "Permission denied" error (Linux/macOS)</b></summary>

If you see permission errors:

**Solution 1**: Use `uv` (recommended):
```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
uv pip install /path/to/datagovmy-mcp/python
```

**Solution 2**: Use `--user` flag:
```bash
pip install --user /path/to/datagovmy-mcp/python
```

**Don't use `sudo`** - this can break your Python installation.

</details>

<details>
<summary><b>❌ "pip: command not found"</b></summary>

If `pip` is not installed:

**macOS/Linux**:
```bash
# Install uv (recommended)
curl -LsSf https://astral.sh/uv/install.sh | sh

# Or install pip
python3 -m ensurepip --upgrade
```

**Windows**:
```powershell
# Install uv (recommended)
powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"

# Or install pip
python -m ensurepip --upgrade
```

</details>

<details>
<summary><b>❌ "mcp module not found" when running</b></summary>

This means Python dependencies aren't installed. Run:

**Using uv (recommended)**:
```bash
uv pip install /path/to/datagovmy-mcp/python
```

**Using pip**:
```bash
pip install /path/to/datagovmy-mcp/python
```

</details>

<details>
<summary><b>❌ Windows: "python: command not found"</b></summary>

Python is not in your PATH. Either:

1. **Reinstall Python** with "Add to PATH" checked
2. **Use full path**:
   ```powershell
   # Find Python location
   where python
   
   # Use full path in configuration
   C:\Users\YourName\AppData\Local\Programs\Python\Python311\python.exe
   ```

</details>

### Getting started

#### Method 1: Using `uvx` (Recommended - Works Everywhere)

The easiest cross-platform installation:

```bash
# One-time install of uv (if not already installed)
# macOS/Linux:
curl -LsSf https://astral.sh/uv/install.sh | sh

# Windows:
powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"

# Then run the server directly with uvx
uvx --from /Users/lightyoruichi/Dev/datagovmy-mcp/python datagovmy-mcp
```

**MCP Client Configuration** (recommended):
```json
{
  "mcpServers": {
    "datagovmy": {
      "command": "uvx",
      "args": [
        "--from",
        "/Users/lightyoruichi/Dev/datagovmy-mcp/python",
        "datagovmy-mcp"
      ]
    }
  }
}
```

#### Method 2: Using `npx` (Requires Setup First)

First, install Python dependencies:

```bash
# Navigate to the python directory
cd /Users/lightyoruichi/Dev/datagovmy-mcp/python

# Install dependencies using uv (recommended)
uv pip install -e .

# Or using regular pip
pip install -e .
```

Then configure your MCP client:

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

### Discovering Datasets

You have multiple ways to discover available datasets:

#### 1. Use Discovery Tools (Recommended)

The server provides built-in tools to search and explore datasets:

```
# Ask your AI assistant:
"What datasets are available about fuel prices?"
"List all datasets in the Prices category"
"Show me datasets related to GDP"
```

The AI will use the `search_datasets` and `list_datasets` tools automatically to find relevant data.

#### 2. Browse Categorized Datasets

<details>
<summary><b>💰 Economy & Finance</b> (OpenDOSM)</summary>

- **`gdp`** - Gross Domestic Product
- **`gdp_qtr`** - GDP by Quarter
- **`gdp_annual`** - GDP Annual
- **`ppi`** - Producer Price Index
- **`trade`** - International Trade
- **`banking`** - Banking Statistics
- **`foreign_exchange`** - Foreign Exchange Rates
- **`property_prices`** - Property Prices

**Keywords**: economy, gdp, growth, national accounts, trade, finance

</details>

<details>
<summary><b>📊 Prices & Inflation</b> (OpenDOSM & Data Catalogue)</summary>

- **`cpi`** - Consumer Price Index
- **`cpi_core`** - Core Consumer Price Index
- **`inflation`** - Inflation Rate
- **`fuelprice`** - Weekly Fuel Prices (RON95, RON97, Diesel)
- **`ppi`** - Producer Price Index

**Keywords**: prices, inflation, cpi, cost of living, fuel, petrol

</details>

<details>
<summary><b>👥 Population & Demography</b> (OpenDOSM)</summary>

- **`population`** - Population Statistics
- **`population_malaysia`** - Population of Malaysia
- **`population_state`** - Population by State
- **`births`** - Live Births
- **`deaths`** - Deaths
- **`marriage`** - Marriages
- **`divorce`** - Divorces

**Keywords**: population, demography, births, deaths, fertility, mortality

</details>

<details>
<summary><b>💼 Labour & Employment</b> (OpenDOSM)</summary>

- **`unemployment`** - Unemployment Rate
- **`lfs_monthly`** - Labour Force Survey (Monthly)
- **`wages`** - Wages and Salaries

**Keywords**: unemployment, labour, jobs, work, employment, workforce, wages, salary

</details>

<details>
<summary><b>🏥 Healthcare</b> (OpenDOSM & Data Catalogue)</summary>

- **`healthcare`** - Healthcare Statistics
- **`blood_donation`** - Blood Donation
- **`hospital_beds`** - Hospital Beds
- **`covid_cases`** - COVID-19 Cases
- **`covid_vaccination`** - COVID-19 Vaccination

**Keywords**: healthcare, medical, health, hospitals, covid, pandemic

</details>

<details>
<summary><b>🏠 Households & Welfare</b> (OpenDOSM)</summary>

- **`poverty`** - Poverty Statistics
- **`hh_income`** - Household Income

**Keywords**: poverty, income, household, earnings, welfare

</details>

<details>
<summary><b>🌍 Environment</b> (OpenDOSM & Data Catalogue)</summary>

- **`electricity`** - Electricity Statistics
- **`renewable_energy`** - Renewable Energy
- **`rainfall`** - Rainfall Data
- **`air_quality`** - Air Quality Index
- **`water_quality`** - Water Quality

**Keywords**: environment, energy, electricity, renewable, weather, climate, pollution

</details>

<details>
<summary><b>🚔 Public Safety</b> (OpenDOSM & Data Catalogue)</summary>

- **`crime`** - Crime Statistics

**Keywords**: crime, safety, police, law enforcement

</details>

<details>
<summary><b>🚗 Transportation</b> (Data Catalogue)</summary>

- **`traffic`** - Traffic Data
- **`vehicle_registration`** - Vehicle Registration
- **`public_transport`** - Public Transport Ridership

**Keywords**: traffic, transportation, vehicles, cars, bus, train

</details>

<details>
<summary><b>🏭 Economic Sectors</b> (Data Catalogue)</summary>

- **`agriculture`** - Agricultural Production
- **`manufacturing`** - Manufacturing Statistics
- **`construction`** - Construction Statistics

**Keywords**: agriculture, farming, manufacturing, industry, construction

</details>

<details>
<summary><b>📚 Education</b> (Data Catalogue)</summary>

- **`education`** - Education Statistics

**Keywords**: education, schools, students, enrollment

</details>

<details>
<summary><b>🌴 Tourism</b> (Data Catalogue)</summary>

- **`tourist_arrivals`** - Tourist Arrivals

**Keywords**: tourism, tourists, arrivals, travel

</details>

#### 3. Manual Browse (Alternative)

If you prefer, you can still browse the data catalogues directly:

1. **OpenDOSM Datasets**: [open.dosm.gov.my/data-catalogue](https://open.dosm.gov.my/data-catalogue)
2. **Data Catalogue Datasets**: [data.gov.my/data-catalogue](https://data.gov.my/data-catalogue)

On each dataset page, scroll to the **"Sample OpenAPI query"** section to find the dataset ID.

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

<details>
<summary><b>Dataset Discovery</b></summary>

<!-- Tools documentation -->

- **list_datasets**
  - Title: List Available Datasets
  - Description: List all available datasets with optional filtering
  - Parameters:
    - `source` (string, optional): Filter by source - 'opendosm', 'data_catalogue', or None for all
    - `category` (string, optional): Filter by category (e.g., 'Prices', 'Demography', 'Economy')
    - `limit` (integer, optional): Maximum number of datasets to return (default: 100)
    - `offset` (integer, optional): Number of datasets to skip for pagination (default: 0)
  - Read-only: **true**
  - Example use cases:
    - List all datasets: (no parameters)
    - List OpenDOSM datasets: `source='opendosm'`
    - List price-related datasets: `category='Prices'`

<!-- Tools documentation -->

- **search_datasets**
  - Title: Search Datasets
  - Description: Search for datasets by keyword
  - Parameters:
    - `query` (string, required): Search query (searches in name, description, keywords, and ID)
    - `source` (string, optional): Filter by source - 'opendosm', 'data_catalogue', or None for all
    - `limit` (integer, optional): Maximum number of results to return (default: 10)
  - Read-only: **true**
  - Example use cases:
    - Search for fuel data: `query='fuel'`
    - Search for GDP: `query='gdp'`
    - Search for population: `query='population'`

<!-- Tools documentation -->

- **get_dataset_schema**
  - Title: Get Dataset Schema
  - Description: Get schema, metadata, and sample data for a dataset
  - Parameters:
    - `dataset_id` (string, required): Dataset ID to get schema for
    - `source` (string, required): Data source - either 'opendosm' or 'data_catalogue'
  - Read-only: **true**
  - Example use cases:
    - Get fuel price schema: `dataset_id='fuelprice', source='data_catalogue'`
    - Get GDP schema: `dataset_id='gdp', source='opendosm'`

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

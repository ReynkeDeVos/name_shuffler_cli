# Name Shuffler

A modern CLI tool that shuffles names into random groups of specified size.

## Features

- Interactive prompts for entering names and group size
- Beautiful terminal UI with colors and animations
- Intelligent group balancing algorithm
- Easy to use

## Installation

1. Clone this repository:

   ```bash
   git clone https://github.com/yourusername/name_shuffler.git
   cd name_shuffler
   ```

2. Install dependencies:

   ```bash
   pnpm install
   ```

3. Link the package to use it globally (optional):

   ```bash
   pnpm link
   ```

## Usage

Run the tool:

```bash
pnpm start
```

Or if you linked it globally:

```bash
name-shuffler
```

Then follow the prompts:

1. Enter names separated by commas
2. Specify the desired group size
3. See the randomly generated groups!

## Example

```bash
Enter names (separated by commas): Alice, Bob, Charlie, Dave, Eve, Frank, Grace, Heidi
Enter desired group size: 3
```

This will create balanced groups with the names shuffled randomly.

## Requirements

- Node.js (v14.8.0 or higher)
- npm (v6.14.0 or higher

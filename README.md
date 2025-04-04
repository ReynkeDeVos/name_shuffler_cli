# Name Shuffler

A modern CLI tool that shuffles names randomly into groups.

## Demo

![Watch a demo video](./assets/demo.avif)

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
2. Specify the number of groups you want
3. See the randomly generated groups!

## Example

```
Enter names (separated by commas): Alice, Bob, Charlie, Dave, Eve, Frank, Grace, Heidi
Enter number of groups: 3

Group 1: Alice, Frank, Heidi
Group 2: Bob, Eve
Group 3: Charlie, Dave, Grace
```

This will create 3 groups with the names shuffled randomly and distributed as evenly as possible.

## Requirements

* Node.js (v14.8.0 or higher)
* pnpm (v7.0.0 or higher)

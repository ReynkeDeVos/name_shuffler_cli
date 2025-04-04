#!/usr/bin/env node

// Import required libraries
import inquirer from 'inquirer';
import chalk from 'chalk';
import ora from 'ora';
import boxen from 'boxen';
import gradient from 'gradient-string';
import figlet from 'figlet';
import { setTimeout } from 'timers/promises';

// Display the application title with ASCII art and gradient colors
function displayTitle() {
  console.clear();
  
  const title = figlet.textSync('Name Shuffler', {
    font: 'Standard',
    horizontalLayout: 'default',
    verticalLayout: 'default'
  });
  
  console.log(gradient.pastel.multiline(title));
}

// Fisher-Yates shuffle algorithm for randomizing array elements
function shuffle(array) {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

// Create evenly distributed groups of names using round-robin assignment
function createGroups(names, numberOfGroups) {
  const shuffledNames = shuffle(names);
  const groups = Array.from({ length: numberOfGroups }, () => []);
  
  // Distribute names evenly across groups
  shuffledNames.forEach((name, index) => {
    groups[index % numberOfGroups].push(name);
  });
  
  return groups;
}

// Render the groups in a visually appealing format with colored boxes
function displayGroups(groups) {
  const totalPeople = groups.reduce((sum, group) => sum + group.length, 0);
  const termWidth = Math.min(process.stdout.columns || 80, 80);
  
  // Display summary information
  console.log(boxen(
    chalk.bold.yellow('RESULT') + '\n\n' +
    chalk.white(`People: ${chalk.cyan(totalPeople)}`) + 
    chalk.white(` • Groups: ${chalk.cyan(groups.length)}`),
    {
      padding: 1,
      margin: {top: 0, bottom: 0},
      borderStyle: 'round',
      borderColor: 'yellow',
      textAlignment: 'center'
    }
  ));
  
  // Prepare styling elements
  const colors = ['green', 'magenta', 'blue', 'red', 'cyan', 'yellow'];
  const boxWidth = Math.max(15, Math.min(18, Math.floor(termWidth / 4) - 2)); 
  
  let maxHeight = 0;
  let maxWidth = 0;
  
  // Format each group with its title and list of names
  const preparedGroups = groups.map((group, index) => {
    const color = colors[index % colors.length];
    
    const content = chalk.bold[color](`G${index + 1}`) + '\n\n' + 
      group.map(name => chalk.bold.white(name)).join('\n');
    
    const lines = content.split('\n');
    maxHeight = Math.max(maxHeight, lines.length);
    
    // Calculate required width (accounting for ANSI color codes)
    const contentWidth = Math.max(...lines.map(line => 
      line.replace(/\u001b\[\d+m/g, '').length
    ));
    maxWidth = Math.max(maxWidth, contentWidth);
    
    return { content, color };
  });
  
  // Create uniformly sized boxes for each group
  const boxedGroups = preparedGroups.map(({ content, color }) => {
    const lines = content.split('\n');
    const paddedContent = content + '\n'.repeat(Math.max(0, maxHeight - lines.length));
    
    return boxen(
      paddedContent,
      {
        padding: {top: 0, bottom: 1, left: 1, right: 1},
        margin: 0,
        borderStyle: 'round',
        borderColor: color,
        width: Math.max(boxWidth, maxWidth + 2)
      }
    );
  });
  
  // Calculate layout for responsive display
  const effectiveWidth = Math.max(boxWidth, maxWidth + 4);
  const groupsPerRow = Math.max(1, Math.floor(termWidth / (effectiveWidth + 8)));
  
  // Render groups in rows based on terminal width
  for (let i = 0; i < groups.length; i += groupsPerRow) {
    const rowGroups = boxedGroups.slice(i, i + groupsPerRow);
    const groupLines = rowGroups.map(box => box.split('\n'));
    const rowHeight = Math.max(...groupLines.map(lines => lines.length));
    
    // Render each line of the row
    for (let j = 0; j < rowHeight; j++) {
      let rowOutput = '';
      for (const lines of groupLines) {
        const line = j < lines.length ? lines[j] : '';
        rowOutput += line.padEnd(effectiveWidth + 8, ' ');
      }
      console.log(rowOutput);
    }
    
    if (i + groupsPerRow < groups.length) {
      console.log();
    }
  }
}

// Main application flow
async function main() {
  displayTitle();
  
  // Collect names from user input
  const { namesInput } = await inquirer.prompt([
    {
      type: 'input',
      name: 'namesInput',
      message: chalk.cyan('Enter names') + chalk.dim(' (separated by commas)') + chalk.cyan(':'),
      validate: input => {
        const names = input.split(',').map(n => n.trim()).filter(n => n);
        if (names.length === 0) return 'Please enter at least one name';
        if (names.length === 1) return 'Please enter at least two names to shuffle';
        return true;
      },
      prefix: chalk.cyan('❯')
    }
  ]);
  
  const names = namesInput.split(',').map(name => name.trim()).filter(Boolean);
  
  // Provide visual feedback while processing
  const nameSpinner = ora('Processing names...').start();
  await setTimeout(500);
  nameSpinner.succeed(`${chalk.green(names.length)} names received!`);
  
  // Get desired number of groups
  const { numberOfGroups } = await inquirer.prompt([
    {
      type: 'number',
      name: 'numberOfGroups',
      message: chalk.cyan('Enter desired amount of groups:'),
      default: Math.min(Math.ceil(names.length / 3), Math.floor(names.length / 2)),
      validate: input => {
        const num = parseInt(input);
        if (isNaN(num) || num <= 0) return 'Please enter a positive number';
        if (num > names.length) return `Number of groups can't be larger than the number of names (${names.length})`;
        if (num === 1) return 'Please enter at least 2 groups for shuffling';
        return true;
      },
      prefix: chalk.cyan('❯')
    }
  ]);
  
  // Animated processing feedback (mostly for visual appeal)
  const spinner = ora({
    text: 'Initializing shuffle algorithm...',
    color: 'cyan'
  }).start();
  
  await setTimeout(700);
  spinner.text = 'Randomizing names...';
  await setTimeout(500);
  spinner.text = 'Balancing groups...';
  await setTimeout(300);
  spinner.succeed(chalk.green('Names shuffled successfully!'));
  
  // Create and display the randomized groups
  const groups = createGroups(names, numberOfGroups);
  displayGroups(groups);
}

// Start the application and handle any errors
main().catch(error => {
  console.error(chalk.red('An error occurred:'), error);
  process.exit(1);
}); 
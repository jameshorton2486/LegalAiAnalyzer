
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function pushToGithub() {
  try {
    // Initialize repository if not already initialized
    await execAsync('git init');
    
    // Add the remote repository
    await execAsync('git remote add origin https://github.com/jameshorton2486/LegalAiAnalyzer.git');
    
    // Add all files
    await execAsync('git add .');
    
    // Create commit
    await execAsync('git commit -m "Initial commit"');
    
    // Push to main branch
    await execAsync('git push -u origin main');
    
    console.log('Successfully pushed to GitHub');
    return true;
  } catch (error) {
    console.error('Error pushing to GitHub:', error);
    return false;
  }
}

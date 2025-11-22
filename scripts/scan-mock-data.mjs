#!/usr/bin/env node

/**
 * Scan All Roles for Mock Data Usage
 * Identifies which pages are using mock data vs real API calls
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m',
  gray: '\x1b[90m'
};

const log = (msg, color = 'reset') => console.log(colors[color] + msg + colors.reset);

const ROLES = {
  ADMIN: {
    path: '../src/features/admin',
    apiService: '../src/services/adminAPI.ts',
    color: 'blue'
  },
  TEACHER: {
    path: '../src/features/teachers',
    apiService: '../src/services/teacherAPI.ts',
    color: 'green'
  },
  STAFF: {
    path: '../src/features/staff',
    apiService: '../src/services/staffAPI.ts',
    color: 'cyan'
  },
  STUDENT: {
    path: '../src/features/students',
    apiService: '../src/services/studentAPI.ts',
    color: 'magenta'
  }
};

function findFiles(dir, extension = '.tsx') {
  const files = [];
  
  if (!fs.existsSync(dir)) return files;
  
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      files.push(...findFiles(fullPath, extension));
    } else if (item.endsWith(extension)) {
      files.push(fullPath);
    }
  }
  
  return files;
}

function analyzeFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const fileName = path.basename(filePath);
  
  const analysis = {
    file: fileName,
    path: filePath,
    hasMockData: false,
    hasAPICall: false,
    hasFallback: false,
    mockDataLines: [],
    apiCalls: [],
    patterns: {
      mockConst: /const\s+mock\w+/gi,
      mockData: /mockData|MOCK_DATA|mock_data/gi,
      staticArray: /const\s+\w+\s*=\s*\[[\s\S]*?\{/g,
      apiImport: /import.*from.*API/gi,
      apiCall: /\w+API\.\w+\(/gi,
      useState: /useState\(/gi,
      useEffect: /useEffect\(/gi,
      tryCatch: /try\s*\{[\s\S]*?catch/gi,
      fallback: /catch[\s\S]*?(\[\]|mock|fallback)/gi
    }
  };
  
  // Check for mock data patterns
  const mockConstMatches = content.match(analysis.patterns.mockConst);
  const mockDataMatches = content.match(analysis.patterns.mockData);
  const staticArrayMatches = content.match(analysis.patterns.staticArray);
  
  if (mockConstMatches || mockDataMatches) {
    analysis.hasMockData = true;
    analysis.mockDataLines = [
      ...(mockConstMatches || []),
      ...(mockDataMatches || [])
    ];
  }
  
  // Check for API imports and calls
  const apiImportMatches = content.match(analysis.patterns.apiImport);
  const apiCallMatches = content.match(analysis.patterns.apiCall);
  
  if (apiImportMatches || apiCallMatches) {
    analysis.hasAPICall = true;
    analysis.apiCalls = apiCallMatches || [];
  }
  
  // Check for fallback pattern (try-catch with mock data)
  const fallbackMatches = content.match(analysis.patterns.fallback);
  if (fallbackMatches) {
    analysis.hasFallback = true;
  }
  
  // Determine data source
  if (analysis.hasAPICall && analysis.hasFallback) {
    analysis.dataSource = 'API_WITH_FALLBACK';
  } else if (analysis.hasAPICall && !analysis.hasMockData) {
    analysis.dataSource = 'API_ONLY';
  } else if (analysis.hasMockData && !analysis.hasAPICall) {
    analysis.dataSource = 'MOCK_ONLY';
  } else if (analysis.hasMockData && analysis.hasAPICall) {
    analysis.dataSource = 'MIXED';
  } else {
    analysis.dataSource = 'NONE';
  }
  
  return analysis;
}

function analyzeAPIService(servicePath) {
  const fullPath = path.resolve(__dirname, servicePath);
  
  if (!fs.existsSync(fullPath)) {
    return { exists: false, methods: [] };
  }
  
  const content = fs.readFileSync(fullPath, 'utf8');
  
  // Extract exported functions
  const exportPattern = /export\s+(async\s+)?function\s+(\w+)/g;
  const constExportPattern = /export\s+const\s+(\w+)\s*=\s*(async\s*)?\(/g;
  
  const methods = [];
  let match;
  
  while ((match = exportPattern.exec(content)) !== null) {
    methods.push(match[2]);
  }
  
  while ((match = constExportPattern.exec(content)) !== null) {
    methods.push(match[1]);
  }
  
  return {
    exists: true,
    methods: methods,
    methodCount: methods.length
  };
}

function analyzeRole(roleName, roleConfig) {
  const fullPath = path.resolve(__dirname, roleConfig.path);
  
  log(`\n${'='.repeat(70)}`, roleConfig.color);
  log(`${roleName} MODULE ANALYSIS`, roleConfig.color);
  log('='.repeat(70), roleConfig.color);
  
  // Analyze API Service
  const apiService = analyzeAPIService(roleConfig.apiService);
  
  if (apiService.exists) {
    log(`\n📦 API Service: ${apiService.methodCount} methods available`, 'cyan');
    log(`   Methods: ${apiService.methods.slice(0, 10).join(', ')}${apiService.methods.length > 10 ? '...' : ''}`, 'gray');
  } else {
    log(`\n⚠️  API Service not found: ${roleConfig.apiService}`, 'yellow');
  }
  
  // Find all pages
  const pagesDir = path.join(fullPath, 'pages');
  const files = findFiles(pagesDir, '.tsx');
  
  if (files.length === 0) {
    log(`\n⚠️  No pages found in ${pagesDir}`, 'yellow');
    return;
  }
  
  log(`\n📄 Found ${files.length} pages\n`, 'blue');
  
  const summary = {
    total: files.length,
    apiOnly: 0,
    apiWithFallback: 0,
    mockOnly: 0,
    mixed: 0,
    none: 0
  };
  
  const results = [];
  
  for (const file of files) {
    const analysis = analyzeFile(file);
    results.push(analysis);
    
    let status = '';
    let statusColor = 'gray';
    
    switch (analysis.dataSource) {
      case 'API_WITH_FALLBACK':
        status = '✅ API + Fallback';
        statusColor = 'green';
        summary.apiWithFallback++;
        break;
      case 'API_ONLY':
        status = '✅ API Only';
        statusColor = 'green';
        summary.apiOnly++;
        break;
      case 'MOCK_ONLY':
        status = '❌ Mock Data Only';
        statusColor = 'red';
        summary.mockOnly++;
        break;
      case 'MIXED':
        status = '⚠️  Mixed (needs review)';
        statusColor = 'yellow';
        summary.mixed++;
        break;
      case 'NONE':
        status = '⚪ No data source';
        statusColor = 'gray';
        summary.none++;
        break;
    }
    
    log(`${status.padEnd(25)} ${analysis.file}`, statusColor);
    
    if (analysis.apiCalls.length > 0) {
      log(`   API: ${analysis.apiCalls.slice(0, 3).join(', ')}`, 'gray');
    }
    
    if (analysis.mockDataLines.length > 0 && analysis.dataSource === 'MOCK_ONLY') {
      log(`   Mock: ${analysis.mockDataLines.slice(0, 2).join(', ')}`, 'gray');
    }
  }
  
  // Print summary
  log(`\n📊 SUMMARY for ${roleName}:`, 'cyan');
  log(`   Total Pages: ${summary.total}`, 'blue');
  log(`   ✅ API + Fallback: ${summary.apiWithFallback}`, 'green');
  log(`   ✅ API Only: ${summary.apiOnly}`, 'green');
  log(`   ❌ Mock Only: ${summary.mockOnly}`, 'red');
  log(`   ⚠️  Mixed: ${summary.mixed}`, 'yellow');
  log(`   ⚪ No Data: ${summary.none}`, 'gray');
  
  const apiIntegrated = summary.apiOnly + summary.apiWithFallback;
  const percentage = ((apiIntegrated / summary.total) * 100).toFixed(1);
  
  if (percentage >= 80) {
    log(`   Integration: ${percentage}% ✅`, 'green');
  } else if (percentage >= 50) {
    log(`   Integration: ${percentage}% ⚠️`, 'yellow');
  } else {
    log(`   Integration: ${percentage}% ❌`, 'red');
  }
  
  return { summary, results };
}

function generateOverallReport(allResults) {
  log(`\n${'='.repeat(70)}`, 'cyan');
  log('OVERALL SYSTEM REPORT', 'cyan');
  log('='.repeat(70), 'cyan');
  
  let totalPages = 0;
  let totalAPIIntegrated = 0;
  let totalMockOnly = 0;
  let totalMixed = 0;
  
  log('\nRole-by-Role Summary:', 'blue');
  
  for (const [role, result] of Object.entries(allResults)) {
    if (!result || !result.summary) continue;
    
    const s = result.summary;
    totalPages += s.total;
    totalAPIIntegrated += (s.apiOnly + s.apiWithFallback);
    totalMockOnly += s.mockOnly;
    totalMixed += s.mixed;
    
    const integration = (((s.apiOnly + s.apiWithFallback) / s.total) * 100).toFixed(0);
    const color = integration >= 80 ? 'green' : integration >= 50 ? 'yellow' : 'red';
    
    log(`   ${role.padEnd(10)} ${integration}% integrated (${s.apiOnly + s.apiWithFallback}/${s.total} pages)`, color);
  }
  
  const overallIntegration = ((totalAPIIntegrated / totalPages) * 100).toFixed(1);
  
  log('\nOverall Statistics:', 'blue');
  log(`   Total Pages: ${totalPages}`, 'cyan');
  log(`   ✅ API Integrated: ${totalAPIIntegrated} (${overallIntegration}%)`, 'green');
  log(`   ❌ Mock Only: ${totalMockOnly}`, 'red');
  log(`   ⚠️  Mixed/Review: ${totalMixed}`, 'yellow');
  
  log('\nRecommendations:', 'yellow');
  
  for (const [role, result] of Object.entries(allResults)) {
    if (!result || !result.summary) continue;
    
    const mockOnlyPages = result.results.filter(r => r.dataSource === 'MOCK_ONLY');
    
    if (mockOnlyPages.length > 0) {
      log(`\n${role} - Pages needing API integration:`, 'yellow');
      mockOnlyPages.forEach(page => {
        log(`   • ${page.file}`, 'gray');
      });
    }
  }
  
  if (overallIntegration >= 90) {
    log('\n🎉 EXCELLENT! System is highly integrated with real data', 'green');
  } else if (overallIntegration >= 70) {
    log('\n👍 GOOD! Most pages are using real data', 'green');
  } else if (overallIntegration >= 50) {
    log('\n⚠️  MODERATE: Half of pages still using mock data', 'yellow');
  } else {
    log('\n❌ NEEDS WORK: Most pages are still using mock data', 'red');
  }
}

async function main() {
  console.log('\n');
  log('╔════════════════════════════════════════════════════════════════════╗', 'cyan');
  log('║          SYSTEM-WIDE MOCK DATA DETECTION SCAN                     ║', 'cyan');
  log('╚════════════════════════════════════════════════════════════════════╝', 'cyan');
  
  const allResults = {};
  
  for (const [roleName, roleConfig] of Object.entries(ROLES)) {
    allResults[roleName] = analyzeRole(roleName, roleConfig);
  }
  
  generateOverallReport(allResults);
  
  log('\n' + '='.repeat(70) + '\n', 'cyan');
}

main().catch(error => {
  log(`\n❌ Error: ${error.message}\n`, 'red');
  console.error(error);
  process.exit(1);
});

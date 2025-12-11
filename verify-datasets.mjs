#!/usr/bin/env node
/**
 * Script to verify which dataset IDs actually work with the data.gov.my APIs
 */

import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const OPENDOSM_BASE = 'https://api.data.gov.my/opendosm';
const DATA_CATALOGUE_BASE = 'https://api.data.gov.my/data-catalogue';

async function testDatasetId(id, baseUrl) {
    try {
        const url = `${baseUrl}?id=${id}&limit=1`;
        const response = await fetch(url);

        if (response.status === 404) {
            return { valid: false, status: 404 };
        }

        if (!response.ok) {
            return { valid: false, status: response.status };
        }

        const data = await response.json();
        return { valid: true, status: 200, sampleData: data };
    } catch (error) {
        return { valid: false, error: error.message };
    }
}

async function verifyDatasets() {
    const datasetsPath = join(__dirname, 'src', 'datasets.json');
    const datasets = JSON.parse(readFileSync(datasetsPath, 'utf-8'));

    const results = {
        opendosm: {
            valid: [],
            invalid: []
        },
        data_catalogue: {
            valid: [],
            invalid: []
        }
    };

    console.log('🔍 Testing OpenDOSM datasets...\n');
    for (const dataset of datasets.opendosm) {
        process.stdout.write(`Testing ${dataset.id}... `);
        const result = await testDatasetId(dataset.id, OPENDOSM_BASE);

        if (result.valid) {
            console.log('✅ VALID');
            results.opendosm.valid.push(dataset);
        } else {
            console.log(`❌ INVALID (${result.status || result.error})`);
            results.opendosm.invalid.push({ ...dataset, reason: result.status || result.error });
        }

        // Rate limiting: wait 100ms between requests
        await new Promise(resolve => setTimeout(resolve, 100));
    }

    console.log('\n🔍 Testing Data Catalogue datasets...\n');
    for (const dataset of datasets.data_catalogue) {
        process.stdout.write(`Testing ${dataset.id}... `);
        const result = await testDatasetId(dataset.id, DATA_CATALOGUE_BASE);

        if (result.valid) {
            console.log('✅ VALID');
            results.data_catalogue.valid.push(dataset);
        } else {
            console.log(`❌ INVALID (${result.status || result.error})`);
            results.data_catalogue.invalid.push({ ...dataset, reason: result.status || result.error });
        }

        await new Promise(resolve => setTimeout(resolve, 100));
    }

    // Print summary
    console.log('\n' + '='.repeat(60));
    console.log('SUMMARY');
    console.log('='.repeat(60));
    console.log(`\nOpenDOSM:`);
    console.log(`  ✅ Valid: ${results.opendosm.valid.length}`);
    console.log(`  ❌ Invalid: ${results.opendosm.invalid.length}`);
    console.log(`\nData Catalogue:`);
    console.log(`  ✅ Valid: ${results.data_catalogue.valid.length}`);
    console.log(`  ❌ Invalid: ${results.data_catalogue.invalid.length}`);

    if (results.opendosm.invalid.length > 0) {
        console.log(`\n❌ Invalid OpenDOSM IDs:`);
        results.opendosm.invalid.forEach(d => console.log(`  - ${d.id}: ${d.reason}`));
    }

    if (results.data_catalogue.invalid.length > 0) {
        console.log(`\n❌ Invalid Data Catalogue IDs:`);
        results.data_catalogue.invalid.forEach(d => console.log(`  - ${d.id}: ${d.reason}`));
    }

    // Save verified datasets
    const verifiedDatasets = {
        opendosm: results.opendosm.valid,
        data_catalogue: results.data_catalogue.valid
    };

    const verifiedPath = join(__dirname, 'datasets-verified.json');
    writeFileSync(verifiedPath, JSON.stringify(verifiedDatasets, null, 4));
    console.log(`\n✅ Verified datasets saved to: ${verifiedPath}`);

    return results;
}

verifyDatasets().catch(console.error);

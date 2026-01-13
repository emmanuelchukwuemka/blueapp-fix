// Script to verify that the app is configured to use the remote server
import fs from 'fs';

console.log('🔍 Verifying app configuration...\n');

// Check the API configuration
const configContent = fs.readFileSync('./src/config/index.js', 'utf8');
const baseUrlMatch = configContent.match(/BASE_URL:\s*'([^']+)'/);
const prodUrlMatch = configContent.match(/PRODUCTION_URL:\s*'([^']+)'/);

console.log('🌐 API Configuration:');
console.log(`   BASE_URL: ${baseUrlMatch ? baseUrlMatch[1] : 'NOT FOUND'}`);
console.log(`   PRODUCTION_URL: ${prodUrlMatch ? prodUrlMatch[1] : 'NOT FOUND'}`);

// Check app.json updates configuration
const appJson = JSON.parse(fs.readFileSync('./app.json', 'utf8'));
const updatesEnabled = appJson.expo.updates && appJson.expo.updates.enabled;

console.log('\n📦 App Updates Configuration:');
console.log(`   Updates enabled: ${updatesEnabled === undefined ? 'default (true)' : updatesEnabled}`);

// Check eas.json build configuration
const easJson = JSON.parse(fs.readFileSync('./eas.json', 'utf8'));
const buildType = easJson.build.production.android.buildType;

console.log('\n📱 Build Configuration:');
console.log(`   Build type: ${buildType}`);

// Results
console.log('\n✅ Verification Results:');
const isUsingRemoteServer = baseUrlMatch && baseUrlMatch[1].includes('myfigpoints.com');
const hasUpdatesDisabled = updatesEnabled === false;
const isBuildingApk = buildType === 'apk';

console.log(`   Using remote server: ${isUsingRemoteServer ? 'YES' : 'NO'}`);
console.log(`   Updates disabled: ${hasUpdatesDisabled ? 'YES' : 'NO'}`);
console.log(`   Building APK: ${isBuildingApk ? 'YES' : 'NO'}`);

if (isUsingRemoteServer && hasUpdatesDisabled && isBuildingApk) {
    console.log('\n🎉 SUCCESS: The app is correctly configured to use the remote server in the APK!');
} else {
    console.log('\n❌ ISSUE: The configuration needs to be fixed before building the APK.');
}
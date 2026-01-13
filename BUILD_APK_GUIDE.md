# Building APK for MyFigApp

## Current Configuration
The app is already configured to build an APK with the following settings:

- **Production server**: `https://myfigpoints.com`
- **Build type**: APK (set in `eas.json`)
- **Updates disabled**: Confirmed in `app.json`

## Option 1: EAS Build (Recommended)
If network issues persist, try the following:

1. Ensure you have a stable internet connection
2. Make sure your EAS account is properly set up:
   ```bash
   npx expo login
   ```
3. Run the build command again:
   ```bash
   npx eas build --platform android --profile production
   ```

## Option 2: Local Build Setup on Windows

### Step 1: Install Android Studio
1. Download and install Android Studio from https://developer.android.com/studio
2. During installation, make sure to install:
   - Android SDK
   - Android SDK Platform-Tools
   - Android SDK Build-Tools

### Step 2: Configure Environment Variables
Add the following to your system PATH:
- `%LOCALAPPDATA%\Android\Sdk\platform-tools`
- `%LOCALAPPDATA%\Android\Sdk\tools`
- `%LOCALAPPDATA%\Android\Sdk\tools\bin`

### Step 3: Build the APK
```bash
# First, prebuild the project
npx expo prebuild --platform android

# Then build locally
cd android
./gradlew assembleRelease
```

## Option 3: Alternative Build Method

If EAS Build continues to fail due to network issues, you can try:

```bash
# Clear EAS cache
npx eas build:clean

# Try building again with verbose logging
npx eas build --platform android --profile production --verbose
```

## Troubleshooting

### If you encounter certificate or SSL issues:
- Check your firewall settings
- Temporarily disable antivirus software that might interfere with connections
- Try using a different internet connection

### For authentication issues:
- Log out and back in to EAS:
  ```bash
  npx expo logout
  npx expo login
  ```

## Important Notes
- Your app is already configured correctly for production deployment
- The API endpoints are correctly pointing to the production server
- The app.json has updates disabled, which is correct for standalone APK builds
- The eas.json is configured for APK production builds
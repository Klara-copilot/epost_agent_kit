# Deployment Guide

**Created by**: Phuong Doan
**Last Updated**: 2026-02-25
**Version**: 0.1.0

## Environment Variables

### Required Variables

#### CLI Tool
```bash
# None required for basic usage
# Optional: Custom configuration paths
EPOST_KIT_CONFIG_DIR=~/.epost-kit
EPOST_KIT_CACHE_DIR=~/.cache/epost-kit
```

#### GitHub Integration (Optional)
```bash
# For GitHub-based package installations
GITHUB_TOKEN=ghp_xxxxxxxxxxxxx  # Personal access token
```

#### Platform-Specific

**Web Platform**:
```bash
# Next.js
NODE_ENV=development|production
NEXT_PUBLIC_API_URL=https://api.example.com
```

**iOS Platform**:
```bash
# Xcode build settings managed via xcconfig files
# No environment variables needed for basic development
```

**Android Platform**:
```bash
# Gradle properties
ANDROID_HOME=/path/to/android/sdk
```

**Backend Platform**:
```bash
# WildFly / Jakarta EE
DATABASE_URL=postgresql://localhost:5432/dbname
DATABASE_USER=postgres
DATABASE_PASSWORD=secret
JWT_SECRET=your-secret-key
```

### Environment File Structure

```
project-root/
├── .env                    # Local development (gitignored)
├── .env.example            # Example template (committed)
├── .env.production         # Production overrides (gitignored)
└── .env.test               # Test environment (committed)
```

## Build Process

### CLI Tool Build

#### Prerequisites
```bash
# Node.js version check
node --version  # Should be >= 20.0.0 (LTS recommended)
npm --version   # Should be >= 10.0.0
```

#### Build Steps

**macOS/Linux**:
```bash
cd epost-agent-kit

# 1. Install dependencies
npm install

# 2. Run type checking
npm run typecheck

# 3. Run linting
npm run lint

# 4. Run tests
npm test

# 5. Build
npm run build

# 6. Link for local testing
npm link

# 7. Verify
npx epost-kit --version
```

**Windows PowerShell**:
```powershell
cd epost-agent-kit

# 1. Install dependencies
npm install

# 2. Build process
npm run typecheck
npm run lint
npm test
npm run build

# 3. Link globally
npm link

# 4. Verify
npx epost-kit --version
```

**Windows CMD**:
```cmd
cd epost-agent-kit
npm install
npm run build
npm link
npx epost-kit --version
```

### Platform Builds

#### Web Platform (Next.js)
```bash
# Development
cd web-project
npm install
npm run dev        # Start dev server (localhost:3000)

# Production build
npm run build      # Generates .next/ directory
npm start          # Start production server

# Docker build
docker build -t web-app .
docker run -p 3000:3000 web-app
```

#### iOS Platform (Swift/Xcode)
```bash
# Via Xcode GUI
open MyApp.xcworkspace
# Product > Build (Cmd+B)
# Product > Test (Cmd+U)

# Via command line
cd ios-project
xcodebuild -workspace MyApp.xcworkspace \
           -scheme MyApp \
           -sdk iphonesimulator \
           -destination 'platform=iOS Simulator,name=iPhone 16,OS=latest' \
           build

# Run tests
xcodebuild test -workspace MyApp.xcworkspace \
                -scheme MyApp \
                -sdk iphonesimulator \
                -destination 'platform=iOS Simulator,name=iPhone 16,OS=latest'
```

#### Android Platform (Kotlin/Gradle)
```bash
# Development
cd android-project
./gradlew assembleDebug

# Production build
./gradlew assembleRelease

# Run tests
./gradlew test
./gradlew connectedAndroidTest  # Instrumented tests
```

#### Backend Platform (Java EE/Maven)
```bash
# Development
cd backend-project
mvn clean install

# Run WildFly locally
# 1. Download WildFly 26.1
# 2. Deploy WAR file
cp target/myapp.war $WILDFLY_HOME/standalone/deployments/

# Run tests
mvn test                 # Unit tests
mvn verify               # Integration tests
```

## Deployment Platforms

### 1. npm Registry (CLI Tool)

#### Preparation
```bash
# 1. Update version in package.json
{
  "version": "0.2.0"  # Semantic versioning
}

# 2. Update CHANGELOG.md
# 3. Commit changes
git add .
git commit -m "chore: release v0.2.0"
git tag v0.2.0

# 4. Run pre-publish checks
npm run prepublishOnly  # Runs typecheck, lint, test, build
```

#### Publishing
```bash
# Login to npm
npm login

# Publish
npm publish

# Verify
npm view epost-kit
```

#### Post-Publish
```bash
# Push to git
git push origin main
git push origin v0.2.0

# Create GitHub release
gh release create v0.2.0 \
  --title "v0.2.0" \
  --notes "Release notes here"
```

### 2. GitHub Releases (Installation Scripts)

#### Create Release Package
```bash
# 1. Create release directory
mkdir -p releases/v0.2.0

# 2. Copy installation scripts
cp install-macos.sh releases/v0.2.0/
cp install.ps1 releases/v0.2.0/
cp install.cmd releases/v0.2.0/

# 3. Create archive
tar -czf epost-kit-v0.2.0.tar.gz releases/v0.2.0/
```

#### Upload to GitHub
```bash
# Using GitHub CLI
gh release create v0.2.0 \
  --title "v0.2.0" \
  --notes "Installation scripts and CLI tool" \
  epost-kit-v0.2.0.tar.gz
```

### 3. Vercel (Web Platform)

#### Setup
```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login
```

#### Deployment
```bash
# Development preview
cd web-project
vercel

# Production
vercel --prod
```

#### Configuration (`vercel.json`)
```json
{
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "env": {
    "NODE_ENV": "production"
  }
}
```

### 4. App Store (iOS Platform)

#### Preparation
```bash
# 1. Update version and build number
# In Xcode: General > Identity > Version & Build

# 2. Archive build
# Product > Archive

# 3. Validate archive
# Window > Organizer > Distribute App > Validate
```

#### Upload
```bash
# Via Xcode Organizer
# Window > Organizer > Distribute App > App Store Connect

# Or via command line
xcodebuild archive \
  -workspace MyApp.xcworkspace \
  -scheme MyApp \
  -archivePath build/MyApp.xcarchive

xcodebuild -exportArchive \
  -archivePath build/MyApp.xcarchive \
  -exportPath build \
  -exportOptionsPlist ExportOptions.plist

# Upload to App Store Connect (using notarytool, altool is deprecated)
xcrun notarytool submit build/MyApp.ipa \
  --apple-id username@example.com \
  --team-id TEAM_ID \
  --password app-specific-password \
  --wait
```

### 5. Google Play (Android Platform)

#### Preparation
```bash
# 1. Update version in build.gradle
android {
  defaultConfig {
    versionCode 2
    versionName "0.2.0"
  }
}

# 2. Generate signed APK/AAB
cd android-project
./gradlew bundleRelease
```

#### Upload
```bash
# Via Google Play Console (Manual)
# 1. Go to https://play.google.com/console
# 2. Select app
# 3. Release > Production > Create new release
# 4. Upload AAB file

# Or via fastlane (Automated)
fastlane supply --aab app/build/outputs/bundle/release/app-release.aab
```

### 6. GCP Cloud Run (Backend Platform)

#### Containerization
```dockerfile
# Dockerfile
FROM jboss/wildfly:26.1.0.Final

# Copy WAR file
COPY target/myapp.war /opt/jboss/wildfly/standalone/deployments/

# Expose port
EXPOSE 8080

# Start WildFly
CMD ["/opt/jboss/wildfly/bin/standalone.sh", "-b", "0.0.0.0"]
```

#### Build and Push
```bash
# Build Docker image
docker build -t gcr.io/PROJECT_ID/myapp:v0.2.0 .

# Push to GCP Container Registry
docker push gcr.io/PROJECT_ID/myapp:v0.2.0
```

#### Deploy to Cloud Run
```bash
gcloud run deploy myapp \
  --image gcr.io/PROJECT_ID/myapp:v0.2.0 \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars DATABASE_URL=$DATABASE_URL
```

## CI/CD Configuration

### GitHub Actions

#### CLI Tool Workflow (`.github/workflows/cli.yml`)
```yaml
name: CLI Build and Test

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Install dependencies
        run: npm install

      - name: Type check
        run: npm run typecheck

      - name: Lint
        run: npm run lint

      - name: Test
        run: npm test

      - name: Build
        run: npm run build

      - name: Upload artifacts
        uses: actions/upload-artifact@v4
        with:
          name: dist
          path: dist/
```

#### Web Platform Workflow
```yaml
name: Web Build and Deploy

on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Install dependencies
        run: npm install

      - name: Build
        run: npm run build

      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'
```

#### iOS Platform Workflow
```yaml
name: iOS Build and Test

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: macos-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Xcode
        uses: maxim-lobanov/setup-xcode@v1
        with:
          xcode-version: '16.0'

      - name: Build
        run: |
          xcodebuild build \
            -workspace MyApp.xcworkspace \
            -scheme MyApp \
            -sdk iphonesimulator

      - name: Test
        run: |
          xcodebuild test \
            -workspace MyApp.xcworkspace \
            -scheme MyApp \
            -sdk iphonesimulator \
            -destination 'platform=iOS Simulator,name=iPhone 16'
```

#### Android Platform Workflow
```yaml
name: Android Build and Test

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-java@v4
        with:
          java-version: '11'
          distribution: 'temurin'

      - name: Build
        run: ./gradlew assembleDebug

      - name: Test
        run: ./gradlew test
```

#### Backend Platform Workflow (GCP)
```yaml
name: Backend Deploy to Cloud Run

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-java@v4
        with:
          java-version: '11'
          distribution: 'temurin'

      - name: Build with Maven
        run: mvn clean package

      - name: Setup Cloud SDK
        uses: google-github-actions/setup-gcloud@v2

      - name: Build Docker image
        run: |
          docker build -t gcr.io/${{ secrets.GCP_PROJECT }}/myapp:${{ github.sha }} .
          docker push gcr.io/${{ secrets.GCP_PROJECT }}/myapp:${{ github.sha }}

      - name: Deploy to Cloud Run
        run: |
          gcloud run deploy myapp \
            --image gcr.io/${{ secrets.GCP_PROJECT }}/myapp:${{ github.sha }} \
            --platform managed \
            --region us-central1
```

## Rollback Procedures

### CLI Tool Rollback
```bash
# Publish previous version
npm unpublish epost-kit@0.2.0
npm publish  # Publishes 0.1.0 as latest

# Or deprecate bad version
npm deprecate epost-kit@0.2.0 "Critical bug, use 0.1.0"
```

### Web Platform Rollback (Vercel)
```bash
# Via Vercel dashboard
# Deployments > Select previous > Promote to Production

# Via CLI
vercel rollback
```

### iOS Rollback (App Store)
```bash
# Via App Store Connect
# 1. Go to app page
# 2. App Store > Submit a New Version
# 3. Select previous build
# 4. Submit for review

# Note: Cannot rollback immediately; requires review
```

### Android Rollback (Google Play)
```bash
# Via Play Console
# Release > Production > Manage track > Rollback

# Restores previous version immediately
```

### Backend Rollback (Cloud Run)
```bash
# Deploy previous revision
gcloud run deploy myapp \
  --image gcr.io/PROJECT_ID/myapp:v0.1.0 \
  --platform managed \
  --region us-central1
```

## Monitoring and Health Checks

### CLI Tool Health
```bash
# Verify installation
npx epost-kit --version

# Check configuration
npx epost-kit status

# Validate packages
npx epost-kit doctor
```

### Web Platform Health
```bash
# Health check endpoint
curl https://app.example.com/api/health

# Expected response
{"status": "ok", "version": "0.2.0"}
```

### Backend Health
```bash
# Health check endpoint
curl https://api.example.com/health

# WildFly admin console
http://localhost:9990/console
```

## Backup and Disaster Recovery

### Configuration Backup
```bash
# Backup before installation
npx epost-kit install --backup

# Restore from backup
npx epost-kit restore --from ./backup-20260209-143000.tar.gz

# List backups
npx epost-kit backup list
```

### Database Backup (Backend)
```bash
# PostgreSQL backup
pg_dump -h localhost -U postgres mydb > backup.sql

# Restore
psql -h localhost -U postgres mydb < backup.sql
```

### Git Repository Backup
```bash
# Clone with full history
git clone --mirror https://github.com/org/repo.git
```

## Security Checklist

- [ ] Environment variables secured (no commits)
- [ ] API keys rotated regularly
- [ ] SSL/TLS certificates valid
- [ ] Dependencies updated (npm audit, gradle dependencies)
- [ ] Access logs reviewed
- [ ] Backup systems tested
- [ ] Rollback procedures verified
- [ ] CI/CD secrets encrypted
- [ ] Production access restricted
- [ ] Monitoring alerts configured

## Troubleshooting

### Common Issues

**Issue**: "Permission denied" during install
```bash
# Solution: Use sudo or fix npm permissions
sudo npm install -g epost-kit
# Or fix permissions: https://docs.npmjs.com/resolving-eacces-permissions-errors-when-installing-packages-globally
```

**Issue**: "Module not found" after install
```bash
# Solution: Rebuild node modules
rm -rf node_modules package-lock.json
npm install
```

**Issue**: Build fails with TypeScript errors
```bash
# Solution: Clean and rebuild
npm run clean
npm run build
```

**Issue**: Tests failing in CI but passing locally
```bash
# Solution: Check Node version consistency
node --version  # Match CI version
```

## Related Documents

- [docs/system-architecture.md](system-architecture.md) - Architecture details
- [docs/code-standards.md](code-standards.md) - Coding conventions
- [README.md](../README.md) - Quick start guide

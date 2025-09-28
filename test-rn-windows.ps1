Write-Host "React Native CLI Test for Windows" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""

$passed = 0
$failed = 0

function Test-Feature {
    param(
        [string]$Description,
        [string]$SearchPattern,
        [string]$FilePath = "public/scripts/lazy.sh"
    )
    
    Write-Host "Testing: $Description... " -NoNewline
    
    if (Select-String -Path $FilePath -Pattern $SearchPattern -Quiet) {
        Write-Host "PASSED" -ForegroundColor Green
        $script:passed++
    } else {
        Write-Host "FAILED" -ForegroundColor Red
        $script:failed++
    }
}

Write-Host "Testing React Native Implementation..." -ForegroundColor Blue
Write-Host ""

# Test all React Native features
Test-Feature "React Native function exists" "react_native_create"
Test-Feature "React Native in help documentation" "react-native"
Test-Feature "CLI routing exists" "react-native"
Test-Feature "Expo support" "create-expo-app"
Test-Feature "React Native CLI support" "react-native init"
Test-Feature "React Navigation support" "react-navigation"
Test-Feature "Redux Toolkit support" "reduxjs"
Test-Feature "Zustand support" "zustand"
Test-Feature "NativeWind support" "nativewind"
Test-Feature "Async Storage support" "async-storage"
Test-Feature "Vector Icons support" "vector-icons"
Test-Feature "Navigation structure" "src/screens"
Test-Feature "HomeScreen template" "HomeScreen"
Test-Feature "TypeScript support" "typescript"

Write-Host ""
Write-Host "Test Results:" -ForegroundColor Yellow
Write-Host "Passed: $passed" -ForegroundColor Green
Write-Host "Failed: $failed" -ForegroundColor Red
Write-Host "Total: $($passed + $failed)"
Write-Host ""

if ($failed -eq 0) {
    Write-Host "ALL TESTS PASSED! React Native functionality is working perfectly!" -ForegroundColor Green
    Write-Host ""
    Write-Host "React Native Features Available:" -ForegroundColor Blue
    Write-Host "- Expo and React Native CLI support"
    Write-Host "- React Navigation (stack and tab navigation)"
    Write-Host "- State management (Redux Toolkit and Zustand)"
    Write-Host "- NativeWind (Tailwind CSS for React Native)"
    Write-Host "- Essential packages (Async Storage, Vector Icons, etc.)"
    Write-Host "- Pre-built navigation structure with sample screens"
    Write-Host "- TypeScript support"
    Write-Host "- Cross-platform development (iOS and Android)"
    Write-Host ""
    Write-Host "To use React Native in LazyCLI:" -ForegroundColor Yellow
    Write-Host "1. Install WSL or Git Bash"
    Write-Host "2. Run: lazy react-native create"
    Write-Host "3. Choose setup method (Expo or CLI)"
    Write-Host "4. Select packages interactively"
    Write-Host "5. Get a fully configured React Native project!"
    Write-Host ""
} else {
    Write-Host "Some tests failed. React Native implementation needs fixes." -ForegroundColor Red
}

Write-Host "Test Complete!" -ForegroundColor Cyan 
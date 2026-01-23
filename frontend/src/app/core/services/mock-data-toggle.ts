/**
 * Mock Data Generator for Testing
 * 
 * This file provides easy access to switch between mock and real backend
 * Perfect for frontend development without backend running
 */

export class MockDataToggle {
  /**
   * Enable mock data in the console:
   * 
   * import { MockDataToggle } from '@app/core/services/mock-data-toggle';
   * MockDataToggle.enableMockData(apiService);
   */
  
  static enableMockData(apiService: any): void {
    apiService.setUseMockData(true);
    console.log('✅ Mock data ENABLED - using local mock data');
  }

  static disableMockData(apiService: any): void {
    apiService.setUseMockData(false);
    console.log('🔗 Mock data DISABLED - using real backend at http://localhost:3000');
  }

  static toggleMockData(apiService: any): void {
    const current = apiService.isMockDataEnabled();
    apiService.setUseMockData(!current);
    console.log(`Mock data ${!current ? 'ENABLED' : 'DISABLED'}`);
  }

  static status(apiService: any): void {
    const enabled = apiService.isMockDataEnabled();
    console.log(`\n📊 Current Status:`);
    console.log(`   Mock Data: ${enabled ? '✅ ENABLED' : '❌ DISABLED'}`);
    console.log(`   API URL: ${enabled ? 'Memory/Local' : 'http://localhost:3000'}\n`);
  }
}

/**
 * Usage in browser console:
 * 
 * // Get the ApiService
 * const apiService = ng.getComponent(document.querySelector('app-root')).injector.get(ApiService);
 * 
 * // Toggle mock data
 * MockDataToggle.enableMockData(apiService);
 * MockDataToggle.disableMockData(apiService);
 * MockDataToggle.toggleMockData(apiService);
 * MockDataToggle.status(apiService);
 */

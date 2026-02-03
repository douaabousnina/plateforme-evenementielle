import { Component, signal, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { BarcodeFormat } from '@zxing/library';
import { AccessService } from '../../services/access.service';
import { CheckInResponse } from '../../models/access.model';
import { HeaderComponent } from '../../../../shared/components/header/header.component';
import { SideBar } from '../../../../organizer/components/side-bar/side-bar';

@Component({
  selector: 'app-qr-scanner',
  
  imports: [CommonModule, FormsModule, ZXingScannerModule, SideBar],
  templateUrl: './qr-scanner.page.html',
  styleUrls: ['./qr-scanner.page.css']
})
export class QrScannerComponent {
  private readonly accessService = inject(AccessService);
  private readonly cdr = inject(ChangeDetectorRef);

  hasDevices = signal(false);
  hasPermission = signal(false);
  availableDevices = signal<MediaDeviceInfo[]>([]);
  currentDevice = signal<MediaDeviceInfo | undefined>(undefined);
  
  isScanning = signal(false);
  scanResult = signal<CheckInResponse | null>(null);
  scanError = signal<string | null>(null);
  
  // Scanner settings - Using a valid UUID for the controller
  scannedBy = '123e4567-e89b-12d3-a456-426614174000'; // Mock controller UUID
  location = 'Main Entrance';
  
  // QR Code format
  readonly allowedFormats = [BarcodeFormat.QR_CODE];

  onCamerasFound(devices: MediaDeviceInfo[]): void {
    this.availableDevices.set(devices);
    this.hasDevices.set(Boolean(devices && devices.length));
    
    // Select the back camera by default if available
    const backCamera = devices.find(device => 
      /back|rear|environment/gi.test(device.label)
    );
    this.currentDevice.set(backCamera || devices[0]);
  }

  onCameraChange(device: MediaDeviceInfo): void {
    this.currentDevice.set(device);
  }

  onHasPermission(has: boolean): void {
    this.hasPermission.set(has);
  }

  onScanSuccess(qrData: string): void {
    if (this.isScanning()) {
      return; // Prevent multiple scans
    }

    alert('QR Detected: ' + qrData.substring(0, 50));
    console.log('QR Code scanned:', qrData);
    this.isScanning.set(true);
    this.scanError.set(null);
    this.scanResult.set(null);

    // Call backend to validate and check in
    this.accessService.checkIn(qrData, this.scannedBy, this.location, this.getDeviceInfo())
      .subscribe({
        next: (response: CheckInResponse) => {
          console.log('Check-in response:', response);
          this.scanResult.set(response);
          this.isScanning.set(false);
          this.cdr.detectChanges();
          
          // Auto-reset after 6 seconds
          setTimeout(() => {
            this.scanResult.set(null);
            this.cdr.detectChanges();
          }, 6000);
        },
        error: (error: any) => {
          console.error('Check-in error:', error);
          this.scanError.set(error.error?.message || error.message || 'Erreur lors du scan. Vérifiez que le backend est accessible.');
          this.isScanning.set(false);
          this.cdr.detectChanges();
          
          // Auto-reset error after 6 seconds
          setTimeout(() => {
            this.scanError.set(null);
            this.cdr.detectChanges();
          }, 6000);
        }
      });
  }

  onScanError(error: any): void {
    console.error('Scanner error:', error);
  }

  getDeviceInfo(): string {
    return `${navigator.userAgent} - ${navigator.platform}`;
  }

  getStatusClass(): string {
    const result = this.scanResult();
    if (!result) return '';
    
    switch (result.status) {
      case 'valid':
        return 'success';
      case 'already_scanned':
        return 'warning';
      case 'invalid':
      case 'expired':
      case 'fake':
        return 'error';
      default:
        return '';
    }
  }

  getStatusIcon(): string {
    const result = this.scanResult();
    if (!result) return '';
    
    switch (result.status) {
      case 'valid':
        return 'check_circle';
      case 'already_scanned':
        return 'warning';
      case 'invalid':
      case 'expired':
      case 'fake':
        return 'cancel';
      default:
        return 'info';
    }
  }

  getStatusText(): string {
    const result = this.scanResult();
    if (!result) return '';
    
    switch (result.status) {
      case 'valid':
        return 'Billet Valide';
      case 'already_scanned':
        return 'Déjà Scanné';
      case 'invalid':
        return 'Billet Invalide';
      case 'expired':
        return 'Billet Expiré';
      case 'fake':
        return 'Faux Billet';
      default:
        return result.status;
    }
  }
}

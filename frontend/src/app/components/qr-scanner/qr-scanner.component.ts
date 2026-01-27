import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { BarcodeFormat } from '@zxing/library';
import { AccessService } from '../../services/access.service';
import { CheckInResponse } from '../../models/access.model';

@Component({
  selector: 'app-qr-scanner',
  standalone: true,
  imports: [CommonModule, FormsModule, ZXingScannerModule],
  templateUrl: './qr-scanner.component.html',
  styleUrls: ['./qr-scanner.component.css']
})
export class QrScannerComponent implements OnInit {
  hasDevices = false;
  hasPermission = false;
  availableDevices: MediaDeviceInfo[] = [];
  currentDevice?: MediaDeviceInfo;
  
  isScanning = false;
  scanResult: CheckInResponse | null = null;
  scanError: string | null = null;
  
  // Scanner settings
  scannedBy = 'Controller-001'; // Mock controller ID
  location = 'Main Entrance';
  
  // QR Code format
  allowedFormats = [BarcodeFormat.QR_CODE];
  
  constructor(
    private readonly accessService: AccessService,
    private readonly cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // Component will initialize camera access when template loads
  }

  onCamerasFound(devices: MediaDeviceInfo[]): void {
    this.availableDevices = devices;
    this.hasDevices = Boolean(devices && devices.length);
    
    // Select the back camera by default if available
    const backCamera = devices.find(device => 
      /back|rear|environment/gi.test(device.label)
    );
    this.currentDevice = backCamera || devices[0];
  }

  onCameraChange(device: MediaDeviceInfo): void {
    this.currentDevice = device;
  }

  onHasPermission(has: boolean): void {
    this.hasPermission = has;
  }

  onScanSuccess(qrData: string): void {
    if (this.isScanning) {
      return; // Prevent multiple scans
    }

    alert('QR Detected: ' + qrData.substring(0, 50));
    console.log('QR Code scanned:', qrData);
    this.isScanning = true;
    this.scanError = null;
    this.scanResult = null;

    // Call backend to validate and check in
    this.accessService.checkIn(qrData, this.scannedBy, this.location, this.getDeviceInfo())
      .subscribe({
        next: (response) => {
          console.log('Check-in response:', response);
          this.scanResult = response;
          this.isScanning = false;
          this.cdr.detectChanges();
          
          // Auto-reset after 6 seconds
          setTimeout(() => {
            this.scanResult = null;
            this.cdr.detectChanges();
          }, 6000);
        },
        error: (error) => {
          console.error('Check-in error:', error);
          this.scanError = error.error?.message || error.message || 'Erreur lors du scan. Vérifiez que le backend est accessible.';
          this.isScanning = false;
          this.cdr.detectChanges();
          
          // Auto-reset error after 6 seconds
          setTimeout(() => {
            this.scanError = null;
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
    if (!this.scanResult) return '';
    
    switch (this.scanResult.status) {
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
    if (!this.scanResult) return '';
    
    switch (this.scanResult.status) {
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
    if (!this.scanResult) return '';
    
    switch (this.scanResult.status) {
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
        return this.scanResult.status;
    }
  }
}

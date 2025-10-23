'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Html5Qrcode, Html5QrcodeSupportedFormats } from 'html5-qrcode';
import styles from './BarcodeScanner.module.css';

export default function BarcodeScanner() {
  const router = useRouter();
  const [barcode, setBarcode] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isScanning, setIsScanning] = useState(false);
  const [isRestarting, setIsRestarting] = useState(false);
  const [cameras, setCameras] = useState<Array<{id: string, label: string}>>([]);
  const [selectedCamera, setSelectedCamera] = useState<string>('');
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const scannerId = 'qr-reader';

  useEffect(() => {
    Html5Qrcode.getCameras().then(devices => {
      if (devices && devices.length) {
        setCameras(devices.map(d => ({ id: d.id, label: d.label })));
        const backCamera = devices.find(d => d.label.toLowerCase().includes('back') || d.label.toLowerCase().includes('rear'));
        setSelectedCamera(backCamera?.id || devices[0].id);
      }
    }).catch(() => {});

    return () => {
      const scanner = scannerRef.current;
      if (scanner) {
        scanner.stop().catch(() => {});
      }
    };
  }, []);

  const stopScanning = async () => {
    if (scannerRef.current && isScanning) {
      try {
        await scannerRef.current.stop();
      } catch {}
    }
    setIsScanning(false);
  };

  const startScanning = async () => {
    setError('');

    if (!selectedCamera) {
      setError('Камера не выбрана');
      return;
    }

    setIsScanning(true);
    await new Promise(resolve => setTimeout(resolve, 100));

    try {
      if (!scannerRef.current) {
        scannerRef.current = new Html5Qrcode(scannerId);
      }

      const config = {
        fps: 10,
        qrbox: { width: 350, height: 250 },
        aspectRatio: 1.777778,
        formatsToSupport: [
          Html5QrcodeSupportedFormats.QR_CODE,
          Html5QrcodeSupportedFormats.EAN_13,
          Html5QrcodeSupportedFormats.EAN_8,
          Html5QrcodeSupportedFormats.CODE_128,
          Html5QrcodeSupportedFormats.CODE_39,
          Html5QrcodeSupportedFormats.CODE_93,
          Html5QrcodeSupportedFormats.UPC_A,
          Html5QrcodeSupportedFormats.UPC_E,
          Html5QrcodeSupportedFormats.DATA_MATRIX,
          Html5QrcodeSupportedFormats.AZTEC,
          Html5QrcodeSupportedFormats.PDF_417,
          Html5QrcodeSupportedFormats.ITF,
          Html5QrcodeSupportedFormats.CODABAR
        ],
        videoConstraints: {
          facingMode: { ideal: "environment" },
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      };

      await scannerRef.current.start(
        selectedCamera,
        config,
        (decodedText) => {
          setBarcode(decodedText);
          stopScanning();
          // Navigate to product page after a short delay
          setTimeout(() => {
            router.push(`/product/${decodedText}`);
          }, 500);
        },
        () => {}
      );

    } catch (err) {
      setError(`Не удалось запустить камеру: ${err instanceof Error ? err.message : String(err)}`);
      setIsScanning(false);
      setIsRestarting(false);
    }
  };

  const reset = async () => {
    setIsRestarting(true);
    setBarcode('');
    setError('');
    
    if (scannerRef.current) {
      try {
        const state = scannerRef.current.getState();
        
        if (state === 2) {
          await scannerRef.current.stop();
          await new Promise(resolve => setTimeout(resolve, 100));
        }
        
        await scannerRef.current.clear();
      } catch {}
    }
    
    scannerRef.current = null;
    setIsScanning(false);
    
    setTimeout(async () => {
      await startScanning();
      setIsRestarting(false);
    }, 300);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Сканер штрих-кодов</h1>

      {/* Выбор камеры */}
      {cameras.length > 1 && !isScanning && !barcode && !isRestarting && (
        <div style={{ marginBottom: '20px' }}>
          <label htmlFor="camera-select" style={{ marginRight: '10px' }}>
            Камера:
          </label>
          <select
            id="camera-select"
            value={selectedCamera}
            onChange={(e) => setSelectedCamera(e.target.value)}
            style={{
              padding: '8px',
              borderRadius: '5px',
              border: '1px solid #ccc'
            }}
          >
            {cameras.map(camera => (
              <option key={camera.id} value={camera.id}>
                {camera.label}
              </option>
            ))}
          </select>
        </div>
      )}

      {!isScanning && !barcode && !isRestarting && (
        <button 
          className={styles.button} 
          onClick={startScanning}
          disabled={!selectedCamera}
        >
          Начать сканирование
        </button>
      )}

      {isRestarting && (
        <div style={{ padding: '20px', color: '#666' }}>
          Перезапуск сканера...
        </div>
      )}

      <div style={{ display: isScanning ? 'block' : 'none' }}>
        <div className={styles.videoContainer}>
          <div 
            id={scannerId} 
            style={{ 
              width: '100%',
              maxWidth: '800px',
              margin: '0 auto'
            }}
          ></div>
          
          <button 
            className={styles.buttonSecondary} 
            onClick={stopScanning}
            style={{ marginTop: '10px' }}
          >
            Остановить
          </button>
        </div>
      </div>

      {barcode && (
        <div className={styles.result}>
          <h2 className={styles.resultTitle}>Штрих-код:</h2>
          <div className={styles.barcodeValue}>{barcode}</div>
          <button 
            className={styles.button} 
            onClick={reset}
          >
            Сканировать еще
          </button>
        </div>
      )}

      {error && (
        <div className={styles.error}>
          {error}
        </div>
      )}
    </div>
  );
}


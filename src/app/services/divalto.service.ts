import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DivaltoService {

  private base = 'http://localhost:5110/api/divalto';

  constructor(private http: HttpClient) {}

  getStatus(): Observable<any> {
    return this.http.get(`${this.base}/status`);
  }

  getFactures(): Observable<any[]> {
    return this.http.get<any[]>(`${this.base}/factures`);
  }

  getHistory(): Observable<any[]> {
    return this.http.get<any[]>(`${this.base}/history`);
  }

  getConfig(): Observable<any> {
    return this.http.get(`${this.base}/config`);
  }

  syncNow(): Observable<any> {
    return this.http.post(`${this.base}/sync`, {});
  }

  setAutoSync(enabled: boolean): Observable<any> {
    return this.http.post(`${this.base}/auto-sync`, { enabled });
  }

  saveConfig(config: any): Observable<any> {
    return this.http.post(`${this.base}/config`, config);
  }

  testConnection(config: any): Observable<any> {
    return this.http.post(`${this.base}/test-connection`, config);
  }
}
import { Component } from '@angular/core';
import { HabboDefaultApiService, HabboEndpointDefinition } from '../services/habbo-default-api.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  readonly endpoints = this.habboApi.endpoints;

  selectedEndpointId = this.endpoints[0]?.id ?? '';
  activeEndpoint: HabboEndpointDefinition = this.endpoints[0];
  fieldValues: Record<string, string> = {};

  loading = false;
  errorMessage = '';
  requestUrl = '';
  responseBody: unknown = null;

  constructor(private readonly habboApi: HabboDefaultApiService) {
    this.resetFields(this.activeEndpoint);
  }

  onEndpointChange(endpointId: string): void {
    const endpoint = this.endpoints.find((item) => item.id === endpointId);
    if (!endpoint) {
      return;
    }

    this.activeEndpoint = endpoint;
    this.resetFields(endpoint);
    this.errorMessage = '';
    this.requestUrl = '';
    this.responseBody = null;
  }

  carregarEndpoint(): void {
    if (!this.activeEndpoint) {
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.requestUrl = this.habboApi.buildUrl(this.activeEndpoint, this.fieldValues);

    this.habboApi.request(this.activeEndpoint, this.fieldValues).subscribe({
      next: (payload) => {
        this.responseBody = payload;
        this.loading = false;
      },
      error: (error) => {
        this.responseBody = null;
        this.loading = false;
        this.errorMessage = error?.message ?? 'Erro ao carregar endpoint.';
      }
    });
  }

  private resetFields(endpoint: HabboEndpointDefinition): void {
    this.fieldValues = {};

    [...(endpoint.params ?? []), ...(endpoint.queryParams ?? [])].forEach((param) => {
      this.fieldValues[param.key] = param.defaultValue;
    });
  }
}

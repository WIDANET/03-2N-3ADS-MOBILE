import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface HabboEndpointParam {
  key: string;
  label: string;
  defaultValue: string;
  required?: boolean;
}

export interface HabboEndpointDefinition {
  id: string;
  label: string;
  pathTemplate: string;
  notes?: string;
  params?: HabboEndpointParam[];
  queryParams?: HabboEndpointParam[];
}

@Injectable({
  providedIn: 'root'
})
export class HabboDefaultApiService {
  readonly baseUrl = 'https://www.habbo.com.br/api/public';

  readonly endpoints: HabboEndpointDefinition[] = [
    {
      id: 'hotel',
      label: 'Hotel status',
      pathTemplate: '/hotel'
    },
    {
      id: 'community',
      label: 'Community highlights',
      pathTemplate: '/community'
    },
    {
      id: 'articles-kind',
      label: 'Articles by kind',
      pathTemplate: '/articles/{kind}',
      params: [
        { key: 'kind', label: 'Kind', defaultValue: 'news', required: true }
      ]
    },
    {
      id: 'articles-kind-page',
      label: 'Articles by kind and page',
      pathTemplate: '/articles/{kind}/{page}',
      params: [
        { key: 'kind', label: 'Kind', defaultValue: 'news', required: true },
        { key: 'page', label: 'Page', defaultValue: '1', required: true }
      ]
    },
    {
      id: 'campaign',
      label: 'Campaign by key',
      pathTemplate: '/campaigns/{key}',
      params: [
        { key: 'key', label: 'Campaign key', defaultValue: 'main' }
      ]
    },
    {
      id: 'user-search',
      label: 'User search',
      pathTemplate: '/users',
      queryParams: [
        { key: 'name', label: 'Name', defaultValue: 'Habbo' }
      ]
    },
    {
      id: 'user-profile',
      label: 'User profile',
      pathTemplate: '/users/{uniqueId}',
      params: [
        { key: 'uniqueId', label: 'Unique ID', defaultValue: 'hhbr-3ea7d95af6bd6d6276639fef7ba0afba' }
      ]
    },
    {
      id: 'user-friends',
      label: 'User friends',
      pathTemplate: '/users/{uniqueId}/friends',
      params: [
        { key: 'uniqueId', label: 'Unique ID', defaultValue: 'hhbr-3ea7d95af6bd6d6276639fef7ba0afba' }
      ]
    },
    {
      id: 'user-badges',
      label: 'User badges',
      pathTemplate: '/users/{uniqueId}/badges',
      params: [
        { key: 'uniqueId', label: 'Unique ID', defaultValue: 'hhbr-3ea7d95af6bd6d6276639fef7ba0afba' }
      ]
    },
    {
      id: 'user-groups',
      label: 'User groups',
      pathTemplate: '/users/{uniqueId}/groups',
      params: [
        { key: 'uniqueId', label: 'Unique ID', defaultValue: 'hhbr-3ea7d95af6bd6d6276639fef7ba0afba' }
      ]
    },
    {
      id: 'user-rooms',
      label: 'User rooms',
      pathTemplate: '/users/{uniqueId}/rooms',
      params: [
        { key: 'uniqueId', label: 'Unique ID', defaultValue: 'hhbr-3ea7d95af6bd6d6276639fef7ba0afba' }
      ]
    },
    {
      id: 'group-profile',
      label: 'Group profile',
      pathTemplate: '/groups/{groupId}',
      params: [
        { key: 'groupId', label: 'Group ID', defaultValue: '395982' }
      ]
    },
    {
      id: 'group-members',
      label: 'Group members',
      pathTemplate: '/groups/{groupId}/members',
      params: [
        { key: 'groupId', label: 'Group ID', defaultValue: '395982' }
      ]
    },
    {
      id: 'room-profile',
      label: 'Room profile',
      pathTemplate: '/rooms/{roomId}',
      params: [
        { key: 'roomId', label: 'Room ID', defaultValue: '83933211' }
      ]
    },
    {
      id: 'room-participants',
      label: 'Room participants',
      pathTemplate: '/rooms/{roomId}/participants',
      params: [
        { key: 'roomId', label: 'Room ID', defaultValue: '83933211' }
      ]
    }
  ];

  constructor(private readonly http: HttpClient) {}

  buildUrl(endpoint: HabboEndpointDefinition, values: Record<string, string>): string {
    const resolvedPath = endpoint.pathTemplate.replace(/\{(.*?)\}/g, (_, key: string) => {
      return encodeURIComponent(values[key] ?? '');
    });

    const queryParams = endpoint.queryParams ?? [];
    const params = queryParams.reduce((httpParams, param) => {
      const value = values[param.key] ?? '';
      return value ? httpParams.set(param.key, value) : httpParams;
    }, new HttpParams());

    const queryString = params.toString();
    return `${this.baseUrl}${resolvedPath}${queryString ? `?${queryString}` : ''}`;
  }

  request(endpoint: HabboEndpointDefinition, values: Record<string, string>): Observable<unknown> {
    const url = this.buildUrl(endpoint, values);
    return this.http.get(url);
  }
}

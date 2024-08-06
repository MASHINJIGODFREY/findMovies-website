import { HttpResponse } from "@angular/common/http";

export class Cache{
  url!: string;
  responseMap!: CacheResponse;
}

export class CacheResponse{
  response!: HttpResponse<any>;
  date!: Date;
}

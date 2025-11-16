// src/app/pipes/filter.pipe.ts
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'filter', standalone: true })
export class FilterPipe implements PipeTransform {
  transform(items: any[], term: string, field: string): any[] {
    if (!items || !term) return items;
    const lower = term.toLowerCase();
    return items.filter(item => 
      (item[field] || '').toString().toLowerCase().includes(lower)
    );
  }
}
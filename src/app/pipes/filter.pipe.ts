// src/app/pipes/filter.pipe.ts
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'filter' })
export class FilterPipe implements PipeTransform {
  transform(items: any[], searchText: string, property: string = 'fullName'): any[] {
    if (!items || !searchText) return items;
    searchText = searchText.toLowerCase();
    return items.filter(item => 
      item[property]?.toString().toLowerCase().includes(searchText)
    );
  }
}
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'simpleDate', standalone: true })
export class SimpleDatePipe implements PipeTransform {
  transform(value: string | null | undefined): string {
    if (!value) return '';
    const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(value);
    return match ? `${match[3]}/${match[2]}/${match[1]}` : value;
  }
}

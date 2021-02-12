import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'cropText',
})
export class CropTextPipe implements PipeTransform {
  transform(value: string, cropLength: number) {
    if (value.length > cropLength) {
      return value.substr(0, cropLength) + '...';
    } else {
      return value;
    }
  }
}

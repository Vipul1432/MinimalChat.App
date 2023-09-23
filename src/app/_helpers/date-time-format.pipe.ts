import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateTimeFormat'
})
export class DateTimeFormatPipe implements PipeTransform {
  transform(value: string): string {
    const date = new Date(value);

    // Check if the date is valid
    if (!isNaN(date.getTime())) {
      const formattedDate = `${date.getFullYear()}-${this.padZero(date.getMonth() + 1)}-${this.padZero(date.getDate())} ` +
        `${this.padZero(date.getHours())}:${this.padZero(date.getMinutes())}:${this.padZero(date.getSeconds())}`;

      return formattedDate;
    } else {
      return value;
    }
  }

  private padZero(value: number): string {
    return value.toString().padStart(2, '0');
  }
}

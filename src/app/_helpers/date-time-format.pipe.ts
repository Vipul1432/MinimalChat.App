import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateTimeFormat'
})
export class DateTimeFormatPipe implements PipeTransform {

  /**
 * Transforms a string representation of a date and time into a formatted string.
 *
 * @param value - The input string representing a date and time.
 * @returns A formatted string in the "YYYY-MM-DD HH:MM:SS" format, or the original input if the date is invalid.
 */
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

  /**
 * Pads a number with leading zeros to ensure it has at least two digits.
 *
 * @param value - The number to be padded.
 * @returns The padded number as a string.
 */
  private padZero(value: number): string {
    return value.toString().padStart(2, '0');
  }
}

import { Component, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { GiphyService } from '../../_shared/services/giphy.service';

@Component({
  selector: 'app-gif-picker',
  templateUrl: './gif-picker.component.html',
  styleUrls: ['./gif-picker.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class GifPickerComponent {
  gifs: any[] = [];
  query: string = '';

  @Output() gifSelected = new EventEmitter<string>();

  constructor(private giphyService: GiphyService) { }

  searchGifs() {
    if (this.query.trim()) {
      this.giphyService.searchGifs(this.query).subscribe(response => {
        this.gifs = response.data;
      });
    }
  }

  selectGif(gifUrl: string) {
    this.gifSelected.emit(gifUrl);
  }
}

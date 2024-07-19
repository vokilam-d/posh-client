import { Component, computed, input } from '@angular/core';
import { NgOptimizedImage, UpperCasePipe } from '@angular/common';

@Component({
  selector: 'app-img',
  standalone: true,
  imports: [
    NgOptimizedImage,
    UpperCasePipe,
  ],
  templateUrl: './img.component.html',
  styleUrl: './img.component.scss'
})
export class ImgComponent {
  url = input<string | null>(null);
  name = input<string>('');

  nameAbbr = computed<string>(() => {
    const nameParts = this.name().split(' ');
    if (nameParts.length > 2 && nameParts[1].length < 3) {
      nameParts.splice(1, 1);
    }

    return nameParts
      .slice(0, 2)
      .map(namePart => namePart[0])
      .join('');
  });
}

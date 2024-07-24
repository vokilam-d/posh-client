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
  withColor = input<boolean>(true);

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

  backgroundColor = computed<string>(() => {
    return this.withColor() ? this.getColor(this.hashStr(this.name())) : 'transparent';
  });

  private hashStr(str: string): number {
    let hash = 0;
    if (str.length === 0) return hash;
    for (let i = 0; i < str.length; i++) {
      const chr = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + chr;
      hash |= 0; // Convert to 32bit integer
    }
    return hash;
  }

  private getColor(num: number): string {
    const hue = num * 137.508; // use golden angle approximation
    return `hsl(${hue},50%,75%)`;
  }
}

